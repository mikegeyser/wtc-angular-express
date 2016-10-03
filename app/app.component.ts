import { Component } from '@angular/core';
import { TodoStore } from './todo.store';

@Component({
    selector: 'todo-app',
    templateUrl: 'app/app.template.html'
})
export class AppComponent {
    title: string;

    constructor(private todoStore: TodoStore) {
        this.todos = todoStore.todos;
    }

    toggleCompletion(todo: Todo) {
        this.todoStore.toggleCompletion(todo);
    }

    create() {
        this.todoStore.create(this.title);
        this.title = '';
    }

    remove(todo) {
        this.todoStore.remove(todo);
    }
}