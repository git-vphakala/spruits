InputDateAndTime = function(args) {
let
mode = args.mode,cal = args.cal,timepicker = args.timepicker,view = args.view,
inputdate,inputtime,
init,
getVal,setVal,empty,validate;
init = function(that) {
  Component.call(that, args);

  if (view === undefined) {
    that.$field.addClass("spruits-inputdateandtime");
    inputdate = new InputDate({ fieldName:that.name, fieldClass:"", insertLabel:false, cal:cal });
    inputtime = new InputTime({ fieldName:that.name, fieldClass:"", insertLabel:false, mode:mode, timepicker:timepicker });

    that.$field.append(inputdate.$field, inputtime.$field);
  } else {
    inputdate = view.fields[that.name].get("inputdate");
    inputtime = view.fields[that.name].get("inputtime");
  }
};
init(this);
getVal = function(propName) {
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
};
setVal = function(propName, val) {
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
};
empty = function() {
  inputdate.set("empty");
  inputtime.set("empty");
};
validate = function() {
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
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
};