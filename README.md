****
0
****

Starting point:


****
1 - Serve up html
****

index.ts
```
let path = require("path");

app.use(express.static(path.join(__dirname, "../")));

app.get("/", (req, res) => res.sendFile("index.html"));
```

index.html
```
<html>
  <head>
    <title>TodoMVC - Angular 2</title>
    <meta charset="UTF-8">    
    <link rel="stylesheet" href="node_modules/todomvc-common/base.css">
    <link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">

    <!-- 1. Load libraries -->
     <!-- Polyfill(s) for older browsers -->
    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>

    <!-- 2. Configure SystemJS -->
    <script src="systemjs.config.js"></script>
    <script>
            //System.import('app');
    </script>
  </head>
  <!-- 3. Display the application -->
  <body>
    <todo-app>Loading...</todo-app>
  </body>
</html>

```

****
2 - Bootstrap angular 2 app
****

app.module.ts
```
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

app.component.ts
```
import { Component } from '@angular/core';

@Component({
    selector: 'todo-app',
    templateUrl: 'app/app.template.html'
})
export class AppComponent {
}
```

app.template.html
```
<section class="todoapp">
	<header class="header">
		<h1>todos</h1>
		<input class="new-todo" placeholder="What needs to be done?" autofocus="">
	</header>
	<section class="main">
		<ul class="todo-list">
		</ul>
	</section>
</section>
```

main.ts
```
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
```

index.html
```
<script>
    System.import('app');
</script>

<todo-app>Loading...</todo-app>
```

****
3 - Create list todos api call
****

index.ts
```
app.use("/api", require("./api/todo.api"));
```

todo.api.ts
```
let router = require("express").Router();

class Todo {
    title: string;
    completed: boolean;
    editing: boolean;

    constructor(title: string, completed: boolean) {
        this.title = title;
        this.completed = completed;
        this.editing = false;
    }
}

let todos = [
    new Todo("List todos", true), // This is done!
    new Todo("Add conditional styling", false),
    new Todo("Mark a todo as completed", false),
    new Todo("Add a todo", false),
    new Todo("Delete a todo", false),
    new Todo("???", false), // Huh?
    new Todo("Profit", false)
];

router.get("/todos", (req, res) => {
    res.send(todos);
});

module.exports = router;
```

****
4 - Create a front end service
****

todo.store.ts
```
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
```

app.module.ts
```
import { HttpModule } from '@angular/http';
import { TodoStore } from './todo.store';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule
  ],
  declarations: [AppComponent],
  providers: [TodoStore],
  bootstrap: [AppComponent]
})
```

app.component.ts
```
import { TodoStore } from './todo.store';

constructor(private todoStore: TodoStore) {}
```

****
5 - Call the todo api and load up the data.
****

todo.store.ts
```
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';

constructor(private http: Http) {

this.http.get("/api/todos").subscribe((res) => {
        this.todos.push(...res.json());
    });
```

app.component.ts
```
constructor(private todoStore: TodoStore) {
    this.todos = todoStore.todos;
}
```

app.template.html
```
<li *ngFor="let todo of todos">
    <div class="view">
        <input class="toggle" type="checkbox">
        <label>{{todo.title}}</label>
    </div>
</li>
```

****
6 - Add conditional styling
****

app.template.html
```
[class.completed]="todo.completed"

[checked]="todo.completed"
```

****
7 - Mark a todo as completed
****

app.template.html
```
(click)="toggleCompletion(todo)"
```

app.component.ts
```
toggleCompletion(todo: Todo) {
    this.todoStore.toggleCompletion(todo);
}
```

todo.store.ts
```
toggleCompletion(todo: Todo) {
    this.http.post("/api/todos/complete", todo)
        .subscribe((res) => {
            todo.completed = !todo.completed;
        });
}
```

todo.api.ts
```
let findTodoByTitle = (title) => {
    return todos.filter((todo) => todo.title === title)[0];
};

router.post("/todos/complete", (req, res) => {
    let todo = findTodoByTitle(req.body.title);
    todo.completed = true;
    res.send(todo);
});
```

index.ts
```
let bodyParser = require('body-parser')

app.use(bodyParser.json());
```

****
8 - Add a todo
****

app.template.html
```
[(ngModel)]="title" (keyup.enter)="create()"
```

app.component.ts
```
    title: string;
    
    create() {
        this.todoStore.create(this.title);
        this.title = '';
    }
```

todo.store.ts
```
create(title: string) {
    let todo = new Todo(title, false);

    this.http.post("/api/todos/create", todo)
        .subscribe((res) => {
            this.todos.push(res.json());
        });
}
```

todo.api.ts
```
router.post("/todos/create", (req, res) => {
    let todo: Todo = req.body;
    todos.push(todo);
    res.send(todo);
});
```

****
9 - Remove a todo
****

app.template.html
```
<button class="destroy" (click)="remove(todo)"></button>
```

app.component.ts
```
remove(todo) {
    this.todoStore.remove(todo);
}
```

todo.store.ts
```
remove(todo: Todo) {
    this.http.post("/api/todos/delete", todo)
        .subscribe((res) => {
            this.todos.splice(this.todos.indexOf(todo), 1);
        });
}
```

todo.api.ts
```
router.post("/todos/delete", (req, res) => {
    let todo = findTodoByTitle(req.body.title);
    todos.splice(todos.indexOf(todo), 1);
    res.send(todos);
});
```