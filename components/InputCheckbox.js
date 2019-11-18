InputCheckbox = function(args) {
let
view = args.view,custom = args.custom,
initial,$input,$checkmark,
handleClickCheckbox,init,
getVal,setVal,empty,validate;
handleClickCheckbox = function(e) {
  e.preventDefault();
  $input[0].checked = $input[0].checked ? false : true;
};
init = function(that) {
  initial = false;

  if (args === undefined) {
    args = {};
  };
  if (args.initial !== undefined) {
    initial = args.initial;
    if (initial !== true) {
      initial = false;
    }
  }

  Component.call(that, args);
  if (view === undefined) {
    $input = $("<input>", { type:"checkbox" });
    $input[0].checked = initial;
    that.$field.append($input);
    if (custom !== false) {
      that.$field.addClass("checkbox");
      $input.attr("style", "margin-right:0");
      $checkmark = $("<span>", { class:"checkmark" }).on("click", handleClickCheckbox);
      that.$field.append($checkmark);
    }
  } else {
    $input = view.fields[that.name].get("$input");
    initial = view.fields[that.name].get("initial");
    $input[0].checked = initial;
  }
};
init(this);
getVal = function(propName) {
  switch(propName) {
  case "$input":
    return $input;
    break;
  case "empty":
    return initial;
    break;
  default:
    return $input.prop("checked");
    break;
  } // switch
};
setVal = function(propName, val) {
  if (val === undefined) {
    $input[0].checked = propName;
  } else {
    switch(propName) {
    case "val":
      $input[0].checked = val;
      break;
    case "testcaseTemplate":
      template = val.template;
      templateProcessor = val.templateProcessor;     
      break;
    } // switch (propName)
  }
};
empty = function() {
  $input[0].checked = initial;
};
validate = function() {
  return { valid:true };
};
this.$input = $input;
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
};