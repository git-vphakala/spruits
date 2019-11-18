const Component = spruits2.Component;
const Spinner = spruits2.Spinner;

const testcases = [];

const Testcase = function(spinner, val) {
  Component.call(this, { insertLabel:false });
  
  if (val) spinner.set("val", val);  
  this.$field.append(spinner.$field, "<hr/>");
}
testcases.push(new Testcase( new Spinner({ fieldName:"hh", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:24, padding:"0" }) ));
testcases.push(new Testcase( new Spinner({ fieldName:"mm", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:59, padding:"0" }) ));
testcases.push(new Testcase( new Spinner({ fieldName:"ss", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:59, padding:"0" }) ));
testcases.push(new Testcase( new Spinner({ fieldName:"micros", attrs:{ input:{ class:"numdigits-6", maxlength:"6"}}, min:0, max:999999, tailpadding:"000000" }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>Spinner</h4>", testcases.map(testcase => testcase.$field)
);
