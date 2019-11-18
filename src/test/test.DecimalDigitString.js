const Component = spruits2.Component;
const DecimalDigitString = spruits2.DecimalDigitString;

const testcases = [];

const Testcase = function(ddstr, val) {
  Component.call(this, { insertLabel:false });
  
  if (val) ddstr.set("val", val);  
  this.$field.append(ddstr.$field, "<hr/>");
}
testcases.push(new Testcase( new DecimalDigitString({ fieldName:"DecimalDigitString 1" }) ));
testcases.push(new Testcase( new DecimalDigitString({ fieldName:"DecimalDigitString 2" }), "12.12345" ));
testcases.push(new Testcase( new DecimalDigitString({ fieldName:"DecimalDigitString 3" }), "1.0" ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>DecimalDigitString</h4>", testcases.map(testcase => testcase.$field)
);
