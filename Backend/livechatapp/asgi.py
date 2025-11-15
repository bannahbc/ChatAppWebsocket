# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# import Voxa.routing

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "livechatapp.settings")

# from Voxa.middleware import JWTAuthMiddleware

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": JWTAuthMiddleware(
#         URLRouter(
#             Voxa.routing.websocket_urlpatterns
#         )
#     ),
# })
# import os
# from django.core.asgi import get_asgi_application

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "livechatapp.settings")

# # Load Django apps first
# django_asgi_app = get_asgi_application()

# from channels.routing import ProtocolTypeRouter, URLRouter
# from Voxa.middleware import JWTAuthMiddleware
# import Voxa.routing

# application = ProtocolTypeRouter({
#     "http": django_asgi_app,
#     "websocket": JWTAuthMiddleware(
#         URLRouter(
#             Voxa.routing.websocket_urlpatterns
#         )
#     ),
# })
import os
from django.core.asgi import get_asgi_application

# 1. Configure Django settings first
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "livechatapp.settings")

# 2. Load Django apps before importing anything that touches models
django_asgi_app = get_asgi_application()

# 3. Now import Channels and your app code
from channels.routing import ProtocolTypeRouter, URLRouter
from Voxa.middleware import JWTAuthMiddleware
import Voxa.routing

# 4. Define the ASGI application
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(
            Voxa.routing.websocket_urlpatterns
        )
    ),
})
