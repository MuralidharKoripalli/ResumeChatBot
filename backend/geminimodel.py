import os
import google.generativeai as genai
import dotenv

dotenv.load_dotenv()

genai.configure(api_key=os.getenv("GENERATIVE_AI_API_KEY"))

#generation setting
gen_settings ={
    "temperature":0.5,
    "top_p": 0.8,
    "top_k":64,
    "max_output_tokens":10000
}

model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=gen_settings)

