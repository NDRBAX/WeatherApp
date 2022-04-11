var express = require('express');
var router = express.Router();
var request = require("sync-request");

//  Importez ce fichier connection.js au tout début du fichier /routes/index.js
var cityModel = require('../models/cities');

// API 
const url = 'http://api.openweathermap.org/data/2.5/';
const apiKey = 'f6b31be78ccd0fc118dcb9f391b8ead8';

/* HOME/LOGIN PAGE */
router.get('/', function(req, res, next) {
    res.render('login', );
});
router.get('/login', function(req, res, next) {
    res.render('login', );
});

/* WEATHER PAGE. */
router.get('/weather', async function(req, res, next) {
    /*
? La déclaration async function définit une fonction asynchrone qui renvoie un objet AsyncFunction. Une fonction asynchrone est une fonction qui s'exécute de façon asynchrone grâce à la boucle d'évènement en utilisant une promesse (Promise) comme valeur de retour. */
    // Pour éviter de pouvoir accéder à cette page en tapant le lien dans la barre de navigation, on permet l'accès que si l'utilisateur n'est pas null : s'il y a rien dans la variable de session, c'est que l'utilisateur ne s'est jamais inscrit ou co => il n'aura pas accès à la page weather 
    if (req.session.user == null) {
        res.redirect('/login')
    } else { // sinon, tu es autorisé à accéder à la page
        var cityList = await cityModel.find();
        res.render('weather', { cityList });
    }

    /* 
       ? L'opérateur await permet d'attendre la résolution d'une promesse (Promise). Il ne peut être utilisé qu'au sein d'une fonction asynchrone (définie avec l'instruction async function). L'expression await interrompt l'exécution d'une fonction asynchrone et attend la résolution d'une promesse. Lorsque la promesse est résolue (tenue ou rompue), la valeur est renvoyée et l'exécution de la fonction asynchrone reprend. Si la valeur de l'expression n'est pas une promesse, elle est convertie en une promesse résolue ayant cette valeur. Si la promesse est rompue, l'expression await lève une exception avec la raison. */

});
/*
TODO [] AFFICHER LES VILLES PAR UTILISATEUR 
TODO [] MODIFIER DESIGN DU BOUTON UPDATE
TODO [] FIL URSS ACTUALITÉS MÉTÉO EN DESSOUS 

TODO [!] ENCRYPTER LE MOT DE PASSE
TODO [] VERIFICATION PAR MAIL POUR ACTIVER LE COMPTE 
TODO [] AFFICHER MESSAGE QUAND IL Y A MAUVAIS ID OU PASS
        * MOT DE PASSE OU IDENTIFIANT NE CORRESPONDNET PAS

TODO [] HEBERGER SUR VERCEL / HEROKU
TODO [] METTRE EN PUBLIC SUR GITHUB
*/

/* ADD CITY */
router.post('/add-city', async function(req, res, next) {
    var weatherReq = request("GET", `${url}weather?q=${req.body.newcity}&lang=fr&units=metric&appid=${apiKey}`); // Récuperer les données météos de l'API
    var weatherRes = JSON.parse(weatherReq.body); // La méthode JSON.parse() analyse une chaîne de caractères JSON et construit la valeur JavaScript ou l'objet décrit par cette chaîne. 

    var status = await cityModel.findOne({ name: req.body.newcity.slice(0, 1).toUpperCase() + req.body.newcity.slice(1).toLocaleLowerCase() }); // vérifier si le nom de ville saisie (peu importe l'orthographe) existe déjà dans la bse de données 
    console.log(`Nouvelle ville : ${req.body.newcity}`);

    if (status == null && weatherRes.name) { // s'il n'existe pas, alors ajouter les informations depuis l'API
        var newCity = new cityModel({
            name: req.body.newcity.slice(0, 1).toUpperCase() + req.body.newcity.slice(1).toLocaleLowerCase(),
            image: `http://openweathermap.org/img/wn/${weatherRes.weather[0].icon}.png`,
            desc: weatherRes.weather[0].description,
            temp_max: weatherRes.main.temp_max,
            temp_min: weatherRes.main.temp_min,
            lon: weatherRes.coord.lon,
            lat: weatherRes.coord.lat
        });
        await newCity.save();
    }
    console.log(`Les coordonées de la ville sont : ${weatherRes.coord.lon},  ${weatherRes.coord.lat}`);

    cityList = await cityModel.find();
    res.render('weather', { cityList });
});

/* DELETE City. */
router.get('/delete-city', async function(req, res, next) {
    await cityModel.deleteOne({
        _id: req.query.id
    })
    var cityList = await cityModel.find();
    res.render('weather', { cityList })
});

/* UPDATE CITIES */
router.get('/update-cities', async function(req, res, next) {
    var cityList = await cityModel.find();

    for (var i = 0; i < cityList.length; i++) {
        var weatherReq = request("GET", `${url}/weather?q=${cityList[i].name}&lang=fr&units=metric&appid=${apiKey}`);
        var weatherRes = JSON.parse(weatherReq.body);

        await cityModel.updateOne({
            _id: cityList[i].id
        }, {
            name: cityList[i].name,
            desc: weatherRes.weather[0].description,
            image: "http://openweathermap.org/img/wn/" + weatherRes.weather[0].icon + ".png",
            temp_min: weatherRes.main.temp_min,
            temp_max: weatherRes.main.temp_max,
            lon: weatherRes.coord.lon,
            lat: weatherRes.coord.lat
        })
    }
    var cityList = await cityModel.find();
    res.render('weather', { cityList })
});

module.exports = router;