import {Injectable, Inject} from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

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

    constructor(private http: Http) {
        this.todos = [];

        this.http.get("/api/todos").subscribe((res) => {
            this.todos.push(...res.json());
        });
    }

    toggleCompletion(todo: Todo) {
        this.http.post("/api/todos/complete", todo)
            .subscribe((res) => {
                todo.completed = !todo.completed;
            });
    }
}
