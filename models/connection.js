var mongoose = require('mongoose');
/*
! permet d'initialiser le module mongoose dans le projet */

const admin = 'admin';
const pass = 'TOOR';
const projectName = 'weatherapp';
const uri = `mongodb+srv://${admin}:${pass}@weatherapp.wty4r.mongodb.net/${projectName}?retryWrites=true&w=majority`;


var options = {
    connectTimeoutMS: 50000,
    /* 
       ? connectTimeoutMS : permet de définir la durée de la tentative de connexion à la base de données. Au bout de 5000ms, si la connexion n’est pas effective, la tentative de connexion s’arrêtera */
    useNewUrlParser: true,
    useUnifiedTopology: true
        /*
           ? useNewUrlParser & useUnifiedTopology : Ces paramètres sont recommandés par mongoose pour utiliser des fonctionnalités non dépréciées de mongoose */
};
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

module.exports = mongoose;