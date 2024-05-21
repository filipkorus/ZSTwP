from flask import Flask, request, jsonify
from langchain.agents import Tool, AgentType, initialize_agent
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv

# Załaduj zmienne środowiskowe
load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
port_num = os.getenv('PORT')

class DocumentInput(BaseModel):
    question: str = Field()

llm = ChatOpenAI(temperature=0, model="gpt-4o")

app = Flask(__name__)

@app.route("/check_inquiry/", methods=["POST"])
def check_inquiry():
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
        files.append(
            {
                "name": file["name"],
                "path": file["url"],
                "description": "Business inquiry, with detailed informations about what client expects",
            }
        )

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

    try:
        if custom_question:
            final_question = custom_question
        else:
            file_names = [file["name"] for file in files[1:]]
            file_names_str = ", ".join(file_names)
            final_question = f"List similar topics from My-company-Functions and inquiry files: {file_names_str}"
        
        # WARN -> final question has prompt len limits, be carefull with CUSTOM prompt len, may cause API errors, TO DO FIX :))) pozdrawiam
        document_input = DocumentInput(question=final_question)
        response = agent({"input": document_input})
        response_serializable = {
            "input": document_input.dict(),
            "output": response['output']
        }
        
        return jsonify(response_serializable)
    
    except Exception as e:
        app.logger.error(f"Exception on /check_inquiry API: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port_num)
