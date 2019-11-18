//****************************************************************************************************************************************************************************
function init() {
  if (args === undefined) {
    args = {};
  }
  if (args.size === undefined) {
    args.size = "21";
  }
  InputText.call(this, args);
}

//****************************************************************************************************************************************************************************
function formatValue(value) {
  let formattedValue = value, decimalNumber, signNegative = false, signLen = 0, signChar = "";

  if (value.length) {
    decimalNumber = value.split(".");

    if (decimalNumber[0].charAt(0) === "-") {
      signNegative = true;
      signLen = 1;
    }
    if (decimalNumber.length === 1) decimalNumber.push("0");
    if ((signNegative === true) && (parseInt(decimalNumber[0]) === 0) && (parseInt(decimalNumber[1]) > 0)) signChar = "-";
    decimalNumber[0] = "" + parseInt(decimalNumber[0]);
    decimalNumber[1] = (decimalNumber[1] + "00000").slice(0, 5);
    formattedValue = signChar + decimalNumber[0] + "." + decimalNumber[1];
  }
  
  return formattedValue;
}

//****************************************************************************************************************************************************************************
function validate() {
  let 
  valid = { valid:true }, value, regExp = /^\-?\d*\.?\d*$/, // [-] digits [ . [ decimal-digits ] ]  , XXX: accepts "-", "." and "-."
  formattedValue;
  
  value = this.getVal("val");

  if (value.match(regExp) === null || value === "-" || value === "." || value === "-.") {
    valid.valid = false;
    valid.invalid = value;
  } else {
    formattedValue = formatValue(value);
    if (formattedValue !== value) this.set("val", formattedValue);
  }

  return valid;
};


//****************************************************************************************************************************************************************************
exports.className = "DecimalDigitString";
exports.methods = { formatValue:formatValue };
exports.init =      init;
exports.interfaceFuncs = {
  "validate":validate
};
