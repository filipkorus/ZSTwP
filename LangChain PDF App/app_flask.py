# import streamlit as st
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain

app = Flask(__name__)
conversation_chain = None


@app.route('/chat_with_pdfs', methods=['POST'])
def chat_with_pdfs():
    global conversation_chain  # Access the global conversation_chain variable
    pdf_urls = request.json.get('pdf_urls', [])
    
    # Get PDF text
    text = get_pdf_text(pdf_urls)
    
    # Get text chunks
    text_chunks = get_text_chunks(text)
    
    # Create vector store
    vectorstore = get_vectorstore(text_chunks)
    
    # Create conversation chain
    conversation_chain = get_conversation_chain(vectorstore)
    
    return jsonify({'message': 'Ready for chat!'})


@app.route('/ask_question', methods=['POST'])
def ask_question():
    global conversation_chain  # Access the global conversation_chain variable
    question = request.json.get('question', '')
    
    if conversation_chain is None:
        return jsonify({'error': 'Conversation chain not initialized'}), 500
    
    response = handle_userinput(question, conversation_chain)
    
    return jsonify({'response': response})


def get_pdf_text(pdf_urls):
    text = ""
    for url in pdf_urls:
        text += retrieve_pdf_contents(url)
        # pdf_reader = PdfReader(pdf_contents)
        # for page in pdf_reader.pages:
        #       text += page.extract_text()
    return text
            
def retrieve_pdf_contents(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
        with open('temp_pdf.pdf', 'wb') as f:
            f.write(response.content)

        text = ""
        with open('temp_pdf.pdf', 'rb') as f:
            pdf_reader = PdfReader(f)
            for page in pdf_reader.pages:
                text += page.extract_text()

        return text
    except Exception as e:
        print(f"Error retrieving PDF from URL {url}: {e}")
        return None

def get_text_chunks(text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=4000,
        chunk_overlap=800,
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    return chunks
    
def get_vectorstore(text_chunks):
    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore
    
def get_conversation_chain(vectorstore):
    llm = ChatOpenAI()
    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain
    
def handle_userinput(user_question, conversation_chain):
    response = conversation_chain({'question': user_question})
    
    chat_history = response.get('chat_history', [])
    response_messages = []
    
    for i, message in enumerate(chat_history):
        if i % 2 == 0:
            response_messages.append(message.content)
        else:
            response_messages.append(message.content)
    
    return response_messages

if __name__ == '__main__':
    app.run(debug=True)
