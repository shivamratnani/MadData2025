from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .ai_processor import DreamAnalyzer
import logging

logger = logging.getLogger(__name__)
dream_analyzer = DreamAnalyzer()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
async def submit_dream(request):
    """
    Submit a new dream for analysis
    """
    try:
        dream_text = request.data.get('dream_text')
        if not dream_text:
            return Response({'error': 'Dream text is required'}, status=400)
            
        # Process dream through AI pipeline
        result = await dream_analyzer.analyze_dream(dream_text)
        
        # Save to database
        # TODO: Implement database save logic
        
        return Response({
            'status': 'success',
            'data': result
        })
    except Exception as e:
        logger.error(f"Error processing dream: {str(e)}")
        return Response({
            'error': 'An error occurred while processing your dream',
            'details': str(e)
        }, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dream_history(request):
    """
    Get user's dream history
    """
    try:
        # TODO: Add dream history retrieval logic
        return Response({
            'dreams': []  # Placeholder
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500) 