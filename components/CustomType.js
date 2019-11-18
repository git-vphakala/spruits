CustomType = function(args) {
let
fields = args.fields,attrs = args.attrs,callback = args.callback,crud = args.crud,view = args.view,
i,screenRowClass,viewObj,
init,
getVal,setVal,empty,validate;
init = function(that) {
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
  Component.call(that, args);
  Container.call(that, that.name);
  that.crud = crud;

  if (view !== undefined) {
    fields = view.fields[that.name].get("fields");
    viewObj = view.fields[that.name].get("that");
  }
  if (fields !== undefined) {
    for (i in fields) {
      if (fields.hasOwnProperty(i)) {
        if (view === undefined) {
          that.createField(i, fields[i].type, fields[i].args);
        } else {
          that.createField(i, fields[i].type, { view:viewObj });
        }
      }
    } // for (i)

    if (view === undefined) {
      if (callback !== undefined) {
        callback(that);
      } else {
        //that.insertFields(screenRowClass);
        //that.$field.append(that.$screen);
	that.$field.append( Object.values(that.fields).map(comp => { return $("<div>", { class:screenRowClass }).append(comp.$field); }) );
      }
    }
  } // if (fields)
};
init(this);
getVal = function(propName) {
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
};
setVal = function(propName, val) {
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
};
empty = function() {
    let i;

    for (i in this.fields) {
      if (this.fields.hasOwnProperty(i)) {
        this.fields[i].empty();
      }
    } // for (i)
};
validate = function() {
  return { valid:true };
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
};