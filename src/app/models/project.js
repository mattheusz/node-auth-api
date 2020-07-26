const mongoose = require("../../database/index");
const bcrypt = require("bcryptjs");

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, //forma como o mongo grava o id no banco de dados
        ref: "User", //qual model se quer criar a relação
        //required: true,
    },
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
