from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json

# Create your views here.

def login_page(request):
    return render(request, 'myapp/login.html', {
        'supabase_url': settings.SUPABASE['URL'],
        'callback_url': settings.SUPABASE['CALLBACK_URL']
    })

@csrf_exempt
def auth_callback(request):
    """Handle Supabase authentication callback"""
    try:
        # The token will be handled client-side by Supabase
        return JsonResponse({
            'status': 'success',
            'message': 'Authentication successful'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
