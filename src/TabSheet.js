//****************************************************************************************************************************************************************************
function init() {
  Component.call(this, args);
  Container.call(this, this.name);
  
  sheetValidator = new Container(this.name);

  if (view === undefined) {
    sheetContainer = this;
    fields.forEach(field => {
      sheetContainer.createField(field[0], field[1], field[2]);
      sheetValidator.createField(field[0], field[1], field[2]);
    });
    comps = Object.values(sheetContainer.fields);
    validatorComps = Object.values(sheetValidator.fields);

    currentWidth = mediaQuery();
    
    $sheetName = $("<span>").html("");
    $legend =    $("<legend>").append(sheetName, $sheetName);
    $fieldset =  $("<fieldset>").append($legend).attr((attrs && attrs.fieldset) ? (isFunction(attrs.fieldset) ? attrs.fieldset() : attrs.fieldset) : {});
    $buttons = tabs.map(name => { return $("<button>").html(name).on("click", (e) => handleTabButtonClick(e, $sheetName, name)); }); // XXX (attrs && attrs.buttons && attrs.buttons.button) ? attrs.buttons.button[name] : {}
    this.$field.append( $("<div>").css("padding-top","0.5em").append($buttons).attr((attrs && attrs.buttons && attrs.buttons.div) ? attrs.buttons.div : { class:"tabsheet-buttons" }), useModal() ? "" : $fieldset); 
    screenResizeFunc = createScreen($fieldset, comps);

    modal = new Modal({ fieldName:this.name, "$modalbody":useModal() ? $fieldset : undefined, id:getId("spruits-ts"), $container:$modalcontainer, attrs:attrs ? attrs.modal : undefined, $pageboxes:$pageboxes, crud:crud });
    
    sheets = tabs.map(name => { return new Sheet({ name:name, $sheetName:$sheetName, comps:comps, validatorComps:validatorComps }) });
    if (!useModal()) $buttons[0].trigger("click");
    if (responsive) resizeAgent.addComponent(this);
  } else {
    tabs = view.fields[this.name].getVal("tabs");
    comps = view.fields[this.name].getVal("comps");
    $sheetName = view.fields[this.name].getVal("$sheetName");
    sheets =   tabs.map(name => { return new Sheet({ name:name, $sheetName:$sheetName, comps:comps }) });
  }
}

//****************************************************************************************************************************************************************************
function Sheet(args) {
  let
  $sheetName = args.$sheetName, comps = args.comps, validatorComps = args.validatorComps,
  val, invalid,
  getVal, setVal, empty, validate;

  getVal = function(propName){
    switch(propName) {
    case "val":
    default:
      if (this.name === $sheetName.html() /* current */) {
	val = {};
	comps.forEach(comp => { val[comp.name] = comp.get("val"); });
      } else {
	if (val === undefined) {
	  val = {};
	  comps.forEach(comp => { val[comp.name] = comp.get("empty"); });
	}
      }
      return val;
      break;
    case "empty":
      val = {};
      comps.forEach(comp => { val[comp.name] = comp.get("empty"); });
      return val;
      break;
    }
  }; // getVal

  setVal = function(propName, valArg) {
    switch(propName){
    case "invalid-color":
      if (valArg) invalid = valArg;
      if (invalid) {
	if (this.name === $sheetName.html()) { // current sheet
	  Object.keys(invalid).forEach(fieldName => {
	    let comp = comps.find(comp => comp.name === fieldName);
	    if (comp) comp.set("invalid-color", invalid[fieldName]);
	  });
	}
      } else {
	comps.forEach(comp => comp.set("reset-invalid-color"));
      }
      break;
    case "reset-invalid-color":
      if (invalid) {
	if (this.name === $sheetName.html()) { // current sheet
	  comps.forEach(comp => comp.set("reset-invalid-color"));
	}
	invalid = undefined;
      }
      break;
    case "val":
    default:
      val = valArg;
      if (this.name === $sheetName.html() /* current */) {
	comps.forEach(comp => comp.set("val", val[comp.name]));
      }
      break;
    }
  }; // setVal

  empty = function(){
    this.getVal("empty"); // XXX
  };

  validate = function() {
    let val = this.getVal("val"), compValid, valid = { valid:true };
    
    validatorComps.forEach(comp => {
      comp.set("val", val[comp.name]);
      
      compValid = comp.get("valid");
      if (compValid.valid === false) {
	valid.valid = false;
	if (valid.invalid === undefined) valid.invalid = {};
	valid.invalid[comp.name] = compValid.invalid;
      }
    });

    return valid;
  };

  this.name = args.name;

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
}; // Sheet

//****************************************************************************************************************************************************************************
function useModal() {
  return (($modalcontainer === undefined) || currentWidth) ? false : true;
};

//****************************************************************************************************************************************************************************
function handleTabButtonClick(event, $tabName, sheetName) { 
  let current = $tabName.html(), sheet, val;

  event.preventDefault();
  if (!useModal() && current === sheetName) return; // No action when the clicked sheet is already in the dom sheet.

  if (current.length) {
    // Store the dom sheet to the current sheet.
    sheet = sheets.find((sheet) => { return (sheet.name === current) });
    sheet !== undefined ? sheet.getVal("val") : console.log("HanleTabButtonClick, store view: sheet undefined, " + current);
  }

  // Set the dom sheet to show the clicked sheet and set it as current.
  sheet = sheets.find(sheet => sheet.name === sheetName);
  if (sheet) {
    val = sheet.getVal("val");
    $tabName.html(sheetName); // Dom components are set by sheet.setVal(), because the current sheet equals to sheet.name.
    sheet.setVal("val", val);
    sheet.setVal("invalid-color");
    if (useModal()) modal.set("show");
  } else {
    console.log("HandleTabButtonClick, set view: sheet undefined, " + sheetName);
  }
};

//****************************************************************************************************************************************************************************
function getVal(propName) {
  let val = {};
  
  switch(propName) {
  case "val":
  default:
    sheets.forEach(sheet => { val[sheet.name] = sheet.getVal("val"); } );
    return val;
  case "empty":
    sheets.forEach(sheet => { val[sheet.name] = sheet.getVal("empty"); } );
    return val;
  case "tabs": return tabs;
  case "comps": return comps;
  case "$sheetName": return $sheetName;
  }
}

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
  if (!val) {
    val = propName;
    propName = "val";
  }
  switch(propName) {
  case "val":
    sheets.forEach(sheet => { sheet.setVal("val", val[sheet.name]) });
    break;
  default:
    console.log("*** TabSheet.setVal, default, name=" + this.name + ", propName=" + propName + ", val=" + JSON.stringify(val));
    break;
  }
}

//****************************************************************************************************************************************************************************
function empty() {
  sheets.forEach(sheet => sheet.empty());
}

//****************************************************************************************************************************************************************************
function validate() {
  let
  sheetValid, valid = { valid:true };

  sheets.forEach(sheet => {
    sheetValid = sheet.validate();
    if (sheetValid.valid === false) {
      valid.valid = false;
      if (valid.invalid === undefined) {
        valid.invalid = {};
      }
      valid.invalid[sheet.name] = sheetValid.invalid;
    } 
  });
  
  return valid;
}

//****************************************************************************************************************************************************************************
function resize(comp, newWidth) {
  let currentMode, newMode;
  
  if (newWidth !== currentWidth) {
    currentMode = useModal();
    currentWidth = newWidth;
    newMode = useModal();
    if (newMode !== currentMode) {
      $fieldset.attr((attrs && attrs.fieldset) ? (isFunction(attrs.fieldset) ? attrs.fieldset() : attrs.fieldset) : {}); // XXX create function for attrs
      if (newMode === true) {
	modal.set("$modalbody", $fieldset);
      } else {
	modal.set("close");
	this.$field.append($fieldset);
	$buttons[0].trigger("click");
      }
      if (screenResizeFunc) screenResizeFunc($fieldset);
    }
  }
}

//****************************************************************************************************************************************************************************
function setInvalidColor(propName, val) { // val={ sheetName:{ fieldName:invalid-value } }, example: {"17":{"Price List ID":"ss17-prli"}}
  Object.keys(val).forEach(sheetName => {
    let
    $tabButton = $buttons.find($button => $button.html() === sheetName),
    sheet = sheets.find(sheet => sheet.name === sheetName);
    if ($tabButton) $tabButton.addClass("invalid");
    if (sheet) sheet.setVal("invalid-color", val[sheetName]);
  });
}

//****************************************************************************************************************************************************************************
function resetInvalidColor(propName, val) {
  $buttons.forEach($button => $button.removeClass("invalid"));
  sheets.forEach(sheet => sheet.setVal("reset-invalid-color"));
}

//****************************************************************************************************************************************************************************
exports.className = "TabSheet";
exports.args =      [ "fields", "tabs", "sheetName", "createScreen", "attrs", "$modalcontainer", "$pageboxes", "crud", "responsive", "resizeAgent", "view" ];
exports.props =     [ "sheetContainer", "comps", "sheets", "$sheetName", "$legend", "$fieldset", "$buttons", "modal", "currentWidth", "screenResizeFunc", "sheetValidator", "validatorComps" ];
exports.methods =   { "Sheet":Sheet, "useModal":useModal, "handleTabButtonClick":handleTabButtonClick };
exports.init =      init;
//exports.interfaceProps = [
// ""
//]
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate, "resize":resize, setInvalidColor:setInvalidColor, resetInvalidColor:resetInvalidColor, 
};
