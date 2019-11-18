InputTime = function(args) {
let
timepicker = args.timepicker,view = args.view,
mode,maxlength,maxH,name,dest,
handleClockClick,Dest,formatValue,init,
getVal,setVal,empty,validate;
handleClockClick = function() {
  timepicker.set("$dest", dest);
  timepicker.set("label", name);
  timepicker.set("show");
  timepicker.set("spinners", mode);
  return false;
};
Dest = function(args) {
  let $dest = args.$dest;
  
  this.val = function(str) {
    $dest.val(str);
    $dest.trigger("blur");
  };
};
formatValue = function(h, m, s, mic, timeValsLen) {
  let formattedValue;
  
  switch(timeValsLen) {
  case 2:
    formattedValue = h + ":" + m;
    break;
  case 3:
    formattedValue = h + ":" + m + ":" + s;
    break;
  case 4:
    formattedValue = h + ":" + m + ":" + s + "." + mic;
    break;
  default:
    break;
  }
  return formattedValue;
};
init = function(that) {
  mode = "hhmm"; /* configures the size (class) of the input field. Optional. */  
  maxlength = { "hhmm": "5", "hhmmss":"8", "hhmmssmicros":"15" };
  maxH = 23;

  if (args.mode !== undefined) {
    if (Modes[args.mode] === true) {
      mode = args.mode;
    }
  }

  if (args.maxH === 24) {
    maxH = args.maxH;
  }

  Component.call(that, args);
  name = that.name;

  if (view === undefined) {
    that.$field.append(
      $("<input>").addClass("spruits-inputtime-" + mode).attr("maxlength", maxlength[mode]).on("blur", e => that.handleBlur(e, that)),
      $("<i>", {class:"fa fa-clock-o"}).on("click", handleClockClick)
    );
  }
  dest = new Dest({ $dest:that.$field.children("input") });
};
init(this);
getVal = function(propName) {
  let val;

  switch (propName) {
  default:
    val = this.$field.children("input").val();
    break;
  case "empty":
    val = "";
    break;
  }

  return val;
};
setVal = function(propName, val) {
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
};
empty = function() {
  this.$field.children("input").val("");
};
validate = function() {
  let
  valid = { valid:true },
  value, formattedValue,
  x, h, m, s, mic, ssMicros, timeValsLen, timeVals;

  value = this.get("val");

  if (value.length === 0) { // the field is empty

  } else { // there is a value in the field
    timeVals = value.split(":");
    switch(mode) {
    case "hhmm":
      timeValsLen = 2;
      break;
    case "hhmmss":
      timeValsLen = 3;
      break;
    case "hhmmssmicros":
      if (timeVals.length === 3) {
        ssMicros = timeVals[2].split(".");
        if (ssMicros.length === 2) {
          timeVals[2] = ssMicros[0];
          timeVals.push(ssMicros[1]);
          timeValsLen = 4;
        } else {
          valid.valid = false;
        }
      } else {
        valid.valid = false;
      }
      break;
    default:
      valid.valid = false;
    } // switch (mode)

    if (valid.valid === false || timeValsLen !== timeVals.length) {
      valid.valid = false;
    } else {
      for (x of timeVals) {
        if (/\D/.test(x)) { // check for a non-digit character
          valid.valid = false;
          break;
        }
      } // for(x)
      
      h = parseInt(timeVals[0]);
      if (valid.valid === false || isNaN(h) || h < 0 || h > maxH) {
        valid.valid = false;
      } else { // valid hour
        h = ("00" + timeVals[0]).slice(-2);

        m = parseInt(timeVals[1]);
        if (isNaN(m) || m < 0 || m > 59) {
          valid.valid = false;
        } else { // valid min
          m = ("00" + timeVals[1]).slice(-2);

          if (timeValsLen > 2) { // validate s and micros
            s = parseInt(timeVals[2]);
            if (isNaN(s) || s < 0 || s > 59) {
              valid.valid = false;
            } else { // valid sec
              s = ("00" + timeVals[2]).slice(-2);

              if (timeValsLen > 3) { // validate micros
                mic = parseInt(timeVals[3]);
                if (isNaN(mic) || mic < 0 || mic > 59) {
                  valid.valid = false;
                } else { // valid micros
                  mic = (timeVals[3] + "000000").slice(0,6);
                }
              } // validate micros
            } // valid sec
          } // validate s and micros
        } // valid min
      } // valid hour
    }
  } // there is a value in the field

  if (valid.valid === false) {
    valid.invalid = value;
  } else {
    formattedValue = formatValue(h, m, s, mic, timeValsLen);
    if (formattedValue !== value) this.set("val", formattedValue);
  }

  return valid;
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
};