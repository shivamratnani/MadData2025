import os
import pandas as pd
import json
from transformers import BertTokenizer, BertModel, BertForSequenceClassification
import torch
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from sklearn.cluster import KMeans
import matplotlib as plt
import logging
import nltk
from sklearn.decomposition import PCA
nltk.download('stopwords')
class similar_words():
    def __init__(self,passage):
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.bert_model = BertModel.from_pretrained('bert-base-uncased')
        self.empty = []
        self.data_frame = pd.DataFrame(self.empty)
        # Initialize Gemini client
        self.passage  = passage
        self.dream  = ""
        self.vectorizer = ""
        self.matrix = None
        self.stop_words = set(stopwords.words('english'))
    def clean_text(text):
        text = text.lower()  # Lowercase
        text = ''.join([char if char.isalnum() else ' ' for char in text])  # Remove punctuation
        text = ' '.join([word for word in text.split() if word not in self.stop_words])  # Remove stopwords
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
                        cleaned_content = self.clean_text(x.get("content", ""))
                        dreams.append({
                            "content": cleaned_content
                        })
                        
            df = pd.DataFrame(dreams)
            return df
        
    def vectorize_texts(self):
        self.data_frame = self.get_data()
        vects = TfidfVectorizer(self.stop_words)
        matrix = vects.fit_transform(self.data_frame['content'])
        self.vectorizer = vects
        self.matrix = matrix
        return matrix
    def perform_kmeans(self, n_clusters=5):
        matrix_sample = self.vectorize_texts()
        matrix_sample = matrix_sample[:200]
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        cluster_labels = kmeans.fit_predict(matrix_sample)
        self.data_frame.loc[:200, 'cluster'] = cluster_labels
        return cluster_labels
    def analyze_clusters(self):
        for i in range(5):  # Assuming 5 clusters
            cluster_dreams = self.data_frame[self.data_frame['cluster'] == i]
            print(f"\nCluster {i}:")
            print(f"Number of dreams: {len(cluster_dreams)}")
            print("Sample dream from this cluster:")
            print(cluster_dreams['content'].iloc[0])
            print("\n---")

    def visualize_clusters(self):
        pca = PCA(n_components=2)
        reduced_features = pca.fit_transform(self.matrix[:200].toarray())
        
        plt.figure(figsize=(10, 8))
        plt.scatter(reduced_features[:, 0], reduced_features[:, 1], c=self.data_frame['cluster'][:200])
        plt.title('Dream Clusters Visualization')
        plt.xlabel('First Principal Component')
        plt.ylabel('Second Principal Component')
        plt.colorbar(label='Cluster Label')
        plt.show()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    try:
        analyzer = similar_words("Your initial passage here")
        logging.info("Vectorizing texts...")
        analyzer.vectorize_texts()
        
        logging.info("Performing K-means clustering...")
        analyzer.perform_kmeans()
        
        logging.info("Analyzing clusters...")
        analyzer.analyze_clusters()
        
        logging.info("Visualizing clusters...")
        analyzer.visualize_clusters()
        
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
    


# what we do is we load the data frame in the same way we did the 
#the  we get a score for each of the dreams so use tf-idf
#add the scores into the dataframe
#then we can clean the data in a few steps
# if we have to get teh themes we can do that in the same way we did in torch.py
# split into train test
# model fir we can do tensorlfow pytorch or even sci kit learn if we have to
