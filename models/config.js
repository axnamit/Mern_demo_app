const mongoose= require("mongoose");
const Schema =mongoose.Schema;
const configdb = new Schema({
    userid:{type:String,required:true}
});

module.exports = Configdb = mongoose.model("configdb",configdb);