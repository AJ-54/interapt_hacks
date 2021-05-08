from django.urls import path
from .views import *
app_name='core'

urlpatterns = [
    path('diversity/',DiversityView.as_view(),name='diversity'),
    path('product_resources/',ProductResourcesView.as_view(),name='product_resources'),
    path('location_resources',LocationResourcesView.as_view(),name='location_resources'),
    path('product_resource_position/',GetProductResourcePositionsView.as_view(),name='product_resource_position'),
    path('resource_ratio/',ResourceRatio.as_view(),name='resource_ratio'),
    path('active_products/',ActiveProducts.as_view(),name='active_products'),
    path('contractor_resources/',ContractorResources.as_view(),name='contractor_resources'),
    # path('dashboard_data/',DashboardData.as_view(),name='dashboard_data'),
    # path('next_rotation_resources/',NextRotationResources.as_view(),name='next_rotation_resources'),
    # path('allocate_resources/',AllocateResources.as_view(),name='allocate_resources'),
    path('test/',ResourceFilling,name='rf')
]
