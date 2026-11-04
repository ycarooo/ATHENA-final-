# Athena 🦉
Aplicação web inicial funcional: Flask (Python) + HTML/CSS/JavaScript + Supabase Auth/Postgres/Storage + Gemini API.

## Configuração (uma vez)
1. Instale Python 3.10+.
2. Crie projeto gratuito em https://supabase.com/ e copie Project URL e anon/public key em `.env` (copie `.env.example` para `.env`).
3. No Supabase, abra **SQL Editor**, execute `schema.sql`.
4. Em **Storage**, crie bucket `diary-images` como **Private**. As políticas de acesso estão no `schema.sql`.
5. Crie uma chave gratuita no Google AI Studio: https://aistudio.google.com/apikey e coloque `GEMINI_API_KEY` no `.env`. A chave fica no servidor, não no navegador.
6. No terminal, dentro da pasta:
   ```bash
   python -m venv .venv
   # Windows: .venv\Scripts\activate
   # macOS/Linux: source .venv/bin/activate
   pip install -r requirements.txt
   python app.py
   ```
7. Abra http://127.0.0.1:5000

## O que já está incluído
- Cadastro/login por e-mail e senha (Supabase Auth)
- Agenda por data, tarefas, horário, conclusão e timer
- Chat com Gemini; reconhece pedido explícito de agendamento e grava tarefa após confirmação da API
- Diário com emoji de humor, texto, data e imagens anexas
- Mini-jogo de pulo da corujinha
- Interface responsiva dark, roxo e rosa

## Observações importantes
- Gratuito dentro das cotas atuais dos serviços; quotas e disponibilidade podem mudar. O Supabase Free pode pausar projetos inativos. Gemini Free tem limites de requisição e modelos disponíveis; consulte os links oficiais.
- Para publicar para outras pessoas, use um host com plano gratuito compatível com Flask e configure as mesmas variáveis de ambiente. Nunca publique `.env` nem a chave Gemini.
- O bucket privado é configurado, mas para exibir imagens de diário com segurança em produção, o ideal é gerar signed URLs no servidor ou persistir caminhos e buscar URLs temporárias após login. Esta versão usa URL pública do objeto; se mantiver o bucket privado, troque a parte de renderização para signed URLs (recomendado antes de uso real).
- Este é um MVP funcional, não um produto clínico nem substituto de apoio profissional. Não promete diagnósticos ou tratamento.
