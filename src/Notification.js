//****************************************************************************************************************************************************************************
function init() {
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-notification hide";
  }
  if (args.$field === undefined) {
    args.$field = $("<div>");
  }

  Component.call(this, args);
  
  $content = $("<div>", { class:"content" });
  this.$field.append($content);
}

//****************************************************************************************************************************************************************************
function show(args) {
  let txt = args.text, notificationObj = args.notificationObj;

  if (notificationObj.$field.hasClass("fadeIn")) {
    return false;
  }
  $content.html(txt);
  notificationObj.$field.addClass("fadeIn");
  setTimeout(function(){
    notificationObj.$field.removeClass("fadeIn");
    $content.html("");
  }, 2000);
  return true;
}; // show

//****************************************************************************************************************************************************************************
function getVal(propName) {
}; // getValue

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
  switch(propName) {
  case "show":
    show({ text:val, notificationObj:this });
    break;
  }
}; // setVal

//****************************************************************************************************************************************************************************
function empty() {
}; // empty

//****************************************************************************************************************************************************************************
function validate() {
}; // validate

//****************************************************************************************************************************************************************************
exports.className = "Notification";
// exports.args =      [ ];
exports.props =     [ "$content" ];
exports.methods =   { "show":show };
exports.init =      init;
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};
