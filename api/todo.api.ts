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