import os
import pandas as pd
import json
import torch
from nltk.corpus import stopwords
from transformers import BertTokenizer, BertModel
from sklearn.cluster import KMeans, DBSCAN, OPTICS
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import umap.umap_ as umap
import hdbscan

filter_words = set([
    "dream","dreamt", "last","night","dreaming", "night","woke", "woke up", "sleep", "slept", "waking", 
    "like", "think", "say", "said", "tell", "knew", "feel", "felt", 
    "remember", "seemed", "see", "saw", "things", "stuff", "part", 
    "time", "way", "place", "something", "someone", "really", "very", 
    "just", "everything", "anything", "nothing", "man", "woman", "guy", 
    "girl", "child", "mother", "father", "brother", "sister", "go", "went", 
    "come", "make", "do", "get", "hold", "house", "room", "car", "street", 
    "door", "window", "table", "chair", "bed", "floor", "wall", "school", 
    "work", "office", "friend", "family", "phone", "call", "laugh", "food", "first", "second", "third","also","try","mr","mrs",
    # Additional transitional/procedural words
    "got", "take", "took", "coming", "going", "around", "across", "along",
    "looking", "found", "started", "began", "brings", "turned", "walking",
    "must", "could", "would", "maybe", "whether", "always", "never",
    
    # Common descriptors
    "many", "much", "high", "small", "huge", "whole", "every", "everybody",
    "right", "left", "back", "front", "top", "bottom",
    "one", "another", "two", "three", "four", "five",
    
    # Additional locations/objects
    "home", "outside", "inside", "somewhere", "anywhere",
    "couch", "desk", "table", "chair",
    "street", "road", "path", "way",
    "gun", "guns", "weapon",
    
    # Common verbs
    "hear", "heard", "know", "knew", "think", "thought",
    "want", "wanted", "need", "needed",
    "look", "looked", "see", "saw", "watch", "watched",
    
    # Time-related
    "today", "tomorrow", "yesterday", "now", "then",
    "morning", "afternoon", "evening", "night",
    
    # Connecting words
    "however", "though", "although", "because", "since",
    "therefore", "thus", "hence", "so"
])

def clean_text(text):
    text = text.lower()
    text = ''.join([char if str(char).isalpha() else ' ' for char in text])
    
    stop_words = set(stopwords.words('english'))
    words = text.split()
    
    words = [word for word in words if len(word) > 2 and word not in stop_words and word not in filter_words]
    words = list(dict.fromkeys(words))
    
    if len(words) < 3:
        return ""
    
    return ' '.join(words)

def get_improved_embeddings(texts):
    tokenizer = BertTokenizer.from_pretrained('bert-large-uncased')
    model = BertModel.from_pretrained('bert-large-uncased')
    
    batch_size = 32
    all_embeddings = []
    
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i + batch_size]
        inputs = tokenizer(batch_texts, return_tensors="pt", padding=True, truncation=True, max_length=512)
        
        with torch.no_grad():
            outputs = model(**inputs)
            embeddings = outputs.last_hidden_state[:, 0, :]
            all_embeddings.append(embeddings)
    
    return torch.cat(all_embeddings, dim=0)

def try_multiple_clustering(embeddings):
    scaler = StandardScaler()
    embeddings_scaled = scaler.fit_transform(embeddings)
    
    umap_reducer = umap.UMAP(
        n_neighbors=15,
        min_dist=0.1,
        metric='cosine',
        random_state=42
    )
    umap_embeddings = umap_reducer.fit_transform(embeddings_scaled)
    
    hdbscan_clusterer = hdbscan.HDBSCAN(
        min_cluster_size=15,
        min_samples=5,
        cluster_selection_epsilon=0.1,
        metric='euclidean',
        prediction_data=True
    )
    hdbscan_labels = hdbscan_clusterer.fit_predict(embeddings_scaled)
    
    optics = OPTICS(
        min_samples=10,
        max_eps=2.0,
        metric='cosine',
        cluster_method='xi'
    )
    optics_labels = optics.fit_predict(embeddings_scaled)
    
    dbscan = DBSCAN(
        eps=0.5,
        min_samples=5,
        metric='cosine'
    )
    dbscan_labels = dbscan.fit_predict(embeddings_scaled)
    
    fig, axes = plt.subplots(1, 3, figsize=(20, 6))
    
    axes[0].scatter(umap_embeddings[:, 0], umap_embeddings[:, 1], 
                   c=hdbscan_labels, cmap='tab20', alpha=0.6)
    axes[0].set_title(f'HDBSCAN Clustering\n{len(np.unique(hdbscan_labels))} clusters')
    
    axes[1].scatter(umap_embeddings[:, 0], umap_embeddings[:, 1], 
                   c=optics_labels, cmap='tab20', alpha=0.6)
    axes[1].set_title(f'OPTICS Clustering\n{len(np.unique(optics_labels))} clusters')
    
    axes[2].scatter(umap_embeddings[:, 0], umap_embeddings[:, 1], 
                   c=dbscan_labels, cmap='tab20', alpha=0.6)
    axes[2].set_title(f'DBSCAN Clustering\n{len(np.unique(dbscan_labels))} clusters')
    
    plt.tight_layout()
    plt.show()
    
    return {
        'hdbscan': hdbscan_labels,
        'optics': optics_labels,
        'dbscan': dbscan_labels,
        'umap_coords': umap_embeddings
    }

def analyze_cluster_quality(embeddings, labels):
    if len(np.unique(labels)) <= 1:
        return None
    
    try:
        silhouette = silhouette_score(embeddings, labels)
        return {
            'silhouette': silhouette,
            'n_clusters': len(np.unique(labels[labels != -1])),
            'noise_points': np.sum(labels == -1)
        }
    except:
        return None

def get_data():
    folder_path = "./dreams"
    count = 0
    all_files = []
    for i in os.listdir(folder_path):
        if i.endswith('.json'):
            count+=1
            all_files.append(i)
    dreams = []
    for i in all_files:
        full_name = os.path.join(folder_path,i)
        with open(full_name,'r') as f:
            data = json.load(f)
            for x in data['dreams']:
                cleaned_content = clean_text(x.get("content", ""))
                dreams.append({
                    "content": cleaned_content
                })
                
    return pd.DataFrame(dreams)

# Main processing
df = get_data()
