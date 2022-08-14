from pyramid.config import Configurator
from sample_app.exceptions.exception import RestException
from sample_app.views import TodoRestView, TodoPageView


def rest_exception_handler(exc, request):
    request.response.status = 400
    return dict(error=exc.msg)


def main(global_config, **settings):
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_static_view(name='static', path='static')

    # Page
    config.add_route('home', '/')
    config.add_view(view=TodoPageView, route_name='home', attr='page', request_method='GET', renderer='templates/index.jinja2')
    # REST
    config.add_route('todo-rest', '/api/todos')
    config.add_view(view=TodoRestView, route_name='todo-rest', attr='list', request_method='GET')
    config.add_view(view=TodoRestView, route_name='todo-rest', attr='create', request_method='POST')
    config.add_route('todo-rest-with-id', '/api/todos/{id}')
    config.add_view(view=TodoRestView, route_name='todo-rest-with-id', attr='update', request_method='PUT')
    config.add_view(view=TodoRestView, route_name='todo-rest-with-id', attr='delete', request_method='DELETE')
    config.add_exception_view(view=rest_exception_handler, context=RestException, renderer='json')

    return config.make_wsgi_app()
