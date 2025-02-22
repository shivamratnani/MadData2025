import torch
from transformers import BertTokenizer, BertModel, BertForSequenceClassification
import os
import pandas as pd




# Get a list of all .jso files in the folder into list
folder_path = "./dreams"
all_files = []
for i in os.listdir(folder_path):
    if i.endswith('.json'):
        all_files.append(i)
d = []
for i in all_files:
    full_name  = os.path.join(folder_path,i)
    with open(full_name,'r') as f:
        print('Null')



#df = pd.DataFrame(all_files)