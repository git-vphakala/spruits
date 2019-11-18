//****************************************************************************************************************************************************************************
function init() {
  Component.call(this, args);
  name = this.name;

  if (view === undefined) {
    this.$field.append(
      $(INPUT).attr({"type":"text", "size":"10", maxlength:"10"}).on("blur", e => this.handleBlur(e, this)), 
      $(I, {class:"fa fa-calendar"}).on("click", handleCalClick)
    ).css("whiteSpace","noWrap");
  }
  dest = new Dest({ $dest:this.$field.children("input") });
}

//****************************************************************************************************************************************************************************
function Dest(args) {
  let $dest = args.$dest;
  
  this.val = function(str) {
    $dest.val(str);
    $dest.trigger("blur");
  };
};

//****************************************************************************************************************************************************************************
function handleCalClick(){
  if (cal.get("$field").hasClass("calendarSlideIn")) {
    return false;
  }
  cal.set("field name", name);
  cal.set("date", Date.now());
  cal.set("$dest", dest); // $(this).prev());
  cal.set("show");
  return false;
}

//****************************************************************************************************************************************************************************
function getVal(propName) {
  switch(propName){
  default:
    return this.$field.children("input").val();
  case "empty":
    return "";
  }
}; // getValue

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
  if (val === undefined) {
    this.$field.children("input").val(propName);
  }
  else {
    switch(propName) {
    case "val":
      this.$field.children("input").val(val);
      break;
    case "testcaseTemplate":
      template = val.template;
      templateProcessor = val.templateProcessor;     
      break;
    } // switch (propName)
  }
}; // setVal

//****************************************************************************************************************************************************************************
function empty() {
  this.$field.children("input").val("");
}; // empty

//****************************************************************************************************************************************************************************
function validate() {
  let 
  valid = { valid:true },
  value,
  y, m, d, dateVal, dateVals, formattedValue; // [ year, mon, day ] which is created from the value

  value = this.get("val");
  if (value.length === 0) { // the field is empty

  } else { // there is a value in the field
    dateVals = value.split("-");
    if (dateVals.length !== 3) {
      valid.valid = false;
    } else { // dateVals.length === 3
      dateVals[0] = dateVals[0].trim();                    // y
      dateVals[1] = ("00" + dateVals[1].trim()).slice(-2); // m
      dateVals[2] = ("00" + dateVals[2].trim()).slice(-2); // d

      dateVals.forEach( function(x) {
        if (/\D/.test(x)) { // check for a non-digit character
          valid.valid = false;
        }
      });
      y = parseInt(dateVals[0]);
      if (valid.valid === false || isNaN(y) || y < 1970 || y > 2100) {
        valid.valid = false;
      } else { // year valid
        m = parseInt(dateVals[1]);
        if (isNaN(m) || m < 1 || m > 12) {
          valid.valid = false;
        } else { // month valid
          d = parseInt(dateVals[2]);
          if (isNaN(d) || d < 1 || d > Month.daysInMonth(y, m-1)) {
            valid.valid = false;
          } else { // day valid
            dateVal = Date.parse(dateVals[0]+"-"+dateVals[1]+"-"+dateVals[2]+"T00:00:00Z");
            if (isNaN(dateVal)) {
              valid.valid = false;
            }
          } // day valid
        } // month valid
      } // year valid
    } // dateVals.length === 3
    
    if (valid.valid === true) {
      formattedValue = dateVals[0] + "-" + dateVals[1] + "-" + dateVals[2];
      if (formattedValue !== value) this.set("val", formattedValue);
    }
  } // there is a value in the field

  if (valid.valid === false) {
    valid.invalid = value;
  }

  return valid;
}; // validate

//****************************************************************************************************************************************************************************
exports.className = "InputDate";
exports.args =      [ "cal", "view" ];
exports.props =     [ "name", "dest" ];
exports.methods =   { "handleCalClick":handleCalClick, Dest:Dest, }
exports.init =      init;
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};
