# from urllib.parse import parse_qs
# from channels.db import database_sync_to_async
# from django.contrib.auth.models import AnonymousUser
# from rest_framework_simplejwt.tokens import UntypedToken
# from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
# from django.contrib.auth import get_user_model

# from django.contrib.auth.models import AnonymousUser
# from django.contrib.auth import get_user_model
# from channels.db import database_sync_to_async
# from rest_framework_simplejwt.tokens import UntypedToken
# from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
# from urllib.parse import parse_qs

# @database_sync_to_async
# def get_user(validated_token):
#     User = get_user_model()   # ✅ apps are loaded now
#     try:
#         user_id = validated_token["user_id"]
#         return User.objects.get(id=user_id)
#     except User.DoesNotExist:
#         return AnonymousUser()


# class JWTAuthMiddleware:
#     def __init__(self, inner):
#         self.inner = inner

#     def __call__(self, scope):
#         return JWTAuthMiddlewareInstance(scope, self.inner)

# class JWTAuthMiddlewareInstance:
#     def __init__(self, scope, inner):
#         self.scope = scope
#         self.inner = inner

#     async def __call__(self, receive, send):
#         query_string = parse_qs(self.scope["query_string"].decode())
#         token = query_string.get("token")

#         if token:
#             try:
#                 validated_token = UntypedToken(token[0])
#                 self.scope["user"] = await get_user(validated_token)
#             except (InvalidToken, TokenError):
#                 self.scope["user"] = AnonymousUser()
#         else:
#             self.scope["user"] = AnonymousUser()

#         inner = self.inner(self.scope)
#         return await inner(receive, send)
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model

@database_sync_to_async
def get_user(validated_token):
    User = get_user_model()
    try:
        user_id = validated_token["user_id"]
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Parse token from query string
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token")

        if token:
            try:
                validated_token = UntypedToken(token[0])
                scope["user"] = await get_user(validated_token)
            except (InvalidToken, TokenError):
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        # Call the inner application
        return await self.inner(scope, receive, send)
