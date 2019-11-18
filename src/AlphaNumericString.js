//****************************************************************************************************************************************************************************
function init() {
  InputText.call(this, args);
}

//****************************************************************************************************************************************************************************
function validate() {
  let 
  valid = { valid:true }, value, regExp;

  regExp = matchRegExp ? matchRegExp : /[^a-z0-9A-Z]/; // default: test a non digit/alpha character

  value = this.getVal("val");
  // console.log("DigitString.validate, value=" + value);

  if (regExp.test(value)) {
    valid.valid = false;
    valid.invalid = value;
  }

  return valid;
};


//****************************************************************************************************************************************************************************
exports.className = "AlphaNumericString";
exports.args = [ "matchRegExp" ];
exports.init = init;
exports.interfaceFuncs = {
  "validate":validate
};
