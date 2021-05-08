from rest_framework.serializers import Serializer,ModelSerializer
from .models import Skill,Vendor, Resource, Product

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
        fields = ['id','skills','vendor','start_date','current_end_date','location','is_color','gender','role','role_level','is_employee']

class ProductSerializer(ModelSerializer):
    resources = ResourceSerializer(many=True,required=False)
    class Meta:
        model = Product
        fields = ['id','product_title','product_description','start_date','end_date','location','resources','requirements']

class ProductResourceInfoSerializer(ModelSerializer):
    product = ProductSerializer()
    resource = ResourceSerializer()
    class Meta:
        fields = ['id','product','resource','start_date','end_date','positions','is_employee']