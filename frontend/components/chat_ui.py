import streamlit as st

def render_chat_history():
    """Exibe todo o histórico de mensagens salvas na sessão."""
    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

def render_chat_input():
    """Captura a entrada do usuário."""
    return st.chat_input("Digite sua mensagem: ")

def append_message(role: str, content: str):
    """Adiciona uma nova mensagem ao histórico da sessão."""
    st.session_state.messages.append({"role": role, "content": content})
    with st.chat_message(role):
        st.markdown(content)