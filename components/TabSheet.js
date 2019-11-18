TabSheet = function(args) {
let
fields = args.fields,tabs = args.tabs,sheetName = args.sheetName,createScreen = args.createScreen,attrs = args.attrs,$modalcontainer = args.$modalcontainer,$pageboxes = args.$pageboxes,crud = args.crud,responsive = args.responsive,resizeAgent = args.resizeAgent,view = args.view,
sheetContainer,comps,sheets,$sheetName,$legend,$fieldset,$buttons,modal,currentWidth,screenResizeFunc,sheetValidator,validatorComps,
Sheet,useModal,handleTabButtonClick,init,
getVal,setVal,empty,validate,resize,setInvalidColor,resetInvalidColor;
Sheet = function(args) {
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
};
useModal = function() {
  return (($modalcontainer === undefined) || currentWidth) ? false : true;
};
handleTabButtonClick = function(event, $tabName, sheetName) { 
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
init = function(that) {
  Component.call(that, args);
  Container.call(that, that.name);
  
  sheetValidator = new Container(that.name);

  if (view === undefined) {
    sheetContainer = that;
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
    that.$field.append( $("<div>").css("padding-top","0.5em").append($buttons).attr((attrs && attrs.buttons && attrs.buttons.div) ? attrs.buttons.div : { class:"tabsheet-buttons" }), useModal() ? "" : $fieldset); 
    screenResizeFunc = createScreen($fieldset, comps);

    modal = new Modal({ fieldName:that.name, "$modalbody":useModal() ? $fieldset : undefined, id:getId("spruits-ts"), $container:$modalcontainer, attrs:attrs ? attrs.modal : undefined, $pageboxes:$pageboxes, crud:crud });
    
    sheets = tabs.map(name => { return new Sheet({ name:name, $sheetName:$sheetName, comps:comps, validatorComps:validatorComps }) });
    if (!useModal()) $buttons[0].trigger("click");
    if (responsive) resizeAgent.addComponent(that);
  } else {
    tabs = view.fields[that.name].getVal("tabs");
    comps = view.fields[that.name].getVal("comps");
    $sheetName = view.fields[that.name].getVal("$sheetName");
    sheets =   tabs.map(name => { return new Sheet({ name:name, $sheetName:$sheetName, comps:comps }) });
  }
};
init(this);
getVal = function(propName) {
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
};
setVal = function(propName, val) {
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
};
empty = function() {
  sheets.forEach(sheet => sheet.empty());
};
validate = function() {
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
};
resize = function(comp, newWidth) {
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
};
setInvalidColor = function(propName, val) { // val={ sheetName:{ fieldName:invalid-value } }, example: {"17":{"Price List ID":"ss17-prli"}}
  Object.keys(val).forEach(sheetName => {
    let
    $tabButton = $buttons.find($button => $button.html() === sheetName),
    sheet = sheets.find(sheet => sheet.name === sheetName);
    if ($tabButton) $tabButton.addClass("invalid");
    if (sheet) sheet.setVal("invalid-color", val[sheetName]);
  });
};
resetInvalidColor = function(propName, val) {
  $buttons.forEach($button => $button.removeClass("invalid"));
  sheets.forEach(sheet => sheet.setVal("reset-invalid-color"));
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
this.resize = resize;
this.setInvalidColor = setInvalidColor;
this.resetInvalidColor = resetInvalidColor;
};