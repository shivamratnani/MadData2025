from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Dream(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dream_text = models.TextField()
    themes = models.JSONField()  # Stores extracted themes
    analysis = models.TextField()  # Stores Gemini analysis
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

class DreamAnalysis(models.Model):
    dream = models.ForeignKey(Dream, on_delete=models.CASCADE, related_name='analyses')
    analysis_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
