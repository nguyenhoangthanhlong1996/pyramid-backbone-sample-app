from sample_app import RestException


class Util:
    current_id = 0

    @staticmethod
    def gen_id():
        Util.current_id += 1
        return Util.current_id


class TodoService:
    task1_id = Util.gen_id()
    task2_id = Util.gen_id()
    task3_id = Util.gen_id()

    data = {
        task1_id: {'id': task1_id, 'title': 'Task 1', 'completed': True},
        task2_id: {'id': task2_id, 'title': 'Task 2', 'completed': False},
        task3_id: {'id': task3_id, 'title': 'Task 3', 'completed': False},
    }

    @staticmethod
    def list():
        return TodoService.data.values()

    @staticmethod
    def create(title='Unknown', completed=False):
        id_todo = Util.gen_id()
        todo = {'id': id_todo, 'title': title, 'completed': completed}
        TodoService.data.update({id_todo: todo})
        return todo

    @staticmethod
    def update(id=None, title='Unknown', completed=False):
        if TodoService.data.has_key(id):
            todo = {'id': id, 'title': title, 'completed': completed}
            TodoService.data.update({id: todo})
            return todo
        raise RestException(msg='Todo\'s ID not found')

    @staticmethod
    def delete(id=None):
        if TodoService.data.has_key(id):
            return TodoService.data.pop(id)
        raise RestException(msg='Todo\'s ID not found')
