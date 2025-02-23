from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .ai_processor import DreamAnalyzer
import logging
from django.shortcuts import get_object_or_404
from .models import Dream
from .auth import SupabaseAuthentication
from supabase import create_client
from django.conf import settings

logger = logging.getLogger(__name__)
dream_analyzer = DreamAnalyzer()

@api_view(['POST'])
@authentication_classes([SupabaseAuthentication])
@permission_classes([IsAuthenticated])
async def submit_dream(request):
    """
    Submit a new dream for analysis and save to Supabase
    """
    try:
        dream_text = request.data.get('dream_text')
        if not dream_text:
            return Response({'error': 'Dream text is required'}, status=400)
            
        # Process dream through AI pipeline
        result = await dream_analyzer.analyze_dream(dream_text)
        
        # Create Supabase client
        supabase = create_client(
            settings.SUPABASE['URL'],
            settings.SUPABASE['KEY']
        )
        
        # Save to Supabase
        response = supabase.table('Dreams').insert({
            'user_id': request.user.username,
            'dream_text': dream_text,
            'themes_symbols': result.get('themes', []),
            'interpretation': result.get('analysis', ''),
        }).execute()
        
        if not response.data:
            raise Exception('Failed to save dream to database')
            
        dream = response.data[0]
        
        return Response({
            'status': 'success',
            'data': {
                'dream_id': dream['dream_id'],
                'dream_text': dream['dream_text'],
                'themes': dream['themes_symbols'],
                'analysis': dream['interpretation'],
                'created_at': dream['timestamp']
            }
        })
    except Exception as e:
        logger.error(f"Error processing dream: {str(e)}")
        return Response({
            'error': 'An error occurred while processing your dream',
            'details': str(e)
        }, status=500)

@api_view(['GET'])
@authentication_classes([SupabaseAuthentication])
@permission_classes([IsAuthenticated])
def get_dream_history(request):
    """
    Get user's dream history from Supabase
    """
    try:
        # Create Supabase client
        supabase = create_client(
            settings.SUPABASE['URL'],
            settings.SUPABASE['KEY']
        )
        
        # Use the authenticated user_id from the token
        user_id = request.user.username
        
        # Fetch dreams from Supabase
        response = supabase.table('Dreams') \
            .select('*') \
            .eq('user_id', user_id) \
            .order('timestamp', desc=True) \
            .execute()
            
        return Response({
            'dreams': [{
                'dream_id': dream['dream_id'],
                'dream_text': dream['dream_text'],
                'themes': dream['themes_symbols'],
                'analysis': dream['interpretation'],
                'created_at': dream['timestamp']
            } for dream in response.data]
        })
    except Exception as e:
        logger.error(f"Error fetching dream history: {str(e)}")
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@authentication_classes([SupabaseAuthentication])
@permission_classes([IsAuthenticated])
def get_dream(request, dream_id):
    """
    Retrieve a specific dream by ID from Supabase
    """
    try:
        # Create Supabase client
        supabase = create_client(
            settings.SUPABASE['URL'],
            settings.SUPABASE['KEY']
        )
        
        # Use the authenticated user_id from the token
        user_id = request.user.username  # This is the Supabase user ID from our auth
        
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
        logger.error(f"Error fetching dream: {str(e)}")
        return Response({'error': str(e)}, status=500) 