from fastapi import FastAPI, UploadFile, File, HTTPException,Form 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import os
from dotenv import load_dotenv
from typing import Optional
from pydantic import BaseModel

from google.cloud import storage
from geminimodel import model, genai

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'], #check this
    allow_methods = ['*'],
    allow_headers = ['*'],
)

BUCKET_NAME = os.getenv("GCS_BUCKET_NAME")
if not BUCKET_NAME:
    raise ValueError("BUCKET_NAME environment variable not set.")

storage_client = storage.Client()
bucket = storage_client.bucket(BUCKET_NAME)

chatdata={}
chatdata['messages']= []
stored_resumes =[]
current_resume = ''

class ChatRequest(BaseModel):
    message: str
    resume: Optional[str] = None

@app.get("/list-resumes/")
async def list_resumes():
    try:
        blobs = bucket.list_blobs()
        file_list = [blob.name for blob in blobs] 
        return {"resumes": file_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing resumes: {e}")


@app.post("/uploadfile/")
async def create_upload_file(file: Optional[UploadFile] = File(None)):
    if file:
        try:
            blob = bucket.blob(file.filename)
            blob.upload_from_file(file.file)

            return JSONResponse({"message": "file uploaded"})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error uploading file: {e}")
            
        finally:
            await file.close()
            
    else:
        blobs = bucket.list_blobs()
        file_list = [blob.name for blob in blobs]
        return file_list
    
@app.post("/chat/")
async def chat_request(chat_request: ChatRequest= Form()):  

    global current_resume

    message = chat_request.message
    resume_name = chat_request.resume
    response = ''

    # Check if a resume is uploaded
    if "resume" not in chatdata and (resume_name is None or resume_name ==''):
        response = 'select a resume from dropdown, if dropdown is empty upload a resume'

    elif "resume" in chatdata and current_resume == resume_name:

        response = model.generate_content([chatdata["resume"], message]).text
    
    else:

        blob = bucket.blob(resume_name)
        blob.download_to_filename('temp.pdf')

        chatdata['resume'] = genai.upload_file('temp.pdf')
        current_resume = resume_name
        os.remove('temp.pdf')
        response = model.generate_content([chatdata['resume'], message]).text
    response = f"""
    {response}
    """

    return {"message": response}

