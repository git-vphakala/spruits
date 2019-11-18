const Component = spruits2.Component;
const Calendar = spruits2.Calendar;
const TimePicker = spruits2.TimePicker;
const InputDateAndTime = spruits2.InputDateAndTime;
const Menu = spruits2.Menu;
const Entity = spruits2.Entity;
const TouchManager = spruits2.TouchManager;

const testcases = [];

//****************************************************************************************************************************************************************************
const Testcase = function(tm) {
  let $page = $("<div>", { class:"page" }).on("swipe-right", (e) => {
    e.preventDefault();
    $page.append($("<div>").html("swipe-right"));
  }).on("swipe-left", (e) => {
    e.preventDefault();
    $page.append($("<div>").html("swipe-left"));    
  });
  
  Component.call(this, { fieldName:tm.name });

  this.$field.append(
    $("<button>").html("slideIn").on("click",(e) => { e.preventDefault(); $page.append( $("<h4>").html("Do swipes") ).addClass("slideIn"); }),
    $page
  );
};

testcases.push(new Testcase( new TouchManager({ fieldName:"TouchManager 1" }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>TouchManager</h4>", testcases.map(testcase => testcase.$field)
);
