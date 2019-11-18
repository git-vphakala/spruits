//****************************************************************************************************************************************************************************
function init() {
  name = args.fieldName;
  
  if (view !== undefined) {
    if (view.fields[name] === undefined) {
      console.log("*** Component, view.fields === undefined, name=" + name);
    }
    $field = view.fields[name].$field;
    $label = view.fields[name].$label;
    attrs = view.fields[name].attrs;
    insertLabel = false;
  } else {
    if ($field === undefined) {
      $field = $("<span class=\"spruit-field\"></span>");

      if (attrs !== undefined) {
	if (attrs.span !== undefined) {
          if (attrs.mediaquery !== undefined && attrs.mediaquery.span !== undefined) {
            if (attrs.mediaquery.span()) {
              $field.attr(attrs.span());
            }
          } else {
            $field.attr(attrs.span);
          }
	}
      }
    }

    if (fieldClass !== undefined) {
      if (fieldClass !== false) {
	$field.removeClass("spruit-field");
	$field.addClass(fieldClass);
      }
    }

    $label = $("<label>").html(insertLabel !== false ? name : "").attr((attrs !== undefined && attrs.label !== undefined) ? attrs.label : {});
    if (isFunction($field.append)) $field.append($label);
  }
}

//****************************************************************************************************************************************************************************
function get(propName) {
  switch (propName) {
  case "val":
    return (isFunction(this.getVal) ? this.getVal() : {} );
    break;
  case "isKey":
    return isKey;
    break;
  case "valid":
    return (isFunction(this.validate) ? this.validate() : { valid:true } );
  default:
    return this.getVal(propName);
    break;
  } // switch
}; // get

//****************************************************************************************************************************************************************************
function set(propName, val) {
  let localCacheVal;

  switch(propName) {
  case "val":
    this.setVal(val);
    break;
  case "empty":
    this.empty();
    break;
  case "invalid-color":
    this.setInvalidColor ? this.setInvalidColor(propName, val) : this.$field.find("input").addClass("invalid");
    break;
  case "reset-invalid-color":
    this.resetInvalidColor ? this.resetInvalidColor(propName, val) : this.$field.find("input").removeClass("invalid");
    break;
  default:
    this.setVal(propName, val);
    break;
  } // switch
}; // set

//****************************************************************************************************************************************************************************
function handleBlur(e, me) {
  let valid;
  
  e.preventDefault();
  console.log("Component, " + this.name + " Blur, val=" + me.get("val"));

  valid = me.validate();
  if (valid.valid === false) me.set("invalid-color");
  else me.set("reset-invalid-color");
}

//****************************************************************************************************************************************************************************
exports.className = "Component";
exports.args =      [ "insertLabel", "name", "fieldClass", "$field", "attrs", "view", "isKey" ];
exports.props =     [ "$label" ];
//exports.methods =   {};
exports.init =      init;
exports.interfaceProps = [
  "name", "attrs", "$label", "$field",
];
exports.interfaceFuncs = {
  get:get, set:set, handleBlur:handleBlur,
};
