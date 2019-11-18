ResizeAgent = function(args) {
let
view = args.view,
agent,currentWidth,
handleResizeEvent,init,
getVal,setVal,empty,validate,addComponent;
handleResizeEvent = function() {
  let newWidth = mediaQuery();

  if (newWidth !== currentWidth) {
    console.log("ResizeAgent, newWidth=" + newWidth); // XXX
    Object.values(agent.fields).forEach(comp => comp.resize(comp, newWidth));
    currentWidth = newWidth;
  }
};
init = function(that) {
  CustomType.call(that, { fieldName:args.fieldName, fields:{} });

  currentWidth = mediaQuery();
  $(window).on("resize", handleResizeEvent);
  agent = that;
  that.addComponent = addComponent;

  console.log("ResizeAgent, currentWidth=" + currentWidth); // XXX
};
init(this);
getVal = function(propName) {
};
setVal = function(propName, val) {
};
empty = function() {
};
validate = function() {
};
addComponent = function(comp) {
  this.fields["" + Object.values(this.fields).length] = comp;
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
this.addComponent = addComponent;
};