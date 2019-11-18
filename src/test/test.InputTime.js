const Component = spruits2.Component;
const TimePicker = spruits2.TimePicker;
const InputTime = spruits2.InputTime;

const testcases = [];

const tp = new TimePicker({ fieldName:"TimePicker", $modalcontainer:$("body") });

const Testcase = function(inputTime) {
  Component.call(this, { fieldName:inputTime.name });

  this.$field = inputTime.$field;
};

testcases.push(new Testcase( new InputTime({ fieldName:"InputTime 1", timepicker:tp }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>InputTime</h4>", testcases.map(testcase => testcase.$field)
);
