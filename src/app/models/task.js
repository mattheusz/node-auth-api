const mongoose = require("../../database/index");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId, //forma como o mongo grava o id no banco de dados
        ref: "Project",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, //forma como o mongo grava o id no banco de dados
        ref: "User", //qual model se quer criar a relação
        required: true,
    },
    completed: {
        type: Boolean,
        require: true,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
