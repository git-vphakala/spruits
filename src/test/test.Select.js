const Component = spruits2.Component;
const Select = spruits2.Select;

const testcases = [];

const Testcase = function(box, val) {
  Component.call(this, { insertLabel:false });
  
  if (val) box.set("val", val);  
  this.$field.append(box.$field, "<hr/>");
}
testcases.push(new Testcase( new Select({ fieldName:"Select 1", options:{ "select 1":10, "select 2":11, "select 3":12 } }) ));
testcases.push(new Testcase( new Select({ fieldName:"Select 2", options:[ "this", "that", "another", "something-long" ] }) ));
//testcases.push(new Testcase( new Select({ fieldName:"Select 3" }), false ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>Select</h4>", testcases.map(testcase => testcase.$field)
);
