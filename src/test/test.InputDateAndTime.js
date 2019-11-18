const Component = spruits2.Component;
const Calendar = spruits2.Calendar;
const TimePicker = spruits2.TimePicker;
const InputDateAndTime = spruits2.InputDateAndTime;

const testcases = [];

const cal = new Calendar({ fieldName:"Calendar", $modalcontainer:$("body") });
const tp = new TimePicker({ fieldName:"TimePicker", $modalcontainer:$("body") });

const Testcase = function(inputDateAndTime) {
  Component.call(this, { fieldName:inputDateAndTime.name });

  this.$field = inputDateAndTime.$field;
};

testcases.push(new Testcase( new InputDateAndTime({ fieldName:"InputDateAndTime 1", cal:cal, timepicker:tp }) ));
testcases.push(new Testcase( new InputDateAndTime({ fieldName:"InputDateAndTime 2", cal:cal, timepicker:tp, mode:"hhmmss" }) ));
testcases.push(new Testcase( new InputDateAndTime({ fieldName:"InputDateAndTime 3", cal:cal, timepicker:tp, mode:"hhmmssmicros" }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>InputDateAndTime</h4>", testcases.map(testcase => testcase.$field)
);
