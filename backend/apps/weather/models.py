from django.db import models


class WeatherLookup(models.Model):
    """Caches recent weather lookups so we don't hammer the upstream API."""

    location = models.CharField(max_length=150)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    payload = models.JSONField()
    fetched_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [models.Index(fields=["location"])]

    def __str__(self):
        return f"Weather<{self.location}>"
