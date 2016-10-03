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

let findTodoByTitle = (title) => {
    return todos.filter((todo) => todo.title === title)[0];
};

router.post("/todos/complete", (req, res) => {
    let todo = findTodoByTitle(req.body.title);
    todo.completed = true;
    res.send(todo);
});

module.exports = router;