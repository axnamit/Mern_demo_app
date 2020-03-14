
module.exports = function(req, res, next) {

    if (req.headers.userid == 12) {
        //res.setHeader("Content-Type", "text/html")
        res.status(400).send("Invalid token.");
        console.log(req.headers.userid)
    } else{
        next();
    }
};