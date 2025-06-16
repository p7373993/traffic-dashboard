from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Intersection, TrafficVolume
from .serializers import IntersectionSerializer, TrafficVolumeSerializer
from django.db.models import Sum, Max
from django.db.models import Q
from datetime import datetime, timedelta

class IntersectionViewSet(viewsets.ModelViewSet):
    queryset = Intersection.objects.all()
    serializer_class = IntersectionSerializer

    def get_queryset(self):
        # 볼륨 데이터가 있는 교차로만 필터링
        return Intersection.objects.filter(
            Q(trafficvolume__isnull=False) & 
            ~Q(trafficvolume__volume_north=0, trafficvolume__volume_south=0, 
               trafficvolume__volume_east=0, trafficvolume__volume_west=0)
        ).distinct()

class TrafficVolumeViewSet(viewsets.ModelViewSet):
    queryset = TrafficVolume.objects.all()
    serializer_class = TrafficVolumeSerializer

    def get_queryset(self):
        queryset = TrafficVolume.objects.all()
        intersection_id = self.request.query_params.get('intersection_id', None)
        date = self.request.query_params.get('date', None)
        
        if intersection_id:
            queryset = queryset.filter(intersection_id=intersection_id)
        if date:
            queryset = queryset.filter(date=date)
            
        return queryset.order_by('time')

@api_view(['GET'])
def get_traffic_volume_by_intersection(request, intersection_id):
    try:
        # 특정 교차로의 모든 교통량 데이터 조회
        volumes = TrafficVolume.objects.filter(intersection_id=intersection_id)
        serializer = TrafficVolumeSerializer(volumes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def get_traffic_volume_by_date(request):
    try:
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'error': 'Date parameter is required'}, status=400)
        
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        volumes = TrafficVolume.objects.filter(date=date)
        serializer = TrafficVolumeSerializer(volumes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
def get_traffic_volume_by_date_range(request):
    try:
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')
        
        if not start_date_str or not end_date_str:
            return Response({'error': 'Start date and end date parameters are required'}, status=400)
        
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d').date()
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        
        volumes = TrafficVolume.objects.filter(date__range=[start_date, end_date])
        serializer = TrafficVolumeSerializer(volumes, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=400) 