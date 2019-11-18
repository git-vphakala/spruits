//****************************************************************************************************************************************************************************
function init() {
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-spinner";
  }
  Component.call(this, args);

  if (min === undefined) {
    min = 0;
  }
  if (initial === undefined) {
    initial = min;
  }
  initial = doPadding(initial);
  initial = doTailpadding(initial);
  
  this.$field.append(
    $("<div>", {class:"arrow-up"}).on("click", handleUpClick),
    $("<input>").attr(args.attrs.input).val("" + initial), 
    $("<div>", {class:"arrow-down"}).on("click", handleDownClick)
  );
}

//****************************************************************************************************************************************************************************
function doPadding(val) {
  let isNegative = false;

  if (padding !== undefined) {
    if (parseInt(val) < 0) {
      isNegative = true;
    }
    val = (padding + Math.abs(val)).slice(-(padding.length + 1));
    if (isNegative === true) {
      val = "-" + val;
    }
  }

  return val;
}

//****************************************************************************************************************************************************************************
function doTailpadding(val) {
  if (tailpadding !== undefined) {
    val = (val + tailpadding).slice(0, tailpadding.length);
  }
  return val;
} // doTailpadding

//****************************************************************************************************************************************************************************
function handleUpClick(){
  let val = parseInt($(this).next().val());

  if ((max !== undefined && val >= max) || (min !== undefined && val < min) || isNaN(val)) {
    val = min;
  } else {
    val += 1;
  }
  val = doPadding(val);
  val = doTailpadding(val);
  $(this).next().val(val);

  return false; 
}

//****************************************************************************************************************************************************************************
function handleDownClick(){
  let val = parseInt($(this).prev().val());

  if ((min !== undefined && val <= min) || (max !== undefined && val > max) || isNaN(val)) {
    val = max;
  } else {
    val -= 1;
  }
  val = doPadding(val);
  val = doTailpadding(val);
  $(this).prev().val(val);

  return false; 
}					
					
//****************************************************************************************************************************************************************************
function getVal(propName) {
  let val;

  switch(propName) {
  default:
  case "val":
    val = this.$field.children("input").val();
    val = doPadding(val);
    val = doTailpadding(val);
    break;
  }
  return val;
}

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
  switch(propName) {
  case "init":
    this.$field.children("input").val("" + initial);
    break;
  default:
  case "val":
    this.$field.children("input").val("" + val);
    break;
  }
}

//****************************************************************************************************************************************************************************
function empty() {
}

//****************************************************************************************************************************************************************************
function validate() {
}

//****************************************************************************************************************************************************************************
exports.className = "Spinner";
exports.args =      [ "min", "max", "initial", "padding", "tailpadding", "view" ];
// exports.props =     [];
exports.methods =   { "doTailpadding":doTailpadding, "doPadding":doPadding, "handleUpClick":handleUpClick, "handleDownClick":handleDownClick };
exports.init =      init;
/*exports.interfaceProps = [
 ""
]*/
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};
