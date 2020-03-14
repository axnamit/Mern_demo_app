const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema({
    userid: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
module.exports = User = mongoose.model("user", userSchema);