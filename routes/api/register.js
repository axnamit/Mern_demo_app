const express = require("express");
const router = express.Router();
const bycrpypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const multer = require('multer');
const fs = require('fs');
const validatorRegisterInput = require("../../validators/register");
const validateLogin = require("../../validators/login");

const User = require("../../models/user");
const UploadImage = require("../../models/upladimage");

var middleware = require("../../middleware/middleware");


const DIR = "./public/images/users";
var path = require("path");
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage: storage });


//post body
router.post("/register", (req, res, next) => {

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

//post body
router.post("/login", (req, res) => {

    const { error, isValid } = validateLogin(req.body);

    if (!isValid) {
        return res.status(400).json({ success: false, message: "something went wrong" });
    }


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
                        if (token) {
                            res.json({ success: true, token: token, message: "login successful" });
                        } else {
                            res.json({ success: false, token: err, message: "login failded" });
                        }
                    });
            } else {
                return res.status(400).json({ success: false, message: "password doesent matched" });
            }
        });
    });

});

//get body
router.get("/list", (req, res) => {
    User.find({}).then(list => {
        if (list) {
            res.json({ success: true, data: list, message: "data fetched succesfully" });
        } else {
            res.json({ success: false, data: [], message: "data fetched succesfully" });
        }

    });
});

//params
router.get("/paramscheck/:para", (req, res) => {
    res.json(req.params.para);
});


//query
router.get("/querycheck", (req, res) => {
    res.json({ alpha: req.query.alpha, amit: req.query.amit });
})


//upload photo
router.post("/upload", upload.single('image'), (req, res) => {

    var image = UploadImage({
        image: req.file.filename
    });

    image.save().then(uplaod1 => res.json({
        success: true,
        data: uplaod1,
        message: "file uploaded successfully"
    })).catch(err => console.log(err));




});
//list of images 
router.get('/allimages', middleware, (req, res, next) => {

    UploadImage.find({}).then(list => {
        if (list) {
            var list2 = []
            var entriesToDelete = [];
            list.forEach((i) => {
                if (fs.existsSync(DIR + '/' + i.image)) {
                    //file exists
                    list2.push(i.image);
                } else {
                    entriesToDelete.push(i.image);
                }

            });
            // console.log(entriesToDelete);
            // perform delete action
            deleteFakeEntries(entriesToDelete);


            res.json({
                success: true,
                data: list2,
                message: "all file fetched successfully"
            })
        } else {
            res.json({ success: false, data: [], message: "data fetched succesfully" });

        }
    })


});

function deleteFakeEntries(data) {
    //console.log("dele");
    for (const key in data) {
        console.log(key);
        const myquery = { image: data[key] };
        UploadImage.deleteOne(myquery, (err, obj) => {
            if (err) throw err;
            console.log("1 document deleted");

        });

    }
}




module.exports = router;