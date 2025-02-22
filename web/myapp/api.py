from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_dream(request):
    """
    Submit a new dream for analysis
    """
    try:
        dream_text = request.data.get('dream_text')
        if not dream_text:
            return Response({'error': 'Dream text is required'}, status=400)
            
        # TODO: Add dream processing logic here
        
        return Response({
            'status': 'processing',
            'message': 'Dream submitted successfully'
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

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