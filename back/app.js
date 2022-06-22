require('dotenv').config();
//console.log(process.env);

//Importation de l'application Express
const express = require('express');
const path = require('path');//donne accès au chemin de notre systeme de fichier

//REGARDER LE MAIL AVEC LES LIENS POUR LA SECURITE
/*
Helmet pour la sécurité : https://www.npmjs.com/package/helmet
N'oublie pas de rajouter le multer, le middleware authentification dans les requêtes au niveau de la route (précisé également dans le document technique)
Ensuite tu fais les tests (précisé dans le document sur les étapes du projet) */

//importation de l'application mongoose
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o6rlm.mongodb.net/${process.env.DB_NAME}retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//Constante contenant l'application Express
const app = express();

//importe le middleware cors. Il va agir sur la réponse en y ajoutant des headers sur la réponse.
const cors = require('cors');
//appel le middleware
app.use(cors());
app.use(express.json());

//Importation du fichier contenant les routes users
const userRoutes = require('./routes/user');

//l'app express va servir le dossier image   //directory name = images
app.use('/images', express.static(path.join(__dirname, 'images')));
//Utilisation des routers 
app.use('/api/auth', userRoutes);

const sauceRoutes = require('./routes/sauce');

app.use('/api/sauces', sauceRoutes);

module.exports = app;