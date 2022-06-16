//importation du package de cryptage des mots de passe
const bcrypt = require('bcrypt');

//importation du package jsonwebtoken
const jsonWebToken = require('jsonwebtoken');

//importation du model user pour enregistrer et lire ses données
const User = require('../models/User');

//Middlewares d'authentification : signup(nouvel utilisateur) et login(utilisateur existant)

exports.signup = (req, res, next) => {
    //console.log("test data" + req.body.email + req.body.password);
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //console.log('user', user);
            user.save()//on enregistre le nouvel user crée, dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))//201 = creation de ressources
                .catch(res.status(400));//erreur 400 = demande éronnée, "bad request"
        })
        .catch(res.status(500));//error 500 = erreur serveur
};

//Vérification de l'identité d'un utilisateur existant
exports.login = (req, res, next) => {

    User.findOne({ email: req.body.email })//on filtre l'utilisateur pour qui l'adresse mail correspond à celle envoyée dans la requête
        .then(user => {
            if (!user) {//si l'utilisateur n'est pas trouvé
                return res.status(401)//.json({ error: 'Utilisateur non trouvé !' })//401 = "non autorisé"
            };
            //si utilisateur trouvé, on va utiliser bcrypt pour comparer le mot de passe envoyé par l'utilisateur et le hash
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401)//.json({ error: 'Mot de passe incorrect !' })//401 = "non autorisé"
                    }
                    //si tout est bon, c'est true et donc
                    res.status(200).json({//la requête est OK et on envoi un objet json
                        userId: user._id,
                        token: jsonWebToken.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )

                    });
                })
                .catch(res.status(500));

        })
        .catch(res.status(500));
};





