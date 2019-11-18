InputText = function(args) {
let
size = args.size,$input = args.$input,view = args.view,
me,
init,
getVal,setVal,empty;
init = function(that) {
  let inputProps;
  
  Component.call(that, args);

  if (view !== undefined) {
    $input = view.fields[that.name].$input;
  }

  if ($input === undefined) {
    $input = $("<input type=\"text\">").on("blur", e => that.handleBlur(e, me));
    if (that.attrs !== undefined && that.attrs.input !== undefined) {
      if (isArray(that.attrs.input)) {
	that.attrs.input.forEach(val => that.$field.append( $("<input type=\"text\">").attr(val) ));
      } else {
        $input.attr(that.attrs.input);
	
	inputProps = getAttr(args.props, undefined, "input");
	if (inputProps !== undefined) Object.entries(inputProps).map(prop => $input.prop(prop[0], prop[1]));
	
        that.$field.append($input);
      }
    } else {
      that.$field.append($input);

      if (size !== undefined) {
        $input.attr({ "size":size, "maxlength":size });
        $input.addClass("len" + size);
      }
    }
  } // $input === undefined
  me = that;
};
init(this);
getVal = function(propName) {
  switch(propName) {
  default:
    return this.$input.val();
  case "empty":
    return "";
  }
};
setVal = function(propName, val) {
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
};
empty = function() {
  this.$input.val("");
};
this.$input = $input;
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
};