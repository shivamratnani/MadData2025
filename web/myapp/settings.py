import os

SUPABASE = {
    'URL': os.getenv('SUPABASE_URL', 'https://asvklpcdktvzxpfcezzu.supabase.co'),
    'KEY': os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmtscGNka3R2enhwZmNlenp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDg5MDUsImV4cCI6MjA1NTgyNDkwNX0.xa_irWra_MGXGpISOd5AlDoCw6y6Qi7FuaDQ97aWVw4'),
    'CALLBACK_URL': os.getenv('SUPABASE_CALLBACK_URL', 'http://localhost:8000/auth/callback'),
    'JWT_SECRET': 'qAT/31QI8bnqxZcd9utwkEobTmGlZ3+8CW+kC1wZCIB0+M81FvOXJEsa5/u6qh1P1pZUmF5tt+HCq+Dk3IQQIg=='
}

# OpenAI and OpenRouter settings
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENROUTER_BASE_URL = os.getenv('OPENROUTER_BASE_URL')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'myapp.auth.SupabaseAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
} 