from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import Dream
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BaseAuthentication, TokenAuthentication, SessionAuthentication
from supabase import create_client
import jwt

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

class SupabaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        try:
            # Verify the JWT token using your Supabase JWT secret
            decoded = jwt.decode(
                token,
                settings.SUPABASE['JWT_SECRET'],
                algorithms=['HS256'],
                audience='authenticated'
            )
            user_id = decoded.get('sub')
            return (user_id, None)
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

@api_view(['GET'])
@authentication_classes([SupabaseAuthentication])
@permission_classes([IsAuthenticated])
def get_dream(request, dream_id):
    try:
        # Create Supabase client
        supabase = create_client(
            settings.SUPABASE['URL'],
            settings.SUPABASE['KEY']
        )
        
        # Use the authenticated user_id from the token
        user_id = request.user  # This will be the sub claim from the JWT
        
        # Fetch dream from Supabase
        response = supabase.table('Dreams') \
            .select('*') \
            .eq('dream_id', dream_id) \
            .eq('user_id', user_id) \
            .execute()
            
        if not response.data:
            return Response({'error': 'Dream not found'}, status=404)
            
        dream = response.data[0]
        
        return Response({
            'dream_id': dream['dream_id'],
            'dream_text': dream['dream_text'],
            'themes': dream['themes_symbols'],
            'analysis': dream['interpretation'],
            'created_at': dream['timestamp']
        })
        
    except Exception as e:
        print(f"Error fetching dream: {str(e)}")
        return Response({'error': str(e)}, status=500)
