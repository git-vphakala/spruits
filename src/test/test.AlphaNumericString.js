const Component = spruits2.Component;
const AlphaNumericString = spruits2.AlphaNumericString;

const testcases = [];

const Testcase = function(anstr, val) {
  Component.call(this, { insertLabel:false });
  
  if (val) anstr.set("val", val);  
  this.$field.append(anstr.$field, "<hr/>");
  this.comp = anstr;
};

testcases.push(new Testcase( new AlphaNumericString({ fieldName:"AlphaNumericString 1" }) ));
testcases.push(new Testcase( new AlphaNumericString({ fieldName:"AlphaNumericString 2" }), "1234567890" ));
testcases.push(new Testcase( new AlphaNumericString({ fieldName:"AlphaNumericString 3" }), "acdc" ));

const Validator = function() {
  Component.call(this, { fieldName:"Validator" });
  
  testcases.forEach(testcase => {
    if (testcase.comp) {
      this.$field.append($("<div>").html(testcase.comp.name + ":" + JSON.stringify(testcase.comp.get("valid"))));
    }
  });
};
testcases.push(new Validator());

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>AlphaNumericString</h4>", testcases.map(testcase => testcase.$field)
);
