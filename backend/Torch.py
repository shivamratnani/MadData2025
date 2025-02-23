import torch
from transformers import BertTokenizer, BertModel, BertForSequenceClassification
import os
import pandas as pd
import json
from google.cloud import aiplatform
import openai


class Transformation:
    def __init__(self, passage):
        # Initialize BERT
        self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        self.bert_model = BertModel.from_pretrained("bert-base-uncased")
        self.empty = []
        self.data_frame = pd.DataFrame(self.empty)
        # Initialize Gemini client
        self.openai_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_key:
            raise ValueError("Openai_API_KEY not found in environment variables")
        self.passage = passage
        self.dream = ""
        self.themes = []
        self.symbols = []

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

    def get_Bert_Features(self, sentence):
        # model from bert trained
        self.model = BertModel.from_pretrained("bert-base-uncased")
        # tokenizer will break the sentence down and split into word array and then
        self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        text = "I had a dream about flying"
        # this is the input that automozatically converts into nunmbers
        inputs = self.tokenizer(
            text, return_tensors="pt", max_length=512, truncation=True, padding=True
        )
        # print(inputs)

        # print("dinfosdnfosdnofsdn")
        # another waybof going about it where we can break it down
        inp = self.tokenizer.tokenize(sentence)
        # then convert each word into a numerical value
        ids = self.tokenizer.convert_tokens_to_ids(inp)
        # print(ids)
        # convert the numerical array into a tensor
        tens_ids = torch.tensor(ids)
        # want to
        with torch.no_grad():
            outputs = self.model(**inputs)
<<<<<<< HEAD
        last_hidden_state = outputs.last_hidden_state  
        pooled_output = outputs.pooler_output 
        return pooled_output 
=======
        last_hidden_state = outputs.last_hidden_state
        pooled_output = outputs.pooler_output
        return last_hidden_state
>>>>>>> efe01513d6042bd04ef7357997deec3644fdb8f0

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
