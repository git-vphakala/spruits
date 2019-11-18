const Component = spruits2.Component;
const Calendar = spruits2.Calendar;
const InputDate = spruits2.InputDate;

const testcases = [];

const cal = new Calendar({ fieldName:"Calendar", $modalcontainer:$("body") });

const Testcase = function(inputDate) {
  Component.call(this, { fieldName:cal.name });

  this.$field = inputDate.$field;
};

testcases.push(new Testcase( new InputDate({ fieldName:"InputDate 1", cal:cal }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>InputDate</h4>", testcases.map(testcase => testcase.$field)
);
