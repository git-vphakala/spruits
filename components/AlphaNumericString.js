AlphaNumericString = function(args) {
let
matchRegExp = args.matchRegExp,
init,
validate;
init = function(that) {
  InputText.call(that, args);
};
init(this);
validate = function() {
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
this.validate = validate;
};