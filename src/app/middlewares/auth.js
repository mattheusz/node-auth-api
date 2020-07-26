const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

// o next só vai ser chamado quando o usuário estiver pronto para ir para o próximo controller
module.exports = (req, res, next) => {
    // VALIDAÇÕES DO TOKEN, AS QUAIS NÃO EXIGEM MUITO PROCESSAMENTO
    const authHeader = req.headers.authorization;

    // verificar se o TOKEN foi informado
    if (!authHeader)
        return res.status(401).send({ error: "No token provided" });

    // Formato do TOKEN: Bearer xjai25k14akcjaicmpadca5658

    // verificando se o TOKEN tem as duas partes: BEARER | xjai25k14akcjaicmpadca5658

    const parts = authHeader.split(" "); // rever split

    if (!parts.lenght === 2)
        return res.status(401).send({ error: "Token Error" });

    // desestruturar, pegando o BEARER (Scheme) e o Token (xjai25k14akcjaicmpadca5658)
    const [scheme, token] = parts;

    // verifica se no Scheme tá escrito Bearer
    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: "Token malformated" });

    // decodifica o token, sem verificar se sua assinatura é válida
    payload = jwt.decode(token, authConfig.secret);
    console.log("token: ", token);

    console.log("payload: ", payload);

    // verifica se o token que chegou foi realmente criado com base no segredo (se sua assinatura é válida)
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err)
            return res.status(401).send({
                error: "Token invalid",
                description: err,
                scheme: scheme,
                token: token,
            });

        // decoded = payload decodado
        req.userId = decoded.params.id;
        console.log("token decoded: ", decoded);

        return next();
    });
};
