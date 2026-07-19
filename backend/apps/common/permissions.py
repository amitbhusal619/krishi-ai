from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsFarmer(BasePermission):
    """Allows access only to authenticated users with the farmer role."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "farmer"
        )


class IsBuyer(BasePermission):
    """Allows access only to authenticated users with the buyer role."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "buyer"
        )


class IsAdminRole(BasePermission):
    """Allows access only to authenticated users with the admin role."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == "admin" or request.user.is_staff)
        )


class IsOwnerOrReadOnly(BasePermission):
    """Object-level permission: only the owner (obj.owner_field) may edit."""

    owner_field = "user"

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        owner = getattr(obj, self.owner_field, None)
        return owner == request.user


class IsProductOwner(BasePermission):
    """Object-level permission: only the farmer who owns the product may edit it."""

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.farmer_id == request.user.id
