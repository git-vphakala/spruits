//****************************************************************************************************************************************************************************
function init() {
  if (args !== undefined) {
    fields = args.fields;
    view = args.view;
    if (args.attrs !== undefined && args.attrs.$row !== undefined) {
      screenRowClass = args.attrs.$row.class;
    }
    if (screenRowClass === undefined) screenRowClass = "field-row";
    callback = args.callback;
    crud = args.crud;
  }
  Component.call(this, args);
  Container.call(this, this.name);
  this.crud = crud;

  if (view !== undefined) {
    fields = view.fields[this.name].get("fields");
    viewObj = view.fields[this.name].get("this");
  }
  if (fields !== undefined) {
    for (i in fields) {
      if (fields.hasOwnProperty(i)) {
        if (view === undefined) {
          this.createField(i, fields[i].type, fields[i].args);
        } else {
          this.createField(i, fields[i].type, { view:viewObj });
        }
      }
    } // for (i)

    if (view === undefined) {
      if (callback !== undefined) {
        callback(this);
      } else {
        //this.insertFields(screenRowClass);
        //this.$field.append(this.$screen);
	this.$field.append( Object.values(this.fields).map(comp => { return $("<div>", { class:screenRowClass }).append(comp.$field); }) );
      }
    }
  } // if (fields)
}

//****************************************************************************************************************************************************************************
function getVal(propName) {
    let val, i;

    switch (propName) {
    case "fields":
      return fields;
      break;
    case "this":
      return this;
      break;
    default:
      val = {};
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          val[i] = this.fields[i].get("val");
          console.log("CustomeType.getVal[" + i + "] = " + val[i]);
        }
      } // for (i)
      break;
    case "empty":
      val = {};
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          val[i] = this.fields[i].get("empty");
          console.log("CustomeType.getVal[" + i + "] = " + val[i]);
        }
      } // for (i)
      break;
    } // switch

    return val;
}; // getValue

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
    let i;

    if (val === undefined) {
      val = propName;
    }
    switch (propName) {
    default:
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          this.fields[i].set("val", val[i]);
        }
      } // for (i)
      break;
    } // switch
}; // setVal

//****************************************************************************************************************************************************************************
function empty() {
    let i;

    for (i in this.fields) {
      if (this.fields.hasOwnProperty(i)) {
        this.fields[i].empty();
      }
    } // for (i)
}; // empty

//****************************************************************************************************************************************************************************
function validate() {
  return { valid:true };
}; // validate

//****************************************************************************************************************************************************************************
exports.className = "CustomType";
exports.args =      [ "fields", "attrs", "callback", "crud", "view" ];
exports.props =     [ "i", "screenRowClass", "viewObj" ];
//exports.methods =   { };
exports.init =      init;
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};
