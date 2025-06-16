from rest_framework import serializers
from .models import Intersection, TrafficVolume

class TrafficVolumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrafficVolume
        fields = '__all__'

class IntersectionSerializer(serializers.ModelSerializer):
    volume_north = serializers.SerializerMethodField()
    volume_south = serializers.SerializerMethodField()
    volume_east = serializers.SerializerMethodField()
    volume_west = serializers.SerializerMethodField()

    class Meta:
        model = Intersection
        fields = ['id', 'name', 'latitude', 'longitude', 'volume_north', 'volume_south', 'volume_east', 'volume_west']

    def get_volume_north(self, obj):
        latest_volume = TrafficVolume.objects.filter(intersection=obj).order_by('-date', '-time').first()
        return latest_volume.volume_north if latest_volume else 0

    def get_volume_south(self, obj):
        latest_volume = TrafficVolume.objects.filter(intersection=obj).order_by('-date', '-time').first()
        return latest_volume.volume_south if latest_volume else 0

    def get_volume_east(self, obj):
        latest_volume = TrafficVolume.objects.filter(intersection=obj).order_by('-date', '-time').first()
        return latest_volume.volume_east if latest_volume else 0

    def get_volume_west(self, obj):
        latest_volume = TrafficVolume.objects.filter(intersection=obj).order_by('-date', '-time').first()
        return latest_volume.volume_west if latest_volume else 0 