const Component = spruits2.Component;
const Calendar = spruits2.Calendar;

const testcases = [];

const Dest = function() {
  Component.call(this, { fieldName:"Selected date:" });
  this.val = function(str) { this.$field.children("span").html(str); };

  this.$field.append($("<span>"));
};
const Testcase = function(cal, useModal) {
  Component.call(this, { fieldName:cal.name });
  this.cal = cal;
  this.dest = new Dest();

  this.cal.set("val", Date.now());
  this.cal.set("$dest", this.dest);
  if (useModal === true) {
    this.$field.append($("<button>").html("Open").on("click",(e) => {
      e.preventDefault();
      this.cal.set("show");
    }));
  } else {
    this.$field.append(this.cal.$field);
  }
  this.$field.append(this.dest.$field, "<hr/>");
}
testcases.push(new Testcase( new Calendar({ fieldName:"Calendar 1" }) ));
testcases.push(new Testcase( new Calendar({ fieldName:"Calendar 2", $modalcontainer:$("body") }), true ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>Calendar</h4>", testcases.map(testcase => testcase.$field)
);
