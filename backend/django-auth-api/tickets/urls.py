from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_user_tickets, name='user_tickets'),
    path('book/', views.book_ticket, name='book_ticket'),
    path('<int:ticket_id>/', views.get_ticket_detail, name='ticket_detail'),
    path('<int:ticket_id>/cancel/', views.cancel_ticket, name='cancel_ticket'),
]