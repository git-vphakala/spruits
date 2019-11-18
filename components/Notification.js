Notification = function(args) {
let
$content,
show,init,
getVal,setVal,empty,validate;
show = function(args) {
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
};
init = function(that) {
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-notification hide";
  }
  if (args.$field === undefined) {
    args.$field = $("<div>");
  }

  Component.call(that, args);
  
  $content = $("<div>", { class:"content" });
  that.$field.append($content);
};
init(this);
getVal = function(propName) {
};
setVal = function(propName, val) {
  switch(propName) {
  case "show":
    show({ text:val, notificationObj:this });
    break;
  }
};
empty = function() {
};
validate = function() {
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
};