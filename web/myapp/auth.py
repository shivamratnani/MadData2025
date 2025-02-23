from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import jwt
from django.conf import settings
from django.contrib.auth.models import User

class SupabaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]
        try:
            # Decode the JWT token
            payload = jwt.decode(
                token,
                settings.SUPABASE['JWT_SECRET'],
                algorithms=['HS256'],
                audience='authenticated'
            )
            
            # Get the user ID from the token
            user_id = payload.get('sub')
            if not user_id:
                raise AuthenticationFailed('Invalid token payload')

            # Get or create user
            user, _ = User.objects.get_or_create(
                username=user_id,
                defaults={'email': payload.get('email', '')}
            )
            
            return (user, None)
            
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'Invalid token: {str(e)}')
        except Exception as e:
            raise AuthenticationFailed(f'Authentication failed: {str(e)}') 