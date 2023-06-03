from django.urls import path
from accounts.views import (
    register, login,
    logout,
    user_detail,
    password_change,
    email_change,
    user_delete,
    favourites_list,
    favourite_media
)
from bookings.views import licence_quote_list, editorial_booking_list
from media.views import stock_media_list


urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('user_detail/', user_detail, name='user_detail'),
    path('password_change/', password_change, name='password_change'),
    path('email_change/', email_change, name='email_change'),
    path('user_delete/', user_delete, name='user_delete'),
    path('licence_quotes/', licence_quote_list, name='licence_quotes'),
    path('editorial_bookings/', editorial_booking_list, name='editorial_bookings'),
    path('favourites/', favourites_list, name='favourites'),
    path('favourite_media/<int:media_id>/', favourite_media, name='favourite_media'),
    path('stock_media/', stock_media_list, name='stock_media'),
]
