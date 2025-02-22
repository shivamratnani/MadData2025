from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

def login_page(request):
    return render(request, 'myapp/login.html')

@csrf_exempt
def auth_callback(request):
    # Handle the Supabase callback
    return JsonResponse({'status': 'success'})
