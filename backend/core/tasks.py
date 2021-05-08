import pprint
from datetime import datetime, timedelta
from django.utils.module_loading import import_string
from Interapt.celery import app
from .utils import send_mail



@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    # Calls test('world') every 30 seconds
    # sender.add_periodic_task(1800,class_start,name='class_start')
    sender.add_periodic_task(10, end_date_recaller, name='end_date_recaller')
    # for testing only
    # sender.add_periodic_task(10,focus_session_request.s(4,1),name='focus_session_request')
    # Executes every Monday morning at 7:30 a.m.


@app.task
def end_date_recaller():
    Product = import_string("core.models.Product")
    products = Product.objects.filter(end_date=None,start_date=datetime.now().date()-timedelta(days=30))
    # send alert notification somehow to these products
    print("comming here")



    


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')