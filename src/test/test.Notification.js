const Component = spruits2.Component;
const Notification = spruits2.Notification;

const testcases = [];

//****************************************************************************************************************************************************************************
const Testcase = function(notif) {
  let $button = $("<button>");
  
  Component.call(this, { fieldName:notif.name });
  $button.html("show").on("click", e => {
    e.preventDefault();
    notif.set("show", "This is Notification");
  });

  this.$field.append($button, notif.$field);
};

//****************************************************************************************************************************************************************************

testcases.push(new Testcase( new Notification({ fieldName:"Notification 1", insertLabel:false }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>Notification</h4>", testcases.map(testcase => testcase.$field)
);

/*
const Notification = function(args) {
  let 
  $content,
  show,
  setVal;

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
  }; // show

  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-notification hide";
  }
  if (args.$field === undefined) {
    args.$field = $("<div>");
  }

  Component.call(this, args);
  
  $content = $("<div>", { class:"content" });
  this.$field.append($content);
  
  setVal = function(propName, val) {
    switch(propName) {
    case "show":
      show({ text:val, notificationObj:this });
      break;
    }
  };
  
  this.setVal = setVal;
};
*/
