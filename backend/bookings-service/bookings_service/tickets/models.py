from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Ticket(models.Model):
    STATUS_CHOICES = [
        ("confirmed", "Confirmed"),
        ("cancelled", "Cancelled"),
        ("completed", "Completed"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    ticket_number = models.CharField(max_length=20, unique=True)
    passenger_name = models.CharField(max_length=100)
    passenger_email = models.EmailField()
    passenger_phone = models.CharField(max_length=15)

    # Route and Bus information (stored as references to external service)
    route_id = models.CharField(max_length=50)
    route_name = models.CharField(max_length=200)
    bus_id = models.CharField(max_length=50)
    bus_number = models.CharField(max_length=50)

    # Journey details
    departure_date = models.DateField()
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    seat_numbers = models.JSONField()  # Array of seat numbers

    # Pricing
    price_per_seat = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    # Status and timestamps
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="confirmed"
    )
    booking_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-booking_date"]

    def __str__(self):
        return f"{self.ticket_number} - {self.passenger_name}"

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            # Generate unique ticket number
            import uuid

            self.ticket_number = f"TKT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
