const mongoose = require("mongoose");
const schema = mongoose.Schema;
const uplaodimage = new schema({
    image:{type:String,required:true}
});

module.exports = UploadImage = mongoose.model("uplaod-image",uplaodimage)