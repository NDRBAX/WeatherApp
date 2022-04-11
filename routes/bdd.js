var mongoose = require('mongoose');
/*
! On initialise le module dans le projet. */

const uri = 'mongodb+srv://admin:toor@weatherapp.wty4r.mongodb.net/weatherapp?retryWrites=true&w=majority';

var options = {
    connectTimeoutMS: 5000,
    /* 
       ? connectTimeoutMS : permet de définir la durée de la tentative de connexion à la base de données. Au bout de 5000ms, si la connexion n’est pas effective, la tentative de connexion s’arrêtera */
    useNewUrlParser: true,
    useUnifiedTopology: true
        /*
           ? useNewUrlParser & useUnifiedTopology : Ces paramètres sont recommandés par mongoose pour utiliser des fonctionnalités non dépréciées de mongoose */
}

/* 
? La méthode mongoose.connect() va recevoir plusieurs arguments :

* En premier, l’uri de connexion à notre base de données
* En second, les options définies précédemment sous forme d’objet
* En troisième, une fonction de callback qui sera appelée à la fin de la tentative de connexion. 

! La paramètre “err” contient les erreurs éventuelles remontées lors de la tentative de connexion. Si “err” est null, il n’y a alors pas d’erreur, la connexion s’est bien déroulée. */

mongoose.connect(uri, options, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database !");
    }
});

/* 
? ATTENTION : le modèle a besoin du schéma pour fonctionner :
* Le Schéma est une description des différentes informations (et de leur type) permettant de décrire un enregistrement en base de données (appelé aussi document).
* Un Modèle est une mécanique associée à un groupe d’enregistrement (appelé aussi collection) permettant de réaliser les opérations CRUD (écrire, lire, mettre à jour et supprimer). */

const citySchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    temp_max: Number,
    temp_min: Number
});
/*
? l’objectif du schéma -> définir les règles à respecter pour insérer des documents dans notre collection */

var cityModel = mongoose.model('cities', citySchema);
/*
? le modèle -> c'est une entité permettant de consulter et manipuler une unique collection
! Pour définir le modèle, nous utilisons la méthode mongoose.model() avec comme premier argument le nom de la collection à manipuler et en deuxième argument le schéma définie précédemment. La variable cityModel est donc désormais créée.  Cette personne, cette entité devra être consultée pour manipuler les données d’une collection. */


module.exports = cityModel;