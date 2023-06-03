from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import StockMedia
from .serializers import StockMediaSerializer


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def stock_media_list(request):
    """List all stock media"""
    if request.method == 'GET':
        media = StockMedia.objects.all()
        serializer = StockMediaSerializer(media, many=True)
        return Response(serializer.data)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
