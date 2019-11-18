const testcases = [];

//****************************************************************************************************************************************************************************
const Testcase = function(pm) {
  spruits2.Component.call(this, { fieldName:pm.name, insertLabel:false });
  this.$field = pm.$field;
};

testcases.push(new Testcase( new spruits2.PageManager({ screens:{}, menubar:[], dropdown:{} }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  testcases.map(testcase => testcase.$field)
);
