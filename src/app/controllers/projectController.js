const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Project = require("../models/project");
const Task = require("../models/task");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().populate(["user", "tasks"]);

        return res.json({ projects });
    } catch (err) {
        return res.status(400).send({ error: "Error loading projects" });
    }
});

router.get("/:projectId", async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate([
            "user",
            "tasks",
        ]);

        return res.json({ project });
    } catch (err) {
        return res.status(400).send({ error: "Error loading project" });
    }
});

router.post("/", async (req, res) => {
    try {
        // desestruturand req.body, pois a princípio será utilizado apenas title e description
        const { title, description, tasks } = req.body;

        // criando projeto com title, description e id do usuário, sem passar as taks
        const project = await Project.create({
            title,
            description,
            user: req.userId,
        });

        await Promise.all(
            // percorre por todas as tasks que foram passadas, para de fato criá-la e salvar no banco
            tasks.map(async (task) => {
                const projectTask = new Task({ ...task, project: project._id });

                // salva task no banco
                await projectTask.save();

                // adiciona as taks ao projeto
                project.tasks.push(projectTask);
            })
        );

        // salva o projeto com as tarefas
        await project.save();

        return res.send({ project });
    } catch (err) {
        return res.status(400).send({ error: "Error creating new project" });
    }
});

router.put("/:projectId", async (req, res) => {
    try {
        // desestruturando req.body, pois a princípio será utilizado apenas title e description
        const { title, description, tasks } = req.body;

        // criando projeto com title, description e id do usuário, sem passar as taks
        const project = await Project.findByIdAndUpdate(
            req.params.projectId,
            {
                title,
                description,
            },
            { new: true }
        );

        console.log(project);

        project.tasks = [];
        console.log("LOG:", "CHEGUEI AQUI");
        await Task.remove({ project: project._id });

        await Promise.all(
            tasks.map(async (task) => {
                const projectTask = new Task({ ...task, project: project._id });

                await projectTask.save();

                project.tasks.push(projectTask);
            })
        );

        await project.save();

        return res.send({ project });
    } catch (err) {
        console.log(err);

        return res.status(400).send({ error: "Error update new project" });
    }
});

router.delete("/:projetId", async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId);

        return res.json({ message: "Removed with sucess" });
    } catch (err) {
        return res.status(400).send({ error: "Error deleting project" });
    }
});

module.exports = (app) => app.use("/projects", router);
