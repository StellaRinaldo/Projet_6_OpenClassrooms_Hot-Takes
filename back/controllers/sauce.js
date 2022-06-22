const Sauce = require('../models/Sauce');

const fs = require('fs');//fs = 'file system'
const { default: mongoose } = require('mongoose');

//Création de sauce
exports.createSauce = (req, res, next) => {
    //console.log("reqbody", req.body.sauce);
    const reqBody = JSON.parse(req.body.sauce);//extrait l'objet JSON de la sauce créée.
    delete reqBody._id;

    const sauce = new Sauce({
        //...reqBody,   //protocol=http         //host = localhost:3000   //nom du fichier
        //imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//finalement ces deux lignes suffisent pour créer un nouveau produit !
        userId: reqBody.userId,
        name: reqBody.name,
        manufacturer: reqBody.manufacturer,
        description: reqBody.description,
        mainPepper: reqBody.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat: reqBody.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    console.log("form sauce", sauce);
    //delete sauce._id;
    //console.log("name", reqBody.name);
    sauce.save()
        .then(() => res.status(201).json({ message: 'Produit enregistré !' }))
        .catch(res.status(400));
};


//Modification d'une sauce
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? //? signifie "si req.file existe"
        {
            ...JSON.parse(req.body.sauce),//récupère l'objet au format JSON
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,//génère la nouvelle imageUrl

        } : { ...req.body };// si req.file n'existe pas, faire une copie du body
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Produit mis à jour !' }))
        .catch(res.status(400));
};
//Trouver solution pour le problème avec userId
//penser à rajouter un code pour la modification de l'image(FAIT!). Et regarder les spécifications dans le pdf. 
//Faire pareil pour la fonction delete(penser a l'image) - FAIT !
//Penser à la fonctionnalité des likes
//en cas de problèmes, redemarrer le serveur, vider la base de données des sauces et reactualiser la page
//pour la modification de l'image, il faut que l'ancienne disparaisse aussi du dossier images(FAIT !)


//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Produit supprimé !' }))
                    .catch(res.status(400));
            });
        })
        .catch(error => res.status(500))
};

//Affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(res.status(404));
};

//Affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(res.status(400));
};

//REPRENDRE AVEC LE TUTO DU GARS

//Fonction like/dislike
exports.likeSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log("contenu resultat promesse", sauce);

            //si le tableau userLiked ne contient pas le userId du votant ET si le like n'est pas égal à 1
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                console.log("like", req.body.like);//Attention, il faut mettre "like" et non "likes" !

                //mise à jour de l'objet de la base de données
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Like + 1 !" }))
                    .catch((error) => res.status(400).json({ error }));
            };

            //si like === 0, donc pas de vote ou vote annulé
            //si le tableau userLiked contient l'userId du votant ET si like est égal à 0
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                console.log("like", req.body.like);//Attention, il faut mettre "like" et non "likes" !

                //Annulation du like et suppression de l'userId dans le tableau (base de données)
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Like = 0 !" }))
                    .catch((error) => res.status(400).json({ error }));
            };

            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                console.log("like", req.body.like);//Attention, il faut mettre "like" et non "likes" !

                //mise à jour de l'objet de la base de données
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: 1 },
                        $push: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Dislike + 1 !" }))
                    .catch((error) => res.status(400).json({ error }));
            };

            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                console.log("dislike", req.body.like);//Attention, il faut mettre "like" et non "likes" !

                //Annulation du like et suppression de l'userId dans le tableau (base de données)
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Like = 0 !" }))
                    .catch((error) => res.status(400).json({ error }));
            };


        })
        .catch(res.status(404))

    //if (updateLike === 1) {




    /* Sauce.likes = like,
    Sauce.usersLiked = userId */
    /*console.log("testReqParams", req.params.id);
    let oneSauce = Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(res.status(404));

    console.log('oneSauce', oneSauce);*/
    /* Sauce.getOne(
         { _id: req.params.id }, //récupère l'Id du produit
         {name: "nouevelle sauce"}
         //{ $push: { usersLiked: userId } },//rajoute un élément dans le tableau "usersLiked"
         //{ $inc: { likes: +1 } },//incrémente la valeur de like
 
 
     )
         .then(() => res.status(200).json({ message: 'Vote enregistré !' }))
         .catch(res.status(400));*/
    // }

    //console.log("likeAttrappé", this.createSauce.likes);

    /*if(like === -1){
         Sauce.updateOne({ _id: req.params.id }, {$push: {usersDisliked: userId}}, {$inc: {disLikes : like +1}}) 
         .then(() => res.status(200).json({ message: 'Vote enregistré !' }))
         .catch(res.status(400));
     }*/

    /* if(like === 0){
          Sauce.updateOne({ _id: req.params.id }, {$pull: {usersDisliked: userId}}, {$pull : {usersLiked : userId}}, {$inc: {likes : like -1}}, {$inc: {dislikes : like -1}}) 
          .then(() => res.status(200).json({ message: 'Vote enregistré !' }))
          .catch(res.status(400));
      }*/



    //console.log("like", req.body.like);
    //console.log("fonction like invoquée", sauce);
    //Pour l'instant les likes ou dislikes ne sont pas enregistrés 

    /*like.save()
        .then(() => res.status(201).json({ message: 'Vote enregistré !' }))
        .catch(res.status(400));*/
};



    //Penser à ajouter ou retirer l'id de l'utilisateur du tableau du schema de sauce si l'utilisateur aime ou n'aime pas la sauce
/*Faire un truc du genre : si like/dislike = tant alors on ajoute/retire l'userId du tableau du model Sauce. */








