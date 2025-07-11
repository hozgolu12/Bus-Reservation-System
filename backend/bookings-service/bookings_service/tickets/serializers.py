from rest_framework import serializers
from .models import Ticket


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"
        read_only_fields = ("user", "ticket_number", "booking_date", "updated_at")


class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            "passenger_name",
            "passenger_email",
            "passenger_phone",
            "route_id",
            "route_name",
            "bus_id",
            "bus_number",
            "departure_date",
            "departure_time",
            "arrival_time",
            "seat_numbers",
            "price_per_seat",
            "total_price",
        ]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class TicketListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            "id",
            "ticket_number",
            "passenger_name",
            "route_name",
            "bus_number",
            "departure_date",
            "departure_time",
            "seat_numbers",
            "total_price",
            "status",
            "booking_date",
        ]
