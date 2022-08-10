from rest_framework import permissions

class UserIsVerifiedPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):

        
        if not request.user.is_verified:
            return False
        return True