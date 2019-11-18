DigitString = function(args) {
let
init,
validate;
init = function(that) {
  InputText.call(that, args);
};
init(this);
validate = function() {
    let 
      valid = { valid:true }, value, regExp = /\D/; // test a non-digit character

    value = this.getVal("val");
    // console.log("DigitString.validate, value=" + value);

    if (regExp.test(value)) {
      valid.valid = false;
      valid.invalid = value;
    }

    return valid;
};
this.validate = validate;
};