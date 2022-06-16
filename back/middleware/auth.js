//importation du package pour vérifier les tokens
const jsonWebToken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //récupérer le token dans le header
        const token = req.headers.authorization.split(' ')[1];
        //decoder le token
        const decodedToken = jsonWebToken.verify(token, 'RANDOM_TOKEN_SECRET');
        //extraire la vérification du token
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.iserId !== userId){
            throw 'User ID non valable !';
        }else {
            next();
        }
        //si userId avec requête, vérifier qu'elle correspond bien à celle du token
    } catch (error) {
        res.status(401).json({error: error | 'Requête non authentifiée !'});
    }
};
