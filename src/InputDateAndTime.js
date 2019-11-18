//****************************************************************************************************************************************************************************
function init() {
  Component.call(this, args);

  if (view === undefined) {
    this.$field.addClass("spruits-inputdateandtime");
    inputdate = new InputDate({ fieldName:this.name, fieldClass:"", insertLabel:false, cal:cal });
    inputtime = new InputTime({ fieldName:this.name, fieldClass:"", insertLabel:false, mode:mode, timepicker:timepicker });

    this.$field.append(inputdate.$field, inputtime.$field);
  } else {
    inputdate = view.fields[this.name].get("inputdate");
    inputtime = view.fields[this.name].get("inputtime");
  }
}

//****************************************************************************************************************************************************************************
function getVal(propName) {
  switch (propName) {
  case "inputdate":
    return inputdate;
    break;
  case "inputtime":
    return inputtime;
    break;
  case "empty":
    return { inputdate:inputdate.get("empty"), inputtime:inputtime.get("empty") };
    break;
  default:
    return { inputdate:inputdate.get("val"), inputtime:inputtime.get("val") };
    break;
  } // switch
}; // getValue

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
  if (val === undefined) {
    inputdate.set("val", propName.inputdate);
    inputtime.set("val", propName.inputtime);
  }
  else {
    switch(propName) {
    case "val":
      inputdate.set("val", val.inputdate);
      inputtime.set("val", val.inputtime);
      break;
    case "testcaseTemplate":
      template = val.template;
      templateProcessor = val.templateProcessor;     
      break;
    } // switch (propName)
  }
}; // setVal

//****************************************************************************************************************************************************************************
function empty() {
  inputdate.set("empty");
  inputtime.set("empty");
}; // empty

//****************************************************************************************************************************************************************************
function validate() {
  let
  valid = { valid:true }, validInputdate, validInputtime;

  validInputdate = inputdate.get("valid");
  validInputtime = inputtime.get("valid");

  if (validInputdate.valid === false) {
    valid.valid = false;
    valid.invalid = { "inputdate":inputdate.get("val") };
  }

  if (validInputtime.valid === false) {
    if (valid.invalid === undefined) {
      valid.valid = false;
      valid.invalid = { "inputtime":inputtime.get("val") };
    } else {
      valid.invalid["inputtime"] = inputtime.get("val");
    }
  }

  return valid;
}; // validate

//****************************************************************************************************************************************************************************
exports.className = "InputDateAndTime";
exports.args =      [ "mode", "cal", "timepicker", "view" ];
// mode = configures the size (class) of the input field. Optional. */  
exports.props =     [ "inputdate", "inputtime" ];
//exports.methods =   { };
exports.init =      init;
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};
