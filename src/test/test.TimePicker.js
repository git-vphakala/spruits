const Component = spruits2.Component;
const TimePicker = spruits2.TimePicker;

const testcases = [];

const Dest = function() {
  Component.call(this, { fieldName:"Selected time:" });
  this.val = function(str) { this.$field.children("span").html(str); };

  this.$field.append($("<span>"));
};

const Testcase = function(tp, useModal) {
  Component.call(this, { fieldName:tp.name });
  this.tp = tp;
  this.dest = new Dest();
  tp.set("$dest", this.dest);
  
  if (useModal === true) {
    this.$field.append($("<button>").html("Open").on("click",(e) => {
      e.preventDefault();
      this.tp.set("show");
    }));
  } else {  
    this.$field.append(tp.$field);
  }
  this.$field.append(this.dest.$field, "<hr/>");
}
testcases.push(new Testcase( new TimePicker({ fieldName:"TimePicker HH:MM" }) ));
testcases.push(new Testcase( new TimePicker({ fieldName:"TimePicker HH:MM:SS", mode:"hhmmss" }) ));
testcases.push(new Testcase( new TimePicker({ fieldName:"TimePicker HH:MM:SS.MICROS", mode:"hhmmssmicros" }) ));

testcases.push(new Testcase( new TimePicker({ fieldName:"Modal TimePicker HH:MM", mode:"hhmm", $modalcontainer:$("body") }), true ));
testcases.push(new Testcase( new TimePicker({ fieldName:"Modal TimePicker HH:MM:SS", mode:"hhmmss", $modalcontainer:$("body") }), true ));
testcases.push(new Testcase( new TimePicker({ fieldName:"Modal TimePicker HH:MM:SS.MICROS", mode:"hhmmssmicros", $modalcontainer:$("body") }), true ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>TimePicker</h4>", testcases.map(testcase => testcase.$field)
);
