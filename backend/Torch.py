import torch

import os
import pandas as pd
import json
from google.cloud import aiplatform
import openai


class Transformation:
    def __init__(self, passage):
        self.openai_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_key:
            raise ValueError("Openai_API_KEY not found in environment variables")
        self.passage = passage
        self.dream = ""
        self.themes = []
        self.symbols = []
    def get_system_prompt(self):

        return """YOU ARE A DREAMS INTERPRETER. You will be given a dream and you will interpret it using common dream symbolism and themes.
        You will also provide insights into the dreamer's subconscious mind and emotional state based on the dream"""    

    def get_data(self):
        folder_path = "./dreams"
        count = 0
        all_files = []
        for i in os.listdir(folder_path):
            if i.endswith(".json"):
                count += 1
                all_files.append(i)
        dreams = []
        for i in all_files:
            full_name = os.path.join(folder_path, i)
            with open(full_name, "r") as f:
                data = json.load(f)
                for x in data["dreams"]:
                    dreams.append({"content": x.get("content", "")})

        df = pd.DataFrame(dreams)
        self.data_frame = df
    def get_embeddings(self, text):
        """
        Get vector embeddings for a given text using OpenAI's text-embedding-ada-002 model.
        """
        response = openai.Embedding.create(
            model="text-embedding-ada-002",
            input=text
        )
        embeddings = response['data'][0]['embedding']
        return embeddings


    def llm_processing(self):
        # we are going to use openai and
        # print(5)
        self.openai_key
        prompt = f"""
        Analyze this dream{self.dream} and its themes{self.themes}. Give a detailed response to why someone may be having these dreams and using these symbols, 
        {self.symbols} explain what they represent. Tell the person whether they would need to go be more mindful of their activities if theyre dreams
        are very negative. Explain also any emotional undertones they might be going through."""
        chat = openai.ChatCompletion.create(
            model="google/gemini-2.0-flash-001",
            messages=[{"role": "user", "content": prompt}],
        )
        return chat
