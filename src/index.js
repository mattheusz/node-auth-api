const express = require("express");
const app = express();

// json: analisa json | urlencoded: reconhece query strings
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Ok!");
});
/*
app.use("/auth", require("./config/app/controllers/authController"));
app.use("/projects", require("./config/app/controllers/projectController"));
*/

require("./app/controllers/index")(app);

app.listen(3000);
