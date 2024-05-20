from langchain.agents import Tool
from langchain.chains import RetrievalQA
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from pydantic import BaseModel, Field

from langchain.agents import AgentType, initialize_agent
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

class DocumentInput(BaseModel):
    question: str = Field()


# llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
llm = ChatOpenAI(temperature=0, model="gpt-4o")

tools = []
files = [

    {
        "name": "My-company-Functions",
        "path": "pdf_files/requirements/output.pdf",
        # "description":"Highlights the details, range and scope of services and capabilities offered by my company",
        "description":"List of functions and technologies that my company is capable of doing",
    },

    {
        "name": "Client-business-inquiry",
        "path": "pdf_files/test.pdf",
        "description":"Business inquiry, with detailed informations about what client expects",
    },
]

for file in files:
    loader = PyPDFLoader(file["path"])
    pages = loader.load_and_split()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(pages)
    embeddings = OpenAIEmbeddings()
    retriever = FAISS.from_documents(docs, embeddings).as_retriever()

    # Wrap retrievers in a Tool
    tools.append(
        Tool(
            args_schema=DocumentInput,
            name=file["name"],
            description=file["description"],
            # description=f"useful when you want to answer questions about {file['name']}",
            func=RetrievalQA.from_chain_type(llm=llm, retriever=retriever),
        )
    )


agent = initialize_agent(
    agent=AgentType.OPENAI_MULTI_FUNCTIONS,
    tools=tools,
    llm=llm,
    verbose=True,
)

document_input = DocumentInput(question="List functions from My-company-Functions similar to requirements from Client-business-inquiry. Provide brief details.")
response = agent({"input": document_input})

# document_input = DocumentInput(question="List functions from My-company-Functions similar to requirements from Client-business-inquiry. Provide brief details.")
# response = agent({"input": document_input})

# response = agent({"input": "List a few of my company capabilities from My-company-capabilities"})
print(response)
print(llm.model_name)









# from langchain_community.document_loaders import PyPDFLoader
# from dotenv import load_dotenv
# import os

# load_dotenv()
# api_key = os.getenv('OPENAI_API_KEY')

# inquiry = PyPDFLoader("pdf_files/test.pdf")







# # loader = PyPDFLoader("https://arxiv.org/pdf/2302.03803.pdf") #mozna tez dac mu argument jako url :))))
# pages = inquiry.load_and_split()
# # for i in range (0, len(pages)):
# #     print(pages[i])
# # print(pages)

