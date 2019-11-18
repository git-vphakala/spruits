//****************************************************************************************************************************************************************************
function init() {
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

  Component.call(this, args);
  if (view === undefined) {
    $input = $("<input>", { type:"checkbox" });
    $input[0].checked = initial;
    this.$field.append($input);
    if (custom !== false) {
      this.$field.addClass("checkbox");
      $input.attr("style", "margin-right:0");
      $checkmark = $("<span>", { class:"checkmark" }).on("click", handleClickCheckbox);
      this.$field.append($checkmark);
    }
  } else {
    $input = view.fields[this.name].get("$input");
    initial = view.fields[this.name].get("initial");
    $input[0].checked = initial;
  }
}

//****************************************************************************************************************************************************************************
function handleClickCheckbox(e) {
  e.preventDefault();
  $input[0].checked = $input[0].checked ? false : true;
}

//****************************************************************************************************************************************************************************
function getVal(propName) {
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
}

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
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
}

//****************************************************************************************************************************************************************************
function empty() {
  $input[0].checked = initial;
}

//****************************************************************************************************************************************************************************
function validate() {
  return { valid:true };
}

//****************************************************************************************************************************************************************************
exports.className = "InputCheckbox";
exports.args =      [ "view", "custom" ];
exports.props =     [ "initial", "$input", "$checkmark" ];
exports.methods =   { handleClickCheckbox:handleClickCheckbox };
exports.init =      init;
exports.interfaceProps = [
 "$input"
];
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};
