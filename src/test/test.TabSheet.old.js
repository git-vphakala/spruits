const Component =   spruits2.Component;
const Container =   spruits2.Container;
const DigitString = spruits2.DigitString;
const InputDate =   spruits2.InputDate;
const Table =       spruits2.Table;
const Modal =       spruits2.Modal;
const Calendar =    spruits2.Calendar;
const ResizeAgent = spruits2.ResizeAgent;
const getId =       spruits2.getId;
const mediaQuery =  spruits2.mediaQuery;
const isFunction =  spruits2.isFunction;

const testcases = [];

//****************************************************************************************************************************************************************************
const cal = new Calendar({ fieldName:"Calendar", $modalcontainer:$("body") });
const resizeAgent  = new ResizeAgent({ fieldName:"resizeAgent" });

//****************************************************************************************************************************************************************************
const Testcase = function(ts) {
  Component.call(this, { insertLabel:false });
  
  this.$field.append(ts.$field, "<hr/>");
}

//****************************************************************************************************************************************************************************
function TabSheet(args) {
  let fields = args.fields, tabs = args.tabs, sheetName = args.sheetName, createScreen = args.createScreen, attrs = args.attrs, view = args.view, $modalcontainer = args.$modalcontainer, $pageboxes = args.$pageboxes,
      crud = args.crud, resizeAgent = args.resizeAgent;
  
  let sheetContainer, comps, sheets, $sheetName, $legend, $fieldset, $buttons, modal, currentWidth;
  let Sheet, useModal, handleTabButtonClick, getVal, setVal, empty, resize, screenResizeFunc;

  //****************************************************************************************************************************************************************************
  Sheet = function(args) {
    let
    $sheetName = args.$sheetName, comps = args.comps,
    val,
    getVal, setVal, empty;

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

    setVal = function(propName, valArg){
      switch(propName){
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
      this.getVal("empty");
    };

    this.name = args.name;

    this.getVal = getVal;
    this.setVal = setVal;
    this.empty = empty;
  }; // Sheet

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
      if (useModal()) modal.set("show");
    } else {
      console.log("HandleTabButtonClick, set view: sheet undefined, " + sheetName);
    }
  };

  //****************************************************************************************************************************************************************************
  Component.call(this, args);
  Container.call(this, this.name);

  if (view === undefined) {
    sheetContainer = this;
    fields.forEach(field => sheetContainer.createField(field[0], field[1], field[2]));
    comps = Object.values(sheetContainer.fields);

    currentWidth = mediaQuery();
    
    $sheetName = $("<span>").html("");
    $legend =    $("<legend>").append(sheetName, $sheetName);
    $fieldset =  $("<fieldset>").append($legend).attr((attrs && attrs.fieldset) ? (isFunction(attrs.fieldset) ? attrs.fieldset() : attrs.fieldset) : {});
    $buttons = tabs.map(name => { return $("<button>").html(name).on("click", (e) => handleTabButtonClick(e, $sheetName, name)); }); // XXX (attrs && attrs.buttons && attrs.buttons.button) ? attrs.buttons.button[name] : {}
    this.$field.append( $("<div>").css("padding-top","0.5em").append($buttons).attr((attrs && attrs.buttons && attrs.buttons.div) ? attrs.buttons.div : {}), useModal() ? "" : $fieldset); 
    screenResizeFunc = createScreen($fieldset, comps);

    modal = new Modal({ fieldName:this.name, "$modalbody":useModal() ? $fieldset : undefined, id:getId("spruits-ts"), $container:$modalcontainer, attrs:attrs ? attrs.modal : undefined, $pageboxes:$pageboxes, crud:crud });
    
    sheets =   tabs.map(name => { return new Sheet({ name:name, $sheetName:$sheetName, comps:comps }) });
    if (!useModal()) $buttons[0].trigger("click");
    if (resizeAgent) resizeAgent.addComponent(this);
  } else {
    tabs = view.fields[this.name].getVal("tabs");
    comps = view.fields[this.name].getVal("comps");
    $sheetName = view.fields[this.name].getVal("$sheetName");
    sheets =   tabs.map(name => { return new Sheet({ name:name, $sheetName:$sheetName, comps:comps }) });
  }
  
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
  
  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.resize = resize;
}

//****************************************************************************************************************************************************************************
const createPartiesScreen = function($screen, comps) {
  $screen.append("This is the view of the Parties.", $("<div>").css({display:"flex"}).append(comps.map(comp => comp.$field)) );
};

const fields = [
  [ "Number Masks", Table, { numRows:3, colTypes:[ { type:DigitString, args:{ size:"15" } } ] } ],
  [ "Service ID", DigitString, { size:"5", attrs:{ label:{ style:"padding-bottom:0.5em;" } } } ],
  [ "Valid Until", InputDate, { cal:cal, attrs:{ label:{ style:"padding-bottom:0.5em;" } } } ],
  [ "Parties", TabSheet, {
    fields:[[ "Tariff ID", DigitString, { size:"20" } ]], tabs:["a", "b", "c"], createScreen:createPartiesScreen, sheetName:"Party ",
    attrs:{ fieldset:{style:"margin-left:1em;"}, buttons:{div:{style:"margin-left:1em;margin-top:0.5em;"}} }
  } ]
];
const services = [ "1", "2", "3", "4", "5" ];

const createScreen = function($screen, comps) {
  $screen.append("This is the view of the Services.", $("<div>").css(mediaQuery() ? {display:"flex"} : {}).append(comps.map(comp => comp.$field)) );
  
  return (($screen) => { // The returned function is called after resize-event.
    let ds = mediaQuery() ? {display:"flex"} : {display:""};
    $screen.children("div").css(ds);
  });
};

testcases.push(new Testcase(
  new TabSheet({ fieldName:"Services",       fields:fields, tabs:services, createScreen:createScreen, sheetName:"Service ", attrs:{ fieldset:{ style:"margin-right:2em;" } } })
));
testcases.push(new Testcase(
  new TabSheet({ fieldName:"Modal Services", fields:fields, tabs:services, createScreen:createScreen, sheetName:"Service ", attrs:{ fieldset:() => { return (mediaQuery() ? { style:"margin-right:2em;" } : { style:"" }); } },
		 $modalcontainer:$("body"), resizeAgent:resizeAgent })
));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>TabSheet</h4>", testcases.map(testcase => testcase.$field)
);
