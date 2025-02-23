from transformers import BertTokenizer, BertModel
import torch
import os
from openai import OpenAI
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class DreamAnalyzer:
    def __init__(self):
        # Initialize OpenAI client for OpenRouter
        self.client = OpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url=os.getenv("OPENROUTER_BASE_URL")
        )
        
        # Initialize BERT
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.bert_model = BertModel.from_pretrained('bert-base-uncased')

    async def extract_themes(self, dream_text):
        """Extract themes using BERT model"""
        try:
            # Tokenize and prepare input
            inputs = self.tokenizer(
                dream_text,
                return_tensors="pt",
                max_length=512,
                truncation=True,
                padding=True
            )
            
            # Get BERT embeddings
            with torch.no_grad():
                outputs = self.bert_model(**inputs)
            
            # Process embeddings to extract themes
            # This is a placeholder - implement your theme extraction logic here
            themes = ["placeholder_theme_1", "placeholder_theme_2"]
            
            return themes
        except Exception as e:
            logger.error(f"Error in BERT processing: {str(e)}")
            raise

    async def get_openai_analysis(self, dream_text, themes):
        """Get detailed analysis through OpenRouter"""
        try:
            prompt = f"""Analyze this dream and its themes:
            Dream: {dream_text}
            Extracted Themes: {', '.join(themes)}
            
            Provide a detailed psychological analysis including:
            1. Key symbols and their meanings
            2. Emotional undertones
            3. Possible interpretations
            4. Connections to the dreamer's psyche"""

            response = self.client.chat.completions.create(
                model="google/palm-2",
                messages=[{"role": "user", "content": prompt}],
                headers={
                    "HTTP-Referer": "http://localhost:3000",  # Your site domain
                    "X-Title": "Dream Analyzer"
                }
            )
            
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error in OpenRouter processing: {str(e)}")
            raise

    async def analyze_dream(self, dream_text):
        """Complete dream analysis pipeline"""
        try:
            themes = await self.extract_themes(dream_text)
            analysis = await self.get_openai_analysis(dream_text, themes)
            return {
                "themes": themes,
                "analysis": analysis,
                "dream_text": dream_text
            }
        except Exception as e:
            logger.error(f"Error in dream analysis: {str(e)}")
            raise 