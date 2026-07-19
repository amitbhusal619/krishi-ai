from datetime import timedelta

import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import WeatherLookup

CACHE_MINUTES = 30


class CurrentWeatherView(APIView):
    """
    GET /api/weather/?location=Kathmandu
    GET /api/weather/?lat=27.7&lon=85.3

    Proxies OpenWeatherMap. Set OPENWEATHER_API_KEY in the environment.
    Falls back to a clear error if the key isn't configured, so the frontend
    can show a friendly "weather unavailable" state instead of crashing.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        location = request.query_params.get("location")
        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")

        if not location and not (lat and lon):
            return Response({"detail": "Provide ?location= or ?lat=&lon="}, status=status.HTTP_400_BAD_REQUEST)

        cache_key = location or f"{lat},{lon}"
        cached = WeatherLookup.objects.filter(location=cache_key).first()
        if cached and cached.fetched_at > timezone.now() - timedelta(minutes=CACHE_MINUTES):
            return Response(cached.payload)

        if not settings.OPENWEATHER_API_KEY:
            return Response(
                {"detail": "Weather API key not configured on the server (OPENWEATHER_API_KEY)."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        params = {"appid": settings.OPENWEATHER_API_KEY, "units": "metric"}
        if location:
            params["q"] = location
        else:
            params["lat"] = lat
            params["lon"] = lon

        try:
            resp = requests.get("https://api.openweathermap.org/data/2.5/weather", params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
        except requests.RequestException as exc:
            return Response({"detail": f"Weather provider error: {exc}"}, status=status.HTTP_502_BAD_GATEWAY)

        WeatherLookup.objects.update_or_create(
            location=cache_key,
            defaults={"latitude": lat, "longitude": lon, "payload": data},
        )
        return Response(data)


class ForecastView(APIView):
    """GET /api/weather/forecast/?location=Kathmandu — 5-day / 3-hour forecast."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        location = request.query_params.get("location")
        if not location:
            return Response({"detail": "Provide ?location="}, status=status.HTTP_400_BAD_REQUEST)

        if not settings.OPENWEATHER_API_KEY:
            return Response(
                {"detail": "Weather API key not configured on the server (OPENWEATHER_API_KEY)."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        params = {"appid": settings.OPENWEATHER_API_KEY, "units": "metric", "q": location}
        try:
            resp = requests.get("https://api.openweathermap.org/data/2.5/forecast", params=params, timeout=10)
            resp.raise_for_status()
        except requests.RequestException as exc:
            return Response({"detail": f"Weather provider error: {exc}"}, status=status.HTTP_502_BAD_GATEWAY)

        return Response(resp.json())
