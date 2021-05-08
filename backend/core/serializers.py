from rest_framework import serializers
from rest_framework.serializers import Serializer,ModelSerializer, IntegerField
from .models import *

class SkillSerializer(ModelSerializer):
    class Meta:
        model = Skill
        fields = ['title','id']

class VendorSerializer(ModelSerializer):
    class Meta:
        model = Vendor
        fields = ['name','id']


class ResourceSerializer(ModelSerializer):
    skills = SkillSerializer(many=True)
    vendor = VendorSerializer()
    class Meta:
        model = Resource
        fields = ['id','skills','vendor','start_date','location','is_color','gender','role','role_level','is_employee',"name"]

class ProductSerializer(ModelSerializer):
    resources = ResourceSerializer(many=True,required=False)
    class Meta:
        model = Product
        fields = ['id','product_title','product_description','start_date','end_date','location','resources','requirements']

class ProductResourceInfoSerializer(ModelSerializer):
    product = ProductSerializer()
    resource = ResourceSerializer()
    class Meta:
        model = ProductResourceInfo
        fields = ['id','product','resource','start_date','end_date','positions','is_employee']

class ContractorSerializer(ModelSerializer):
    vendor = serializers.SerializerMethodField("get_vendor")
    total = IntegerField()

    def get_vendor(self,object):
        return VendorSerializer(Vendor.objects.get(id=object["vendor"])).data
    class Meta:
        model = Resource
        fields = ['id', 'vendor', 'total']

class LocationSerializer(ModelSerializer):
    total = IntegerField()
    
    class Meta:
        model = Resource
        fields = ['id', 'location', 'total']

class ProductResourceSerializer(ModelSerializer):
    resource = serializers.CharField(source="resource.name")
    product = serializers.CharField(source="product.product_title")
    days = serializers.SerializerMethodField("get_days")

    def get_days(self,object):
        return object.days.days
    class Meta:
        model = ProductResourceInfo
        fields = ['id','product','resource','start_date','end_date', 'days']



