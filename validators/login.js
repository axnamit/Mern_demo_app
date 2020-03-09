const validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data){
    let errors ={};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";


    if (validator.isEmpty(data.email)) {
        errors.email = "email filed is required";

    } else if (!validator.isEmail(data.email)) {
        errors.email = "email is invalid";

    }

    if (validator.isEmpty(data.password)) {
        errors.email = "password filed is required";

    }
    if(!validator.isLength(data.password,{min:6,max:20})){
        errors.password = "password length must be 6 to 20 ";
    }

    return{
        errors,
        isValid:isEmpty(errors)
    };

};