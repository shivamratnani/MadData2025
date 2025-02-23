from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('callback/', views.auth_callback, name='auth_callback'),
    # API endpoints - remove 'api/' prefix since it's in main urls.py
    path('dreams/', api.submit_dream, name='submit_dream'),
    path('dreams/history/', api.get_dream_history, name='dream_history'),
    path('dreams/<int:dream_id>/', api.get_dream, name='get_dream'),
] 