import os
import pandas as pd
import json
import torch
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))
def clean_text(text):
    text = text.lower()  # Lowercase
    text = ''.join([char if char.isalnum() else ' ' for char in text])  # Remove punctuation
    text = ' '.join([word for word in text.split() if word not in stop_words])  # Remove stopwords
    return text

# what we do is we load the data frame in the same way we did the 
def get_data(self):
        folder_path = "./dreams"
        count = 0
        all_files = []
        for i in os.listdir(folder_path):
            if i.endswith('.json'):
                count+=1
                all_files.append(i)
        dreams = []
        for i in all_files:
            full_name  = os.path.join(folder_path,i)
            with open(full_name,'r') as f:
                data = json.load(f)
                for x in data['dreams']:
                    cleaned_content = clean_text(x.get("content", ""))
                    dreams.append({
                        "content": cleaned_content
                    })
                    
        df = pd.DataFrame(dreams)
        self.data_frame = df
#the  we get a score for each of the dreams so use tf-idf
#add the scores into the dataframe
#then we can clean the data in a few steps
# if we have to get teh themes we can do that in the same way we did in torch.py
# split into train test
# model fir we can do tensorlfow pytorch or even sci kit learn if we have to
