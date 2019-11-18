const Component = spruits2.Component;
const Modal = spruits2.Modal;

const testcases = [];

const Testcase = function(modal) {
  Component.call(this, { fieldName:modal.name });
  this.modal = modal;
  this.opener = new Component({ fieldName:"modal opener", insertLabel:false });
  this.opener.$field.append($("<button>").html("Open").on("click",(e) => {
    e.preventDefault();
    console.log("show modal: " + this.name);
    this.modal.set("show");
  }));
  
  this.$field.append(this.modal.$field, this.opener.$field, "<hr/>");
}
testcases.push(new Testcase( new Modal({ fieldName:"Modal 1", $modalbody:$("<p>").css("padding", "1em").html("This is modal content") }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>Modal</h4>", testcases.map(testcase => testcase.$field)
);
