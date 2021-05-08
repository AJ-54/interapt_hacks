from django.shortcuts import render
from .models import *
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import *
from django.http import Http404
from rest_framework.renderers import JSONRenderer
from datetime import datetime
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q,Count,F,ExpressionWrapper, fields
from django.db.models.functions import ExtractDay
import pandas as pd
from datetime import datetime
from django.conf import settings
import os
from django.http import HttpResponse
from .utils import allocate_resources
# Create your views here.

class DiversityView(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        data={
            "gender":{
                    "male":{
                    "colored":Resource.objects.filter(is_color=True,gender="M").count(),
                    "not_colored":Resource.objects.filter(is_color=False,gender="M").count(),
                },
                "female":{
                    "colored":Resource.objects.filter(is_color=True,gender="F").count(),
                    "not_colored":Resource.objects.filter(is_color=False,gender="F").count()
                },
                "other":{
                    "colored":Resource.objects.filter(is_color=True,gender="O").count(),
                    "not_colored":Resource.objects.filter(is_color=False,gender="O").count()
                },
            },
            "total":{
                "colored":Resource.objects.filter(is_color=True).count(),
                "not_colored":Resource.objects.filter(is_color=False).count(),
                "male":Resource.objects.filter(gender="M").count(),
                "female":Resource.objects.filter(gender="F").count(),
                "other":Resource.objects.filter(gender="O").count()
            }
            
        }

        return Response(data,status=status.HTTP_200_OK)


class ContractorView(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        vendor_data = Resource.objects.exclude(vendor=None).values('vendor').annotate(total=Count('vendor')).order_by('total')
        location_data = Resource.objects.exclude(vendor=None).values('location').annotate(total=Count('location')).order_by('total')
        
        data={
            "Vendor": ContractorSerializer(vendor_data, many=True).data,
            "location_wise": LocationSerializer(location_data, many=True).data,
            
        }

        return Response(data,status=status.HTTP_200_OK)


class ProductResourcesView(generics.GenericAPIView):
    serializer_class=ProductResourceInfoSerializer
    renderer_classes=(JSONRenderer,)
    
    def get_object(self):
        return get_object_or_404(Product,pk=int(self.kwargs["product_id"]))
    
    def get_data(self,role):
        object = self.get_object()
        return object.resources_through.filter(resource__role=role)
    
    def get(self,request,*args,**kwargs):
        data={
            "pms":self.serializer_class(self.get_data("PM"),many=True).data,
            "uxs":self.serializer_class(self.get_data("UX"),many=True).data,
            "Engr":self.serializer_class(self.get_data("Engr"),many=True).data
        }
        return Response(data,status=status.HTTP_200_OK)


class LocationResourcesView(generics.GenericAPIView):
    serializer_class=ResourceSerializer
    renderer_classes=(JSONRenderer,)
    
    def get_data(self,baseresources,role, location):

        return baseresources.filter(role=role,location=location)    

    def get(self,request,*args,**kwargs):
        location=self.request.query_params.get("location")
        if location is not None:
            base_resources = Resource.objects.filter(location=location)
            data={
                "pms":self.serializer_class(self.get_data(base_resources,"PM",location),many=True,context=self.get_serializer_context(**kwargs)).data,
                "uxs":self.serializer_class(self.get_data(base_resources,"UX",location),many=True,context=self.get_serializer_context(**kwargs)).data,
                "Engr":self.serializer_class(self.get_data(base_resources,"Engr",location),many=True,context=self.get_serializer_context(**kwargs)).data
            }
            return Response(data,status=status.HTTP_200_OK)
        else :
            return Response("Invalid data",status=status.HTTP_400_BAD_REQUEST)



class GetProductResourcePositionsView(generics.GenericAPIView):
    serializer_class=ProductResourceInfoSerializer
    renderer_classes=(JSONRenderer,)
    
    def get_object(self):
        return get_object_or_404(Product,pk=int(self.kwargs["product_id"]))
    
    def get_product_resources(self):
        object = self.get_object()
        return object.resources_through.all()
    
    def get(self,request,*args,**kwargs):
        resources=self.get_product_resources()
        data={}
        for k,v in request.query_params.items():
            print(k)
            print(v)
            print('---')
            if k in ["PM","UX","Engr"]:
                data[k]=self.serializer_class(resources.filter(resource__role=k),many=True).data
            else :
                check={}
                check[k]=1
                data[k]==self.serializer_class(resources.filter(positions__contains=check),many=True).data

        return Response(data,status=status.HTTP_200_OK)



class ResourceRatio(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        data={
            "pms": Resource.objects.filter(role="PM").count(),
            "uxs": Resource.objects.filter(role="UX").count(),
            "Engr": Resource.objects.filter(role="Engr").count()
        }
        return Response(data,status=status.HTTP_200_OK)


class EngineersRatio(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        data={
            "senior": Resource.objects.filter(role_level="Senior").count(),
            "mid": Resource.objects.filter(role_level="Mid").count(),
            "junior": Resource.objects.filter(role_level="Junior").count()
        }
        return Response(data,status=status.HTTP_200_OK)


class ActiveProducts(generics.ListAPIView):
    renderer_classes=(JSONRenderer,)
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        products = Product.objects.filter(start_date__lte=datetime.now().date(),end_date__gte=datetime.now().date())
        return products
    
        

class ContractorResources(generics.ListAPIView):
    renderer_classes=(JSONRenderer,)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['vendor', 'location']
    serializer_class = ResourceSerializer
    def get_queryset(self):
        return Resource.objects.exclude(vendor=None)


class DashboardData(APIView):
    renderer_classes=(JSONRenderer,)
    def get(self,request,*args,**kwargs):
        data = {}
        data["active_products"]=Product.objects.filter(start_date__lte=datetime.now().date(),end_date__gte=datetime.now().date()).count()
        data["completed_products"]=Product.objects.filter(end_date__lt=datetime.now().date()).count()
        data["contractors"]=Vendor.objects.count()
        data["resources"]=Resource.objects.filter(vendor=None).count()

        return Response(data,status=status.HTTP_200_OK)


class ResourceSkills(generics.RetrieveAPIView):
    renderer_classes=(JSONRenderer,)
    queryset=Resource.objects.all()
    serializer_class=ResourceSerializer

class GetResources(generics.ListAPIView):
    queryset=Resource.objects.all()
    serializer_class=ResourceSerializer

class NextRotationResources(generics.ListAPIView):
    serializer_class= ProductResourceSerializer
    renderer_classes=(JSONRenderer,)

    def get_queryset(self):
        return ProductResourceInfo.objects.exclude(end_date__lte=datetime.now().date()).annotate(days=ExpressionWrapper(datetime.now().date() - F("start_date"),output_field=fields.DurationField())).order_by("-days")[:5]

class AllocateResources(generics.CreateAPIView):
    serializer_class=ProductSerializer
    renderer_classes=(JSONRenderer,)

    def create(self,request,*args,**kwargs):
        print(request.data)
        serializer=self.serializer_class(data = request.data,context={"request":request})
        print(serializer)
        if serializer.is_valid():
            instance =serializer.save()
            allocate_resources(instance)
            data=ProductSerializer(instance,context={"request":request}).data
            return Response(data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


# Data filling scripts

def date_converter(value):
    year = "20"+value[-2:]
    value = value[:-2]+year
    return datetime.strptime(value, "%d/%m/%Y").strftime("%Y-%m-%d")

def ResourceFilling(request):
    base_dir = settings.BASE_DIR
    data = pd.read_csv(os.path.join(base_dir,'mydata.csv'),error_bad_lines=False)
    data = data.where(pd.notnull(data),None)
    resources = data['Name'].tolist() 
    vendor = data['Vendor'].tolist() #
    skill1 = data['Skill 1'].tolist() #
    skill2 = data['Skill 2'].tolist() #
    skill3 = data['Skill 3'].tolist() #
    skill4 = data['Skill 4'].tolist() #
    print(vendor)
    start_date = data['Start Date'].tolist()
    current_end_date = data['resource product end date'].tolist()  #
    location = data['Location'].tolist() 
    gender = data['Gender'].tolist()
    color = data['Color (Y/N)'].tolist()
    role = data['Role'].tolist()
    role_level = data['Role Level'].tolist()
    cnt=0
    for i in resources:
        vendor1 = None
        if Vendor.objects.filter(name=vendor[cnt]).exists():
            vendor1 = Vendor.objects.get(name=vendor[cnt])

        resource = Resource.objects.create(name=i,start_date=date_converter(start_date[cnt]),gender=gender[cnt],location=location[cnt],role=role[cnt],role_level=role_level[cnt],is_color=True if color[cnt]=='Y' else False,vendor=vendor1)
        mylist = [skill1,skill2,skill3,skill4]
        for j in mylist:
            sk = None
            if j is not None and Skill.objects.filter(title=j[cnt]).exists():
                sk = Skill.objects.get(title=j[cnt])
                print(sk)
                resource.skills.add(sk)
        resource.save()
        cnt = cnt + 1
    return HttpResponse("Good")

def ProductFilling(request):
    base_dir = settings.BASE_DIR
    data = pd.read_csv(os.path.join(base_dir,'mydata.csv'),error_bad_lines=False)
    data = data.where(pd.notnull(data),None)
    location = data['Prod Build Location'].tolist() 
    resources = data['Name'].tolist() 
    start_date = data['Prod Start Date'].tolist()
    end_date = data['Prod End Date'].tolist()
    p_start_date = data['resource product start date']
    p_end_date = data['resource product end date']
    title = data['Product'].tolist()
    cnt = 0
    for i in resources:
        if title[cnt] is not None:
            product,created = Product.objects.get_or_create(product_title=title[cnt],location=location[cnt],start_date=date_converter(start_date[cnt]),end_date = None if end_date[cnt] is None else date_converter(end_date[cnt]))
            resource = Resource.objects.get(name=resources[cnt])
            product.resources.add(resource)
            product.save()
            print(product)
            obj = ProductResourceInfo.objects.get(product=product,resource=resource)
            obj.start_date = date_converter(p_start_date[cnt])
            obj.end_date = None if p_end_date[cnt] is None else date_converter(p_end_date[cnt])
            obj.positions =  {
                "devsecops":1 if data['DevSecOps'].tolist()[cnt]=='Y' else 0,
                "security_maven":1 if data['Security Maven'].tolist()[cnt]=='Y' else 0,
                "interviewer":1 if data['Interviewer'].tolist()[cnt]=='Y' else 0,
                "work_intake_scoping":1 if data['Work Intake Scoping'].tolist()[cnt]=='Y' else 0,
                "anchor":1 if data['Anchor'].tolist()[cnt]=='Y' else 0,
                "accesibility":1 if data['Accessibility'].tolist()[cnt]=='Y' else 0,
                "education_training":1 if data['Education Track'].tolist()[cnt]=='Y' else 0,
            }
            obj.is_employee = True if data['E/C'][cnt]=='E' else False
            obj.save()
        cnt = cnt +1



    return HttpResponse("Good again")