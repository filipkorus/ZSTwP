from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from langchain.agents import Tool, AgentType, initialize_agent
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
import re
from unidecode import unidecode

# Załaduj zmienne środowiskowe
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
port_num = os.getenv('PORT')
production = int(os.getenv('PRODUCTION')) if type(os.getenv('PRODUCTION')) != type(1) else os.getenv('PRODUCTION')
file_upload_location = os.getenv('FILE_UPLOAD_LOCATION') # being used only when production==1

class DocumentInput(BaseModel):
    question: str = Field()

llm = ChatOpenAI(temperature=0, model="gpt-4o")

app = Flask(__name__)
cors = CORS(app)

def sanitize_filename(filename):
    sanitized_name = unidecode(filename.replace('-', ' '))
    sanitized_name = re.sub(r'[^a-zA-Z0-9\s]', '', sanitized_name)
    sanitized_name = sanitized_name.replace(' ', '-')
    
    return sanitized_name

def convert_to_html(text):
    text = re.sub(r'^\s*###\s*(.*?)\s*$', r'<h3>\1</h3>', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*##\s*(.*?)\s*$', r'<h2>\1</h2>', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*#\s*(.*?)\s*$', r'<h1>\1</h1>', text, flags=re.MULTILINE)
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\n\s*---\s*\n', r'<hr>', text)
    text = text.replace('\n', '<br>')
    text = f'<p>{text}</p>'
    
    return text

@app.route("/check_inquiry/", methods=["POST"])
@cross_origin()
def check_inquiry():
    try:
        data = request.json
        pdf_files = data["pdf_files"]
        custom_question = data.get("custom_question")

        tools = []

        files = [
            {
                "name": "My-company-Capabilities",
                "path": "pdf_files/requirements/output.pdf",
                "description": "List of applications and functionalities that my company is capable of doing",
            },
        ]

        for file in pdf_files:
            sanitized_name = sanitize_filename(file["name"])
            files.append(
                {
                    "name": sanitized_name,
                    "path": ('pdf_files/uploads/' if production != 1 else file_upload_location) + file["url"],
                    "description": "Business inquiry, with detailed informations about what client expects",
                }
            )

        print(files)

        for file in files:
            loader = PyPDFLoader(file["path"])
            pages = loader.load_and_split()
            text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
            docs = text_splitter.split_documents(pages)
            embeddings = OpenAIEmbeddings()
            retriever = FAISS.from_documents(docs, embeddings).as_retriever()

            tools.append(
                Tool(
                    args_schema=DocumentInput,
                    name=file["name"],
                    description=f"useful when you want to answer questions about {file['name']}. {file['description']}",
                    func=RetrievalQA.from_chain_type(llm=llm, retriever=retriever),
                )
            )

        agent = initialize_agent(
            agent=AgentType.OPENAI_MULTI_FUNCTIONS,
            tools=tools,
            llm=llm,
            verbose=True,
        )

        if custom_question:
            final_question = custom_question
        else:
            file_names = [sanitize_filename(file["name"]) for file in files[1:]]
            file_names_str = ", ".join(file_names)
            final_question = f"List similar topics from My-company-Capabilities which are in inquiry files: {file_names_str}"
        
        # WARN -> final question has prompt len limits, be carefull with CUSTOM prompt len, may cause API errors, TO DO FIX :))) pozdrawiam
        document_input = DocumentInput(question=final_question)
        response = agent({"input": document_input})
        response_serializable = {
            "input": document_input.dict(),
            "output": convert_to_html(response['output'])
        }
        
        return jsonify(response_serializable)
    
    except Exception as e:
        app.logger.error(f"Exception on /check_inquiry API: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port_num)
