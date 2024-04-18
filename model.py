from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import CTransformers
from langchain.chains import RetrievalQA
from flask import Flask , jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

DB_FAISS_PATH = 'vectorstore/db_faiss'

custom_prompt_template = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

def set_custom_prompt():
    """
    Prompt template for QA retrieval for each vectorstore
    """
    prompt = PromptTemplate(template=custom_prompt_template,
                            input_variables=['context', 'question'])
    return prompt

#Retrieval QA Chain
def retrieval_qa_chain(llm, prompt, db):
    qa_chain = RetrievalQA.from_chain_type(llm=llm,
                                       chain_type='stuff',
                                       retriever=db.as_retriever(search_kwargs={'k': 2}),
                                       return_source_documents=True,
                                       chain_type_kwargs={'prompt': prompt}
                                       )
    return qa_chain

#Loading the model
def load_llm():
    # Load the locally downloaded model here
    llm = CTransformers(
        model = "TheBloke/Llama-2-7B-Chat-GGML",
        model_type="llama",
        max_new_tokens = 512,
        temperature = 0.5
    )
    return llm

#QA Model Function
def qa_bot():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2",
                                       model_kwargs={'device': 'cpu'})
    db = FAISS.load_local(DB_FAISS_PATH, embeddings,allow_dangerous_deserialization=True)
    llm = load_llm()
    qa_prompt = set_custom_prompt()
    qa = retrieval_qa_chain(llm, qa_prompt, db)

    return qa

qa_result = qa_bot()

#output function
def final_result(query):
    
    result = qa_result({'query': query})
    source_documents_serialized = []
    for document in result['source_documents']:
        document_dict = {
            'page_content': document.page_content,
            'metadata': document.metadata
        }
        source_documents_serialized.append(document_dict)
    
    # Construct the final result with serialized source documents
    final_result = {
        'query': result['query'],
        'result': result['result'],
        'source_documents': source_documents_serialized
    }
    
    return final_result

@app.route('/api', methods=['POST'])
def get_my_answer():
    try:
        data = request.get_json()  
        prompt = data.get('message', '')  
        res = final_result(prompt)  
        return jsonify({'response': res})  
    except Exception as e:
        return jsonify({'error': str(e)}) 
    

@app.route('/')
def main():
    try:
        return "recived"
    except Exception:
        return "ERROR!"


app.run(debug=True,port=3000)