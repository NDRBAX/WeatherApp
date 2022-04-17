var mongoose = require('mongoose');

/* 
? ATTENTION : le modèle a besoin du schéma pour fonctionner :
* Le Schéma est une description des différentes informations (et de leur type) permettant de décrire un enregistrement en base de données (appelé aussi document).
* Un Modèle est une mécanique associée à un groupe d’enregistrement (appelé aussi collection) permettant de réaliser les opérations CRUD (écrire, lire, mettre à jour et supprimer). */

const citySchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    temp_max: Number,
    temp_min: Number,
    lon: Number,
    lat: Number,
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
    }
});
/*
? l’objectif du schéma -> définir les règles à respecter pour insérer des documents dans notre collection */

var cityModel = mongoose.model('cities', citySchema);

/*
? le modèle -> c'est une entité permettant de consulter et manipuler une unique collection
! Pour définir le modèle, nous utilisons la méthode mongoose.model() avec comme premier argument le nom de la collection à manipuler et en deuxième argument le schéma définie précédemment. La variable cityModel est donc désormais créée.  Cette personne, cette entité devra être consultée pour manipuler les données d’une collection. */


module.exports = cityModel;