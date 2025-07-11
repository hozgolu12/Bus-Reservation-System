from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Ticket
from .serializers import TicketSerializer, TicketCreateSerializer, TicketListSerializer
import requests
from django.conf import settings


class TicketPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_tickets(request):
    tickets = Ticket.objects.filter(user=request.user)

    # Filter by status if provided
    status_filter = request.query_params.get("status")
    if status_filter:
        tickets = tickets.filter(status=status_filter)

    paginator = TicketPagination()
    paginated_tickets = paginator.paginate_queryset(tickets, request)
    serializer = TicketListSerializer(paginated_tickets, many=True)

    return paginator.get_paginated_response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def book_ticket(request):
    serializer = TicketCreateSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        # Verify seat availability with NestJS service
        bus_id = serializer.validated_data["bus_id"]
        seat_numbers = serializer.validated_data["seat_numbers"]

        try:
            # Call NestJS service to reserve seats
            nestjs_url = f"http://localhost:3001/api/buses/{bus_id}/reserve"
            response = requests.patch(
                nestjs_url,
                json={"seat_numbers": seat_numbers, "user_id": request.user.id},
            )

            if response.status_code == 200:
                ticket = serializer.save()
                return Response(
                    TicketSerializer(ticket).data, status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"error": "Failed to reserve seats. Please try again."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except requests.RequestException:
            return Response(
                {"error": "Service temporarily unavailable. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def cancel_ticket(request, ticket_id):
    ticket = get_object_or_404(Ticket, id=ticket_id, user=request.user)

    if ticket.status == "cancelled":
        return Response(
            {"error": "Ticket is already cancelled"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Call NestJS service to release seats
        nestjs_url = f"{settings.NESTJS_BUS_SERVICE_BASE_URL}/api/buses/{ticket.bus_id}/cancel"
        response = requests.patch(
            nestjs_url,
            json={"seat_numbers": ticket.seat_numbers, "user_id": request.user.id},
        )

        if response.status_code == 200:
            ticket.status = "cancelled"
            ticket.save()
            return Response(
                {"message": "Ticket cancelled successfully"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"error": "Failed to cancel ticket. Please contact support."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except requests.RequestException:
        return Response(
            {"error": "Service temporarily unavailable. Please try again later."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_ticket_detail(request, ticket_id):
    ticket = get_object_or_404(Ticket, id=ticket_id, user=request.user)
    serializer = TicketSerializer(ticket)
    return Response(serializer.data)
