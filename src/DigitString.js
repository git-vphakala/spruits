//****************************************************************************************************************************************************************************
function init() {
  InputText.call(this, args);
}

//****************************************************************************************************************************************************************************
function validate() {
    let 
      valid = { valid:true }, value, regExp = /\D/; // test a non-digit character

    value = this.getVal("val");
    // console.log("DigitString.validate, value=" + value);

    if (regExp.test(value)) {
      valid.valid = false;
      valid.invalid = value;
    }

    return valid;
}

//****************************************************************************************************************************************************************************
exports.className = "DigitString";
exports.init =      init;
exports.interfaceFuncs = {
  "validate":validate
};
