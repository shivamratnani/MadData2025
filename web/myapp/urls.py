from django.urls import path
from . import views
from . import api

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('callback/', views.auth_callback, name='auth_callback'),
    # API endpoints
    path('api/dreams/', api.submit_dream, name='submit_dream'),
    path('api/dreams/history/', api.get_dream_history, name='dream_history'),
    path('api/dreams/<int:dream_id>/', api.get_dream, name='get_dream'),
    path('api/dream-dictionary/', views.get_dream_dictionary, name='dream_dictionary'),
] 