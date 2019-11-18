TimePicker = function(args) {
let
$modalcontainer = args.$modalcontainer,attrs = args.attrs,$pageboxes = args.$pageboxes,view = args.view,
mode,hh,mm,ss,micros,$dest,modalId,modal,modalAttrs,
setMode,handleClickOk,init,
getVal,setVal,empty,validate;
setMode = function(m) {
  let microsOffset, fontSize, marginTop;
  
  hh.set("init");
  mm.set("init");

  switch (m) {
  default:
  case "hhmm":
    ss.$field.addClass("hide");
    micros.$field.addClass("hide");
    break;
  case "hhmmss":
    ss.set("init");
    ss.$field.removeClass("hide");
    micros.$field.addClass("hide");
    break;  
  case "hhmmssmicros":
    ss.set("init");
    micros.set("init");
    ss.$field.removeClass("hide");
    micros.$field.removeClass("hide");
    
    /* XXX kludge micros' look */
    fontSize = ss.$field.children(".arrow-up").css("fontSize");
    fontSize = parseInt(fontSize.slice(0, fontSize.length-2));
    marginTop = ss.$field.children("input").css("marginTop");
    marginTop = parseInt(marginTop.slice(0, marginTop.length-2));
    marginTop = (fontSize+marginTop) + "px";
    micros.$field.children("input").css("margin-top", marginTop);
    micros.$field.height( ss.$field.height() );
    microsOffset = micros.$field.offset();
    microsOffset.top = ss.$field.offset().top;
    micros.$field.offset(microsOffset);
    break;  
  }
  mode = m;
};
handleClickOk = function(){
  $dest.val(getVal());
  modal.set("close");
  return false;
};
init = function(that) {
  mode = "hhmm"; /* configures the spinners which are visible. Optional. */

  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-timepicker";
  }
  args.insertLabel = false;
  if (args.mode !== undefined) {
    if (Modes[args.mode] === true) {
      mode = args.mode;
    }
  }

  Component.call(that, args);

  hh = new Spinner({ fieldName:"hh", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:24, padding:"0" });
  mm = new Spinner({ fieldName:"mm", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:59, padding:"0" });
  ss = new Spinner({ fieldName:"ss", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:59, padding:"0" });
  micros = new Spinner({ fieldName:"micros", attrs:{ input:{ class:"numdigits-6", maxlength:"6"}}, min:0, max:999999, tailpadding:"000000" });
  micros.$field.children(".arrow-up, .arrow-down").addClass("hide");

  that.$field.append( 
    $("<div>", {class:"timepicker-container"}).append(
      hh.$field,
      mm.$field,
      ss.$field,
      micros.$field
    ),
    $("<div>", {class:"ok-container"}).append( $("<span>", {class:"ok"}).html("Ok") ).on("click", handleClickOk)
  );

  if (attrs !== undefined) {
    modalAttrs = attrs.modal;
  }
  modalId = getId("spruits-timepicker");
  modal = new Modal({ fieldName:"TimePicker", "$modalbody":that.$field, id:modalId, $container:$modalcontainer, attrs:modalAttrs, $pageboxes:$pageboxes, attrs:{span:{style:"z-index:10;"}} });

  setMode(mode);
};
init(this);
getVal = function(propName) {
  let val;

  switch (mode) {
  default:
  case "hhmm":
    val = hh.get() + ":" + mm.get();
    break;
  case "hhmmss":
    val = hh.get() + ":" + mm.get() + ":" + ss.get();
    break;  
  case "hhmmssmicros":
    val = hh.get() + ":" + mm.get() + ":" + ss.get() + "." + micros.get();
    break;  
  }
  return val;
};
setVal = function(propName, val) {
  switch(propName) {
  case "spinners":
    setMode(val);
    break;
  case "$dest":
    $dest = val;
    break;
  case "label":
    //this.$label.html(val);
    modal.set("$title", val);
    break;
  case "show":
    modal.set("show"); // $field.css("display", "block");
    // modal.$field.find(".modal-content").removeClass("modalout").addClass("modalin");
    break;
  }; // switch
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