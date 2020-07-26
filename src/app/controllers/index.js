const fs = require("fs");
const path = require("path");

module.exports = (app) => {
    // readdirSync(dir): lê um diretório e retorna uma array de string com os nomes

    console.log(fs.readdirSync(__dirname));

    // vai na pasta de controllers e pega os arquivos existens que não são nomeados como index.js
    // depois disso, importa cada um dos arquivos e passa o app
    // prettier-ignore
    fs
      .readdirSync(__dirname)
      .filter((file) => (file.indexOf(".") !== 0 && (file !== "index.js")))
      .forEach(file => require(path.resolve(__dirname, file))(app))
};
