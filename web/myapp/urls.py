from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('callback/', views.auth_callback, name='auth_callback'),
    # API endpoints
    path('api/dreams/', api.submit_dream, name='submit_dream'),
    path('api/dreams/history/', api.get_dream_history, name='dream_history'),
] 