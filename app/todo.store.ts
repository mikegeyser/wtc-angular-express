import {Injectable, Inject} from '@angular/core';

export class Todo {
    title: string;
    completed: boolean;
    editing: boolean;

    constructor(title: string, completed: boolean) {
        this.title = title;
        this.completed = completed;
        this.editing = false;
    }
}

@Injectable()
export class TodoStore {
    todos: Todo[];

    constructor() {
        this.todos = [];
    }
}
