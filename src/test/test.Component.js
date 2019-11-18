const Component = spruits2.Component;

const testcases = [];

const Testcase = function(comp) {
  Component.call(this, { fieldName:comp.name });

  this.$field = $("<div>").append( comp.$field );
};

testcases.push(new Testcase( new Component({ fieldName:"Component 1", insertLabel:false, $field:"This is content." }) ));
testcases.push(new Testcase( new Component({ fieldName:"Hello world!!!" }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>Component</h4>", testcases.map(testcase => testcase.$field)
);
