import os

from celery import Celery, shared_task
from celery.utils.log import get_task_logger
from django.apps import apps

logger = get_task_logger(__name__)
# set the default Django settings module for the 'celery' program.
settings_module = os.environ.get("DJANGO_SETTINGS_MODULE","Interapt.settings")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

app = Celery('Interapt')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
