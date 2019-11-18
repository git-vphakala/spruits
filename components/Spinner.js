Spinner = function(args) {
let
min = args.min,max = args.max,initial = args.initial,padding = args.padding,tailpadding = args.tailpadding,view = args.view,
doTailpadding,doPadding,handleUpClick,handleDownClick,init,
getVal,setVal,empty,validate;
doTailpadding = function(val) {
  if (tailpadding !== undefined) {
    val = (val + tailpadding).slice(0, tailpadding.length);
  }
  return val;
};
doPadding = function(val) {
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
};
handleUpClick = function(){
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
};
handleDownClick = function(){
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
};
init = function(that) {
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-spinner";
  }
  Component.call(that, args);

  if (min === undefined) {
    min = 0;
  }
  if (initial === undefined) {
    initial = min;
  }
  initial = doPadding(initial);
  initial = doTailpadding(initial);
  
  that.$field.append(
    $("<div>", {class:"arrow-up"}).on("click", handleUpClick),
    $("<input>").attr(args.attrs.input).val("" + initial), 
    $("<div>", {class:"arrow-down"}).on("click", handleDownClick)
  );
};
init(this);
getVal = function(propName) {
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
};
setVal = function(propName, val) {
  switch(propName) {
  case "init":
    this.$field.children("input").val("" + initial);
    break;
  default:
  case "val":
    this.$field.children("input").val("" + val);
    break;
  }
};
empty = function() {
};
validate = function() {
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
};