from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'passenger_name', 'route_name', 'bus_number', 'departure_date', 'status', 'booking_date')
    list_filter = ('status', 'departure_date', 'booking_date')
    search_fields = ('ticket_number', 'passenger_name', 'passenger_email', 'route_name', 'bus_number')
    readonly_fields = ('ticket_number', 'booking_date', 'updated_at')
    ordering = ('-booking_date',)
    
    fieldsets = (
        ('Ticket Information', {
            'fields': ('ticket_number', 'status', 'booking_date', 'updated_at')
        }),
        ('Passenger Details', {
            'fields': ('user', 'passenger_name', 'passenger_email', 'passenger_phone')
        }),
        ('Journey Details', {
            'fields': ('route_id', 'route_name', 'bus_id', 'bus_number', 'departure_date', 'departure_time', 'arrival_time', 'seat_numbers')
        }),
        ('Pricing', {
            'fields': ('price_per_seat', 'total_price')
        }),
    )