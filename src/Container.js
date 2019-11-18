//****************************************************************************************************************************************************************************
// init
function init() {
  this.name = args;
  this.fields = {};
}

//****************************************************************************************************************************************************************************
function createField(fieldName, type, args) {
  if (args === undefined) {
    args = {};
    args["fieldName"] = fieldName;
  }

  if (args.fieldName === undefined) {
    args["fieldName"] = fieldName;
  }

  if (args.crud === undefined) {
    args.crud = this.crud; // PageManager has set the property XXX
  }

  if (args.responsive === undefined) args.responsive = this.responsive;
  if (args.resizeAgent === undefined) args.resizeAgent = this.resizeAgent;
  
  try {
    this.fields[fieldName] = new type(args);
  } catch (err) {
    console.log(err);
  }
}

//****************************************************************************************************************************************************************************
exports.className = "Container";
//exports.args =      [];
//exports.props =     [];
//exports.methods =   {};
exports.init =      init;
exports.interfaceFuncs = {
  createField:createField
};
