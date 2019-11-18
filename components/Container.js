Container = function(args) {
let
init,
createField;
init = function(that) {
  that.name = args;
  that.fields = {};
};
init(this);
createField = function(fieldName, type, args) {
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
};
this.createField = createField;
};