import os, json
from datetime import datetime
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import requests

load_dotenv()
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')

@app.get('/')
def home():
    return render_template('index.html', supabase_url=os.getenv('SUPABASE_URL',''), supabase_key=os.getenv('SUPABASE_ANON_KEY',''))


@app.post('/api/chat')
def chat():
    if not GEMINI_API_KEY:
        return jsonify({
            'error': 'A chave da IA não foi configurada no arquivo .env.'
        }), 503

    data = request.get_json(force=True)
    messages = data.get('messages', [])[-12:]

    system = '''Você é Athena, uma assistente acolhedora de organização para pessoas neurodivergentes.
Fale em português brasileiro, com clareza, gentileza e sem julgamento.
Não pressione nem trate produtividade como valor pessoal.
Ajude a quebrar tarefas em passos pequenos e ofereça escolhas simples.

Quando a pessoa pedir para agendar algo, responda também com uma ação estruturada JSON no formato:
<ACTION>{"type":"create_task","title":"...","date":"YYYY-MM-DD","time":"HH:MM","notes":"..."}</ACTION>

Só crie ação quando houver informação suficiente; pergunte o que falta.
Para timer, use type timer e minutes.
Nunca afirme que salvou algo sem a aplicação confirmar.'''

    contents = []

    for m in messages:
        role = 'model' if m.get('role') == 'assistant' else 'user'
        contents.append({
            'role': role,
            'parts': [{'text': str(m.get('content', ''))}]
        })

    try:
        url = (
            'https://generativelanguage.googleapis.com/v1beta/models/'
            f'{GEMINI_MODEL}:generateContent'
        )

        r = requests.post(
            url,
            headers={
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
            json={
                'system_instruction': {
                    'parts': [{'text': system}]
                },
                'contents': contents,
                'generationConfig': {
                    'temperature': 0.7
                }
            },
            timeout=45
        )

        if not r.ok:
            try:
                detalhe = r.json().get('error', {}).get('message', r.text)
            except Exception:
                detalhe = r.text

            print(f'ERRO GEMINI {r.status_code}: {detalhe}')

            return jsonify({
                'error': f'Erro Gemini ({r.status_code}): {detalhe}'
            }), 502

        resultado = r.json()

        if not resultado.get('candidates'):
            print('GEMINI SEM CANDIDATOS:', resultado)

            return jsonify({
                'error': 'A IA não retornou uma resposta. Tente novamente.'
            }), 502

        resposta = resultado['candidates'][0]['content']['parts'][0]['text']

        return jsonify({'reply': resposta})

    except requests.Timeout:
        print('ERRO: Gemini demorou demais para responder.')

        return jsonify({
            'error': 'A IA demorou muito para responder. Tente novamente.'
        }), 502

    except requests.RequestException as e:
        print(f'ERRO DE CONEXÃO GEMINI: {e}')

        return jsonify({
            'error': 'Não consegui conectar à IA. Confira sua internet.'
        }), 502

    except Exception as e:
        print(f'ERRO INTERNO DO CHAT: {e}')

        return jsonify({
            'error': 'Ocorreu um erro interno ao processar sua mensagem.'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
