import streamlit as st

def render_sidebar():
    with st.sidebar:
        st.title("⚙️ Configurações: ")

        # Seleção de Modelo
        model = st.selectbox(
            "Modelo de IA", ["gpt-4o", "gpt-3.5-turbo", "claude-3-5-sonnet", "gemini-pro"]
        )

        # Hiperparâmetros
        temperature = st.slider(
            "Temperatura(Criatividade)",
            min_value = 0.0,
            max_value = 1.0,
            value = 0.7,
            step = 0.05
        )

        system_prompt = st.text_area(
            "Instrução do Sistema (System Prompt)",
            value="Você é um assistente virtual prestativo e amigável.",
            height=100
        )

        st.divider()

        # Ação para limpar o chat
        if st.button("🗑️ Limpar Conversa", use_containner_width = True):
            st.session_state.messages = []
            st.rerun()

        return {
            "model": model,
            "temperature": temperature,
            "system_prompt": system_prompt
        }