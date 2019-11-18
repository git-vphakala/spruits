function foo() {
  prop1 = new Component({ fieldName:"foo" });
}
function init() {
  foo();
}
function getVal(propName) {
}

exports.className = "Test";
exports.args = [ "param1", "param2" ];
exports.props = [ "prop1", "prop2" ];
exports.methods = { "foo":foo };
exports.init = init;
exports.interfaceFuncs = { "getVal":getVal };

