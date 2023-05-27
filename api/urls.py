from django.urls import path
from accounts.views import register, login, logout, user_detail, password_change, email_change, user_delete

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('user_detail/', user_detail, name='user_detail'),
    path('password_change/', password_change, name='password_change'),
    path('email_change/', email_change, name='email_change'),
    path('user_delete/', user_delete, name='user_delete'),
]
