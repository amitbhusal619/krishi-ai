from django.urls import path

from .views import CurrentWeatherView, ForecastView

urlpatterns = [
    path("", CurrentWeatherView.as_view(), name="weather-current"),
    path("forecast/", ForecastView.as_view(), name="weather-forecast"),
]
