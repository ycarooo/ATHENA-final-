#Para estruturar a interface do seu chat em Python é necessário usar um framework
#como o Streamlit, CustomTkinter, PyQt ou Flet
#adapte o código exatamente à estrutura do framework que você escolheu.

import streamlit as st
from sidebar import render_sidebar
from chat_ui import render_chat_history, render_chat_input, append_message

# Configuração da página
st.set_page_config(page_title = "AI Chat", page_icon = "🦉")

# Renderiza a sidebar e obtém as configurações
config = render_sidebar()

# Renderiza o histórico de chat existente
render_chat_history()

# Captura nova entrada do usuário
if user_prompt := render_chat_input():
    # 1. Mostra a mensagem do usuário na tela e salva no histórico
    append_message("user", user_prompt)

    # 2. Resposta simulada (Substitua pela chamada real à sua API de IA aqui)
    ai_response = f"Resposta simulada usando o modelo **{config['model']}** com temperatura **{config['temperature']}**."

    # 3. Mostra a resposta da IA na tela e salva no histórico
    append_message("assistant", ai_response)