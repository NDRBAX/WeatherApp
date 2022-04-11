var express = require('express');
const bcrypt = require('bcryptjs');
var router = express.Router();

var userModel = require('../models/users');


var hashedPassword;

/* SIGNUP */
router.post('/sign-up', async function(req, res, next) { // Pour éviter les doublons lors de l'inscription, on autorise une inscription par mail seulement
    let userRule = req.body.usernameFromFront;
    console.log(userRule + '***' + typeof userRule);
    let passwordRule = req.body.passwordFromFront;
    console.log(passwordRule + '***' + typeof passwordRule);

    // Encryption of the string password
    bcrypt.genSalt(10, function(err, Salt) {

        // The bcrypt is used for encrypting password.
        bcrypt.hash(passwordRule, Salt, function(err, hash) {
            if (err) {
                return console.log('Cannot encrypt');
            }
            hashedPassword = hash;
            console.log(hash);
            bcrypt.compare(passwordRule, hashedPassword,
                async function(err, isMatch) {
                    // Comparing the original password to
                    // encrypted password   
                    if (isMatch) {
                        console.log('Encrypted password is: ', passwordRule);
                        console.log('Decrypted password is: ', hashedPassword);
                    }
                    if (!isMatch) {
                        // If password doesn't match the following
                        // message will be sent
                        console.log(hashedPassword + ' is not encryption of ' +
                            passwordRule);
                    }
                })
        })
    })

    var searchUser = await userModel.findOne({
            email: req.body.emailFromFront
        })
        // On permet l'inscription que si searchUser n'existe pas déjà dans la BDD
    if (userRule.length == 0 || passwordRule.length == 0) {
        res.redirect('/');
    } else if (!searchUser) {
        // On crée la variable newUser qui va capter les données 
        var newUser = new userModel({
                username: req.body.usernameFromFront,
                email: req.body.emailFromFront,
                password: hashedPassword
            })
            // On vérifie que les données sont bien captées 
        console.log(req.body.usernameFromFront);
        console.log(req.body.emailFromFront);
        console.log(hashedPassword);
        // On sauvegarde les données de la variable newUser
        var newUserSave = await newUser.save();
        // On crée la variable de session pour stocker les données du nouvel utilisateur 
        req.session.user = {
            name: newUserSave.username,
            id: newUserSave._id,
        }
        console.log(req.session.user);
        res.redirect('/weather');
    } else {
        res.redirect('/');
    }
})

/* SIGNIN */
router.post('/sign-in', async function(req, res, next) {
    // Verifier s'il exite un utilisateur dans la BDD avec cet adresse mail fournie et ce mot de passe 
    var searchUser = await userModel.findOne({
        email: req.body.emailFromFront,
        password: hashedPassword
    });
    // Si ce console.log affiche null, c'est que l'utilisateur n'existe pas dans la BDD
    console.log(searchUser);
    // S'il trouve l'utilisateur 
    if (searchUser != null) {
        /*
        TODO Ne pas oublier de remplir la variable de session comme on l'a fait pour le signup; sinon on devrait crée toujours un nouveau compte
         */
        req.session.user = {
                name: searchUser.username,
                id: searchUser._id
            }
            // Il redirige l'utilisateur sur la page météo
        res.redirect('/weather')
            // Sinon il sera redirigé sur la page principale
    } else {
        res.render('login')
    }
});

/* LOGOUT */
router.get('/logout', function(req, res, next) {
    // On vide les variables session
    req.session.user = null;
    // Le logout nous ramène sur la page root 
    res.redirect('/')
});

module.exports = router;