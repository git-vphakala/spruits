//****************************************************************************************************************************************************************************
function init() {
  let inputProps;
  
  Component.call(this, args);

  if (view !== undefined) {
    $input = view.fields[this.name].$input;
  }

  if ($input === undefined) {
    $input = $("<input type=\"text\">").on("blur", e => this.handleBlur(e, me));
    if (this.attrs !== undefined && this.attrs.input !== undefined) {
      if (isArray(this.attrs.input)) {
	this.attrs.input.forEach(val => this.$field.append( $("<input type=\"text\">").attr(val) ));
      } else {
        $input.attr(this.attrs.input);
	
	inputProps = getAttr(args.props, undefined, "input");
	if (inputProps !== undefined) Object.entries(inputProps).map(prop => $input.prop(prop[0], prop[1]));
	
        this.$field.append($input);
      }
    } else {
      this.$field.append($input);

      if (size !== undefined) {
        $input.attr({ "size":size, "maxlength":size });
        $input.addClass("len" + size);
      }
    }
  } // $input === undefined
  me = this;
}

//****************************************************************************************************************************************************************************
function getVal(propName) {
  switch(propName) {
  default:
    return this.$input.val();
  case "empty":
    return "";
  }
}

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
  if (val === undefined) {
    this.$input.val(propName);
  } else {
    switch(propName) {
    case "val":
      this.$input.val(val);
      break;
    case "testcaseTemplate":
      template = val.template;
      templateProcessor = val.templateProcessor;     
      break;
    } // switch (propName)
  }
}

//****************************************************************************************************************************************************************************
function empty() {
  this.$input.val("");
}

//****************************************************************************************************************************************************************************
function validate() {
}

//****************************************************************************************************************************************************************************
exports.className = "InputText";
exports.args =      [ "size", "$input", "view" ];
exports.props =     [ "me" ],
// exports.methods =   { }
exports.init =      init;
exports.interfaceProps = [
 "$input"
]
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty //, "validate":validate
};
