//****************************************************************************************************************************************************************************
function init() {
  Component.call(this, args);
  Container.call(this, this.name);
  State = {};
}

//****************************************************************************************************************************************************************************
function addScreenLabel() {
  this.$label.html(this.name + " Maintenance");
}

//****************************************************************************************************************************************************************************
function insertFields(rowClass, lastRowClass) {
  this.$field.append(Object.values(this.fields).map(comp => { return $("<div>", {class:rowClass ? rowClass : "screen-row"}).append(comp.$field); }));
  this.$field.children(":last-child").addClass(lastRowClass ? lastRowClass : "last");
}

//****************************************************************************************************************************************************************************
function load() {
  if (screen === undefined) {
    this.$field.append("<p>TBA</p>");
    this.addScreenLabel();
  } else {
    screen.create(this);
  }
}

//****************************************************************************************************************************************************************************
function getVal(propName) {
  let val;

  if (propName === undefined) propName = "val";
  
  switch(propName){
  case "valid":
    val = this.validate();
    break;
  case "val":
    val = {};
    Object.values(this.fields).forEach(comp => { val[comp.name] = comp.get("val"); });
    break;
  case "key":
    val = {};
    Object.values(this.fields).forEach(comp => { if (comp.get("isKey")) val[comp.name] = comp.get("val"); });
    break;
  case "State":
    return State;
    break;
  default:
    console.log("Entity.getVal, " + this.name + ", unknown propName=" + propName);
    break;
  }
  return val;
}

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
  if (val === undefined) {
    val = propName;
    propName = "val";
  }
  switch (propName) {
  case "val":
    Object.values(this.fields).forEach(comp => { comp.set("val", val[comp.name]); });
    break;
  case "State":
    State[val.key] = val.value;
    break;
  default:
    console.log("Entity.setVal, " + this.name + ", unknown propName=" + propName);
    break;
  }
}

//****************************************************************************************************************************************************************************
function empty() {
}

//****************************************************************************************************************************************************************************
function validate() {
  let valid = { valid:true, invalid:{} };

  Object.values(this.fields).forEach(comp => {
    let fieldValid = comp.get("valid");
    if (fieldValid.valid !== true) {
      valid.valid = false;
      valid.invalid[comp.name] = fieldValid.invalid;
    }
  });
  return valid;
}

//****************************************************************************************************************************************************************************
exports.className = "Entity";
exports.args =      [ "screen", "view", "cal", "timepicker", "responsive", "resizeAgent" ];
exports.props =     [ "State" ],
// exports.methods =   {}
exports.init =      init;
exports.interfaceProps = [
  "cal", "timepicker", "responsive", "resizeAgent"
];
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate, "addScreenLabel":addScreenLabel, "insertFields":insertFields, "load":load
};
