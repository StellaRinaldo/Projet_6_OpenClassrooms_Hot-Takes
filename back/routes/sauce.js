const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const multerConfig = require('../middleware/multer-config');
const auth = require('../middleware/auth');
//Création d'un nouveau produit
//router.post('/', multerConfig, sauceCtrl.createSauce);

router.post('/', auth, multerConfig, (req, res) => {
    //console.log("name", req.body.name);
    sauceCtrl.createSauce(req, res);
});

//Mise à jour d'un produit
router.put('/:id', multerConfig, sauceCtrl.updateSauce);//le middleware auth continue de tout bloquer lors de l'update...

//Supprimer un produit
router.delete('/:id', auth, sauceCtrl.deleteSauce);

//Affichage d'une seule sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);

//Affichage de l'ensemble des sauces
router.get('/', auth, sauceCtrl.getAllSauces);

//fonction like/dislike
router.post('/:id/like', multerConfig, sauceCtrl.likeSauce);

module.exports = router;
