var mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    // Pour relier les documents de la collection user et cities, nous allons commencer par créer le schéma et le modèle de chaque collection
});



// DANS LE SCHÉMA DU USER, LA PROPRIÉTÉ CITIESUSER VA NOUS SERVIR À RELIER NOTRE USER À SON ADRESSE. LE TYPE DE DONNÉES EST DONC PARTICULIER. POUR FAIRE RÉFÉRENCE À LA COLLECTION ADDRESSES, NOUS DEVONS PRÉCISER SOUS FORME D’OBJET LE TYPE (OBJECTID) POUR INDIQUER QUE LA PROPRIÉTÉ  USERADDRESS CONTIENDRA L’IDENTIFIANT DE L’ADRESSE À LAQUELLE IL FAIT RÉFÉRENCE. LA PROPRIÉTÉ REF PERMET DE FOURNIR DES INFORMATIONS SUR LE NOM DE LA COLLECTION À LAQUELLE ON FAIT RÉFÉRENCE.

userSchema.pre("save", function(next) {
    const user = this;

    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function(saltError, salt) {
            if (saltError) {
                return next(saltError)
            } else {
                bcrypt.hash(user.password, salt, function(hashError, hash) {
                    if (hashError) {
                        return next(hashError)
                    }
                    user.password = hash
                    next()
                })
            }
        })
    } else {
        return next()
    }
});

userSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        if (error) {
            return callback(error)
        } else {
            callback(null, isMatch)
        }
    })
};

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;