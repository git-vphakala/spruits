const Component = spruits2.Component;

const testcases = [];

//****************************************************************************************************************************************************************************
function RadioGroup2(args) {
  let
  buttonNames = args.buttonNames,
  
  RadioButton = function(args) {
    let groupName = args.groupName;
    
    Component.call(this, args);
    this.$field.addClass("radiobutton").append(
      $("<input>", { type:"radio", name:groupName, value:this.name })
    );
  };

  Component.call(this, args);

  buttonNames.map(buttonName => {
    return new RadioButton({ fieldName:buttonName, groupName:this.name }); // , attrs:{ label:{ class:"rb-label" } }
  }).forEach(comp => { this.$field.append(comp.$field); });
}
$("#spruits-app-styles").append(".radiobutton { display:block; padding-left:1em; }");

testcases.push({ $field:$("<div>", { style:"height:1em" }) }, new RadioGroup2({ fieldName:"Gender,v2", buttonNames:[ "Male", "Female", "Other" ] }));


//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>RadioGroup2</h4>", testcases.map(testcase => testcase.$field)
);
