from pyramid.view import view_config, view_defaults

from sample_app.services.todo import TodoService


@view_defaults(renderer='json')
class TodoRestView(object):
    def __init__(self, request):
        self.request = request

    def list(self):
        return TodoService.list()

    def create(self):
        body = self.request.json_body
        return TodoService.create(title=body.get('title'), completed=body.get('completed'))

    def update(self):
        id = int(self.request.matchdict['id'])
        body = self.request.json_body
        return TodoService.update(id=id, title=body.get('title'), completed=body.get('completed'))

    def delete(self):
        id = int(self.request.matchdict['id'])
        return TodoService.delete(id=id)

class TodoPageView(object):
    def __init__(self, request):
        self.request = request

    @view_config(renderer="templates/index.jinja2")
    def page(self):
        return {'title': 'Todo App'}