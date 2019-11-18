//****************************************************************************************************************************************************************************
function init() {
  CustomType.call(this, { fieldName:args.fieldName, fields:{} });

  currentWidth = mediaQuery();
  $(window).on("resize", handleResizeEvent);
  agent = this;
  this.addComponent = addComponent;

  console.log("ResizeAgent, currentWidth=" + currentWidth); // XXX
}

//****************************************************************************************************************************************************************************
function handleResizeEvent() {
  let newWidth = mediaQuery();

  if (newWidth !== currentWidth) {
    console.log("ResizeAgent, newWidth=" + newWidth); // XXX
    Object.values(agent.fields).forEach(comp => comp.resize(comp, newWidth));
    currentWidth = newWidth;
  }
};

//****************************************************************************************************************************************************************************
function  addComponent(comp) {
  this.fields["" + Object.values(this.fields).length] = comp;
};

//****************************************************************************************************************************************************************************
function getVal(propName) {
}; // getValue

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
}; // setVal

//****************************************************************************************************************************************************************************
function empty() {
}; // empty

//****************************************************************************************************************************************************************************
function validate() {
}; // validate

//****************************************************************************************************************************************************************************
exports.className = "ResizeAgent";
exports.args =      [ "view" ];
exports.props =     [ "agent", "currentWidth" ];
exports.methods =   { "handleResizeEvent":handleResizeEvent }
exports.init =      init;
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate, "addComponent":addComponent
};
