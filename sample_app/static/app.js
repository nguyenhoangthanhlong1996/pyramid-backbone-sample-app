function handleSync(method, model, options) {
    switch (method) {
        case 'read':
            console.log(model)
            options.url = '/api/todos';
            options.method = 'GET';
            break;
        case 'create':
            options.url = '/api/todos';
            options.method = 'POST';
            options.data = JSON.stringify(model.toJSON())
            break;
        case 'update':
            options.url = `/api/todos/${model.id}`;
            options.method = 'PUT';
            options.data = JSON.stringify(model.toJSON())
            break;
        case 'delete':
            console.log(model)
            options.url = `/api/todos/${model.id}`;
            options.method = 'DELETE';
            break;

    }
    return Backbone.sync(method, model, options);
}

var TodoModel = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false
    },
    idAttribute: 'id',
    sync: handleSync,

    toggle: function () {
        this.save({
            completed: !this.get('completed')
        }, {wait: true});
    }
});

var TodoCollection = Backbone.Collection.extend({
    model: TodoModel,
    sync: handleSync,
    modelId: function (attrs) {
        return attrs.id
    },

    filterList: function (status) {
        return this.filter(function (todo) {
            return todo.get('completed') ===
                (status === 'pending'
                    ? false
                    : status === 'completed'
                        ? true
                        : todo.get('completed'))
        });
    }
});

var todoCollection = new TodoCollection();

var TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#item-template').html()),
    initialize: function () {
        this.model.on('change', this.render, this);
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.edit');
        return this;
    },
    events: {
        'dblclick label': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close',
        'click .toggle': 'toggleCompleted',
        'click .remove': 'delete'
    },

    edit: function () {
        this.$el.addClass('editing');
        this.input.focus();
    },

    updateOnEnter: function (e) {
        if (e.which === 13) this.close();
    },

    close: function () {
        var value = this.input.val().trim();

        if (value) {
            this.model.save({title: value}, {wait: true});
        }

        this.$el.removeClass('editing');
    },

    toggleCompleted: function () {
        this.model.toggle();
    },

    delete: function () {
        let self = this
        this.model.destroy({
            success: function () {
                self.remove()
            }
        }, {wait: true});
    }
});

var AppView = Backbone.View.extend({
    el: '#todoapp',
    initialize: function () {
        this.input = this.$('#new-todo');
        console.log(this.input);
        todoCollection.on('add', this.render, this);
        todoCollection.on('reset', this.render, this);
        todoCollection.fetch();
    },
    events: {
        'keypress #new-todo': 'createTodoOnEnter'
    },

    createTodoOnEnter: function (e) {
        if (e.which !== 13 || !this.input.val().trim()) return;

        todoCollection.create({
            title: this.input.val().trim(),
            completed: false
        }, {wait: true});
        this.input.val('');
    },

    addOne: function (todoModel) {
        var view = new TodoView({
            model: todoModel
        });
        $('#todo-list').append(view.render().$el);
    },

    render: function () {
        $('#todo-list').empty();
        _.each(todoCollection.filterList(window.filter), this.addOne);
    }
});


var Router = Backbone.Router.extend({
    routes: {
        ':filter': 'setFilter'
    },
    setFilter: function (params) {
        window.filter = params.trim() || '';
        todoCollection.trigger('reset');
    }
});

var router = new Router();
Backbone.history.start();

appView = new AppView();