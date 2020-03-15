const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
module.exports = function (req, res, next) {

    const userid = req.headers.userid;
    const token = req.headers.token;

    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        //if can verify the token, set req.user and pass to next middleware
        var decoded = jwt.verify(token, keys.secertOrKey);
        decoded=JSON.stringify(decoded);
        var js = JSON.parse(decoded)
        console.log(js.userid);
        if(js.userid == userid){
            next();
        }else{
            res.status(400).json({
                success :false,
                auth: "token doesnt match",
                userid:js.userid
            });
        }
       
    } catch (ex) {
        //if invalid token
        res.status(400).json({
            success :false,
            auth: "token doesnt match"
        });
    }




    /* if (req.headers.userid == 12) {
        //res.setHeader("Content-Type", "text/html")
        res.status(400).send("Invalid token.");
        console.log(req.headers.userid)
    } else{
        next();
    } */
};