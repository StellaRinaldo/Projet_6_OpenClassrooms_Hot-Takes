//Importation de l'application Express
const express = require('express');
const path = require('path');//donne accès au chemin de notre systeme de fichier

//importation de l'application mongoose
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://StellaR:NodokaDB@cluster0.o6rlm.mongodb.net/?retryWrites=true&w=majority',
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