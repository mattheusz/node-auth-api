const mongoose = require("../../database/index");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // campo não é retornado quando buscado
    },
    passwordResetToken: {
        type: "String",
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware PRE: acionado antes haja, de fato, alguma interação com o banco
// Neste caso, antes de salvar, a senha será criptografada
UserSchema.pre("save", async function (next) {
    //hash: gera um hash para uma dada string
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    // next dá continuidade ao ciclo do mongoose
    // vale ressaltar que ele não encerra a função. Então o ideal é dar um return
    // https://mongoosejs.com/docs/middleware.html#pre
    next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
