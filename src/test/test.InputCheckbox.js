const Component = spruits2.Component;
const InputCheckbox = spruits2.InputCheckbox;

const testcases = [];

const Testcase = function(box, val) {
  Component.call(this, { insertLabel:false, fieldClass:"" });
  
  if (val) box.set("val", val);  
  this.$field.append(box.$field, "<hr/>");
}
testcases.push(new Testcase( new InputCheckbox({ fieldName:"InputCheckbox 1" }) ));
testcases.push(new Testcase( new InputCheckbox({ fieldName:"InputCheckbox 2" }), true ));
testcases.push(new Testcase( new InputCheckbox({ fieldName:"InputCheckbox 3" }), false ));

testcases.push(new Testcase( new InputCheckbox({ fieldName:"InputCheckbox 4", custom:false }), true ));
testcases.push(new Testcase( new InputCheckbox({ fieldName:"InputCheckbox 5", custom:false }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>InputCheckbox</h4>", testcases.map(testcase => testcase.$field)
);

/*
$("#spruits-app-styles").append(
  ".checkbox {",
  "display:inline-block;",
  "cursor:pointer;",
  "}",

  // Hide the browser's default checkbox
  ".checkbox input {",
  // "position: absolute;",
  "opacity: 0;",
  "cursor: pointer;",
  "height: 0;",
  "width: 0;",
  "}",

  // Create a custom checkbox
  ".checkmark {",
  "display:inline-block;",
  "height: 1em;",
  "width: 1em;",
  "margin-left:-1em;",
  "margin-right:1em;",
  "background-color: #ffff00;",
  "border:0;",
  "border-right: 1px dotted #999900;",
  "border-bottom: 1px dotted #999900;",
  "border-radius:4px;",
  "}",

  // On mouse-over, add a background color
  ".checkbox:hover input ~ .checkmark {",
  "background-color: #cccc00;",
  "}",

  // Create the checkmark/indicator (hidden when not checked)
  ".checkmark:after {",
  'content: "";',
  "display: none;",
  "}",

  // Show the checkmark when checked
  ".checkbox input:checked ~ .checkmark:after {",
  "display: block;",
  "}",

  // Style the checkmark/indicator
  ".checkbox .checkmark:after {",
  "width: 0.25em;",
  "height: 0.6em;",
  "margin-left:0.3em;",
  "border: solid #333300;",
  "border-width: 0 3px 3px 0;",
  "-webkit-transform: rotate(45deg);",
  "-ms-transform: rotate(45deg);",
  "transform: rotate(45deg);",
  "}"
);

const customCheckbox = new Component({ fieldName:"Custom Checkbox", fieldClass:"spruit-field checkbox" });
function handleClickCheckbox(e) {
  let $input = $(this).prev();
  e.preventDefault();
  $input[0].checked = $input[0].checked ? false : true;
}
customCheckbox.$field.append( $("<input>", { type:"checkbox", style:"margin-right:0" }), $("<span>", { class:"checkmark" }).on("click", handleClickCheckbox) );
testcases.push(customCheckbox);

*/
