from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('callback/', views.auth_callback, name='auth_callback'),
] 