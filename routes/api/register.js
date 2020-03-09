const express = require("express");
const router = express.Router();
const bycrpypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");


const validatorRegisterInput = require("../../validators/register");
const validateLogin = require("../../validators/login");

const User = require("../../models/user");


router.post("/register", (req, res) => {

    const { error, isValid } = validatorRegisterInput(req.body);



    if (!isValid) {
        return res.status(400).json(error)
    }

    User.findOne({ email: req.body.email }).then(returnedStuff => {
        if (returnedStuff) {
            return res.status(400).json({ success: "false", message: "email already exist" });

        }
    });

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password


    });

    bycrpypt.genSalt(10, (err, salt) => {
        bycrpypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser.save()
                .then(user => res.
                    json(user))
                .catch(err => console.log(err));

        });
    });


});


router.post("/login", (req, res) => {

    const email = req.body.email;
    const passwd = req.body.password;

    User.findOne({ email: email }).then(user => {
        if (!user) {
            return res.status(404).json({ success: false, message: "email not found" });
        }

        bycrpypt.compare(passwd, user.password).then(isMatched => {
            if (isMatched) {
                const payload = { id: user.id, name: user.name };

                jwt.sign(payload, keys.secertOrKey, { expiresIn: 31556926 },
                    (err, token) => {
                        res.json({ success: true, token: token, message: "login successful" });
                    });
            } else {
                return res.status(400).json({ success: false, message: "password doesent matched" });
            }
        })
    })

});
module.exports = router;