const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../modules/mailer");

const authConfig = require("../../config/auth.json");

const User = require("../models/user");

const router = express.Router();

function generateToken(params = {}) {
    // cria um token baseado no payload e na chave secreta. Como opção, há o tempo em que vai expirard
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post("/register", async (req, res) => {
    const { email } = req.body;
    try {
        // verifica se usuário já existe
        if (await User.findOne({ email }))
            return res.status(400).send({ error: "User already exists" });
        const user = await User.create(req.body);

        user.password = undefined;

        return res.json({ user, token: generateToken({ id: user.id }) });
    } catch (err) {
        return res.status(400).json({ error: "Registration failed" });
    }
});

router.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    console.log("authenticat here");

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(400).send({ error: "User not found" });

    // bcrypt.compare(): compara se um dado combina com o hash
    if (!(await bcrypt.compare(password, user.password)))
        return res.status(400).json({ error: "Invalid Password" });

    user.password = undefined;

    res.json({ user, token: generateToken({ id: user.id }) });
});

router.post("/forgot_password", async (req, res) => {
    const { email } = req.body;
    console.log("forgot here");

    try {
        // verificando se e-mail está cadastrado na base de dados
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send({ error: "User not found" });

        // gerando um token aleatório de 20 bytes em hexadecimal
        const token = crypto.randomBytes(20).toString("hex");

        // tempo de expiração do token
        const now = new Date();
        now.setHours(now.getHours() + 1);

        // salvando o token no MODEL de USUÁRIO (USER)
        // prettier-ignore
        await User.findByIdAndUpdate(user.id, {
                '$set': {
                    passwordResetToken: token,
                    passwordResetExpires: now,
                },
            });

        mailer.sendMail(
            {
                to: email,
                from: "mathe_justino@hotmail.com",
                template: "auth/forgot_password",
                context: { token },
            },
            (err) => {
                if (err)
                    return res
                        .status(400)
                        .send({ error: "Cannot send forgot password email" });
            }
        );
        res.send();
        console.log(token, now);
    } catch (err) {
        console.log(err);

        res.status(400).send({
            error: "Erro on forgot password, try again",
        });
    }
});

router.post("/reset_password", async (req, res) => {
    const { email, token, password } = req.body;

    try {
        // verificando se e-mail está cadastrado na base de dados
        const user = await User.findOne({ email }).select(
            "+passwordResetToken passwordResetExpires"
        );

        // verificando se o usuário existe
        // prettier-ignore
        if (!user) 
            return res.status(400).send({ error: "User not found" });

        // verificando se o token passado corresponde ao gerado
        if (token !== user.passwordResetToken)
            return res.status(400).send({ error: "Token invalid" });

        const now = new Date();
        // verificando se a data de expiração do token não foi vencida
        if (now > user.passwordResetExpires)
            return res
                .status(400)
                .send({ error: "Token expired, generate a new token" });

        user.password = password;
        console.log("Entrei pra resetar o password", user);
        console.log(user);

        await user.save();
        res.send();
    } catch (err) {}
});
module.exports = (app) => app.use("/auth", router);
