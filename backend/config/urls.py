from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

try:
    from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
except ImportError:
    SpectacularAPIView = None
    SpectacularSwaggerView = None

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("apps.accounts.urls")),
    path("api/products/", include("apps.products.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/payments/", include("apps.payments.urls")),
    path("api/ai/", include("apps.ai_tools.urls")),
    path("api/weather/", include("apps.weather.urls")),
    path("api/notifications/", include("apps.notifications.urls")),
    path("api/blog/", include("apps.blog.urls")),
    path("api/contact/", include("apps.contact.urls")),
    path("api/analytics/", include("apps.analytics.urls")),

    # API docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
