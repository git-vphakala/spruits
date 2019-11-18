ui.component = (function(){
  "use strict";

let fixId, isArray, getArgs, setBgColor, InputCheckbox, InputText2, InputText, DigitString, decimaldigitstring, DecimalDigitString, AlphaNumericString,
  Select, Div, Tag, _Tag, Month, Calendar, calendar, InputDate, Clock, $clock, InputTime, InputDateAndTime, Table, TabSheet, fakeMessage, Message,
  fontSize, Row, View, Screen;

fixId = function(id) {
  // remove ' ', ':', '/' and '-', remove '(' and ')'
  return id.replace(/[ :/-]/g, "").replace(/\(|\)/g, "");
};
isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};
getArgs = function(args, out) {
  let attrs={}, key = false;

  if (args.attrs) {
    attrs = args.attrs;
  }

  if (args.fieldName) {
    out.fieldName = args.fieldName;
  }

  if (args.key) {
    key = args.key;
  }

  out.validateFunc = args.validateFunc;

  if (out.fieldName === undefined) {
    out.name = undefined;
  } else {
    out.name = fixId(out.fieldName),
    out.inputAttr["name"] = out.name;
    out.spanAttr["name"] = out.name;
  }

  if (attrs.span) {
    out.spanAttr.class = attrs.span.class;
  }

  if (attrs.input) {
    if (isArray(attrs.input)) {
      let attrsInputLen = attrs.input.length, i, inputAttr = out.inputAttr;

      out.inputAttr = [];
      for (i=0; i<attrsInputLen; i++) {
        out.inputAttr[i] = Object.assign({}, inputAttr, args.attrs.input[i]) ;
      }
      out.spanAttr.class += " spruit-multiline";
    } else {
      out.inputAttr = Object.assign(out.inputAttr, attrs.input);
    }
  } else if (args.size !== undefined) {
    out.inputAttr.size = args.size;
    out.inputAttr.maxlength = args.size;
  }

  if (key) {
    out.spanAttr.class += " spruit-key";
  }
};
setBgColor = function($field, valid, bgColor) {
  if (bgColor === undefined) {
    return false;
  }
  if (valid) {
    $field.css({ "backgroundColor": "" });
  } else {
    $field.css({ "backgroundColor": "#ffb6b6" });
  }
  return true;
};
InputCheckbox = (function() {
  let html, html2, val, validate;

  html = function(args /* { fieldName,attrs } */) {
    let inputAttr = { type:"checkbox" }, spanAttr = { class: "spruit-field" }, out = { inputAttr: inputAttr, spanAttr: spanAttr };

    getArgs(args, out);
    return Tag( "span", out.spanAttr, InputText.content(out.fieldName, out.name, out.inputAttr), false, val, undefined, validate)
  };

  html2 = function(args /* { fieldName,attrs } */) {
    let inputAttr = { type:"checkbox" }, spanAttr = { class: "spruit-field" }, out = { inputAttr: inputAttr, spanAttr: spanAttr }, cssOut=[], css=args.css;

    getArgs(args, out);

    if (css !== undefined) {
      if (css.span !== undefined) {
        if (out.spanAttr.class.slice(0, 12) == "spruit-field") {
          cssOut.push(".spruit-field[name=\"" + out.name + "\"] { " + css.span + " }");
        } else {
          cssOut.push(out.name + "\"] { " + css.span + " }");
        }
      }
      if (css.label !== undefined) {
        if (out.spanAttr.class.slice(0, 12) == "spruit-field") {
          cssOut.push(".spruit-field[name=\"" + out.name + "\"] > label {" + css.label + " }");
        } else {
          cssOut.push(out.name + "\"] > label {" + css.label + " }");
        }
      }
    }

    return { $field:Tag( "span", out.spanAttr, InputText.content(out.fieldName, out.name, out.inputAttr), false, val, undefined, validate), cssOut:cssOut };
  };

  val = function(event, val, fromServer) {
    let $field = $(this), $input = $field.children(":checkbox"), name = $field.attr("name");

    if (event.type === "spruit-val-get") {
      if (name !== undefined && name.length) {
        val[name] = $input.prop("checked");
      } else {
        val._val = $input.prop("checked");
      }
    } else {
      if (fromServer === true) {
        if (val.valid === true) {
          $input[0].checked = val.val;
        }
      } else {
        $input[0].checked = val;
      }
    }
    return false;
  };

  validate = function(event, conf, value) {
    let $field = $(this), bgColor = conf.bgColor;

    value.valid = true;
    setBgColor($field, value.valid, bgColor);
    return false;
  };

  return {
    html: html,
    html2: html2
  };
}());

InputText2 = (function() {
  let html, html2, getVal, setVal, val, content;

  html = function(args /* { fieldName,attrs, key } */) {
    let inputAttr = { type: "text" }, spanAttr = { class: "spruit-field" }, out = { inputAttr: inputAttr, spanAttr: spanAttr }, attrsInputLen, i;

    getArgs(args, out);

    return Tag( "span", out.spanAttr, content(out.fieldName, out.name, out.inputAttr), false, val, undefined, out.validateFunc);
  };

  html2 = function(args /* { fieldName,attrs, key } */) {
    let inputAttr = { type: "text" }, spanAttr = { class: "spruit-field" }, out = { inputAttr: inputAttr, spanAttr: spanAttr }, attrsInputLen, i, cssOut=[], css=args.css;

    getArgs(args, out);

    if (css !== undefined) {
      if (css.span !== undefined) {

        if (out.spanAttr.class.slice(0, 12) == "spruit-field") {
          cssOut.push(".spruit-field[name=\"" + out.name + "\"] { " + css.span + " }");
        } else {
          cssOut.push(out.name + "\"] { " + css.span + " }");
        }
      }
      if (css.label !== undefined) {
        if (out.spanAttr.class.slice(0, 12) == "spruit-field") {
          cssOut.push(".spruit-field[name=\"" + out.name + "\"] > label { " + css.label + " }");
        } else {
          cssOut.push(out.name + "\"] > label { " + css.label + " }");
        }
      }
      if (css.input !== undefined) {
        if (css.input.span !== undefined) {
          if (out.spanAttr.class.slice(0, 12) == "spruit-field") {
            cssOut.push(".spruit-field[name=\"" + out.name + "\"] > span { " + css.input.span + " }");
          } else {
            cssOut.push(out.name + "\"] > span { " + css.input.span + " }");
          }
        }
      }
    }

    return { $field:Tag( "span", out.spanAttr, content(out.fieldName, out.name, out.inputAttr), false, val, undefined, out.validateFunc), cssOut:cssOut };
  };
  
  getVal = function($field) {
    let $input;

    if ($field.hasClass("spruit-multiline") === true) {
      let value = "";

      $field.children("span").children("input").each( function() {
        value += $(this).val();
      });

      return value;

    } else {
      $input = $field.children("input");
      return $input.val();
    }
  };

  setVal = function($field, value) {
    let $input;

    if ($field.hasClass("spruit-multiline") === true) {
      let start=0, end, len = value.length;

      $field.children("span").children("input").each( function() {
        if (start < len) {
          end = start + $(this).attr("size");
          $(this).val(value.slice(start, end));
          start = end;
        }
      });
    } else {
      $input = $field.children("input");
      $input.val(value);
    }
  };

  val = function(event, val, fromServer) {
    let $field = $(this), name = $field.attr("name");

    if (event.type === "spruit-val-get") {
      if (name !== undefined && name.length && $field.hasClass("spruit-table-field") === false) {
        val[name] = getVal($field);
      } else {
        val._val = getVal($field);
      }
    } else {
      if (fromServer === true) {
        if (val.valid === true) {
          setVal($field, val.val);
        }
      } else {
        setVal($field, val);
      }
    }
    return false;
  };

  content = function(fieldName, name, inputAttr) {
    let tags = [], len, i;

    if (fieldName !== undefined) {
      tags.push(Tag( "label", { for: name, class: "field" }, [fieldName] ));
    }
    if (isArray(inputAttr)) {
      len = inputAttr.length;
      for (i=0; i<len; i++) {
        tags.push(Tag("span",{}, [ Tag( "input", inputAttr[i], [], true ) ]));
      }
    } else {
      tags.push(Tag( "input", inputAttr, [], true ));
    }
    return tags;
  };

  return {
    html: html,
    html2: html2,
    val: val,
    content: content
  };
}());

InputText = (function() {
  let html, html2, val, content;

  html = function(args /* { fieldName,attrs, key } */) {
    let inputAttr = { type: "text" }, spanAttr = { class: "spruit-field" }, out = { inputAttr: inputAttr, spanAttr: spanAttr };

    getArgs(args, out);
    return Tag( "span", out.spanAttr, content(out.fieldName, out.name, out.inputAttr), false, val, undefined, out.validateFunc);
  };

  html2 = function(args /* { fieldName,attrs, key } */) {
    let inputAttr = { type: "text" }, spanAttr = { class: "spruit-field" }, out = { inputAttr: inputAttr, spanAttr: spanAttr }, cssOut=[], css=args.css;

    getArgs(args, out);

    if (css !== undefined) {
      if (css.span !== undefined) {
        cssOut.push(out.name + "\"] " + css.span);
      }
      if (css.label !== undefined) {
        cssOut.push(out.name + "\"] > label " + css.label);
      }
    }

    return { $field:Tag( "span", out.spanAttr, content(out.fieldName, out.name, out.inputAttr), false, val, undefined, out.validateFunc), cssOut:cssOut };
  };

  val = function(event, val, fromServer) {
    let $field = $(this), $input = $field.children("input"), name = $field.attr("name");

    if (event.type === "spruit-val-get") {
      if (name !== undefined && name.length && $field.hasClass("spruit-table-field") === false) {
        val[name] = $input.val();
      } else {
        val._val = $input.val();
      }
    } else {
      if (fromServer === true) {
        if (val.valid === true) {
          $input.val(val.val);
        }
      } else {
        $input.val(val);
      }
    }
    return false;
  };

  content = function(fieldName, name, inputAttr) {
    let tags = [];

    if (fieldName !== undefined) {
      tags.push(Tag( "label", { for: name, class: "field" }, [fieldName] ));
    }
    tags.push(Tag( "input", inputAttr, [], true ));

    return tags;
  };

  return {
    html: html,
    html2: html2,
    val: val,
    content: content
  };
}());

DigitString = (function() {
  let html, html2, valid;

  html = function(args) {
    return InputText.html(Object.assign(args, { validateFunc: valid }));
  };

  html2 = function(args) {
    return InputText2.html2(Object.assign(args, { validateFunc: valid }));
  };

  valid = function(event, conf /* { emptyValid } */, value /* { val: "a digit string", valid: ToBeSet } */, matchRegExp) {
    let val, str = value.val.trim(), emptyValid = conf.emptyValid, bgColor = conf.bgColor, $field = $(this).children("input"), format = conf.format, regExp = /^[0-9]+$/;

    if (emptyValid === undefined) {
      emptyValid = false;
    }

    if (matchRegExp !== undefined) {
      regExp = matchRegExp;
    }

    if (str.length === 0 && emptyValid) {
      value.valid = true;
      value.val = str;
      setBgColor($field, value.valid, bgColor);
      return false;
    }

    val = String(str.match(regExp));

    if (val === "null") {
      value.valid = false;
      setBgColor($field, value.valid, bgColor);
      return false;
    }

    value.val = val;
    value.valid = true;
    setBgColor($field, value.valid, bgColor);
    if (format) {
      $field.trigger("spruit-val-set", [ value.val ]);
    }
    return false;
  };

  return {
    html: html,
    html2: html2,
    valid: valid
  };
}());

DecimalDigitString = (function(){
  let html, html2, DDStr;

  DDStr = function(args, maxLength /* {maxlength} */) {
    let html, validate, inputtextHtml2;

    html = function() {
      return this.$it;
    };

    validate = function() {
      var ddstrObj = this;

      ddstrObj.$it.off("spruit-val-set");
      ddstrObj.$it.on("spruit-val-set", function(event, val, fromServer) {
        let $field = $(this), $input = $field.children(":text"), decimalNumber = [], len, lenWithDecimals = 6, negative = false, sign="";

        if (fromServer === true) {
          if (val.valid === true) {
            len = val.val.length;

            if (val.val.charAt(0) === "-") {
              lenWithDecimals = 7;
              negative = true;
            }

            if (len < lenWithDecimals) {
              if (negative === true) {
                sign = "-";
              }
              decimalNumber[0] = sign + "0";
              decimalNumber[1] = ("00000" + val.val).slice(-5);
            } else {
              decimalNumber[0] = val.val.slice(0, len-5);
              decimalNumber[1] = val.val.slice(-5);
            }
            val = decimalNumber[0] + "." + decimalNumber[1];
          }
        }
        $input.val(val);
        return false;
      });

      ddstrObj.$it.on("spruit-validate", function(event, conf /* { emptyValid, convert } */, value /* { val, valid }*/) {
        let i, str = value.val.trim(), decimalNumber = str.split("."), emptyValid = conf.emptyValid, convert = conf.convert, $field = $(this).children("input"), bgColor = conf.bgColor,
          format = conf.format, formatStr = "", signChar = "", signNegative = false, signLen;

        if (decimalNumber.length > 2 || decimalNumber.length <= 0) {
          value.valid = false;
          setBgColor($field, value.valid, bgColor);
          return false;

        } else {
          for (i=0; i<decimalNumber.length; i++) {
            let dsValue = { val: decimalNumber[i], valid:true };
            DigitString.valid(event, { emptyValid: emptyValid }, dsValue, /^\-?[0-9]+$/);
            if (dsValue.valid === false) {
              value.valid = false;
              setBgColor($field, value.valid, bgColor);
              return false;
            }
          }

          if (decimalNumber.length === 1) {
            if (decimalNumber[0].length === 0) {
              if (emptyValid !== undefined && emptyValid === true) {
                decimalNumber[0] = "0";
              } else {
                value.valid = false;
                setBgColor($field, value.valid, bgColor);
                return false;
              }
            }

            decimalNumber[1] = "00000";
          }

          if (decimalNumber[0].charAt(0) === "-") {
            signNegative = true;
            signLen = 1;
          }
          if ((signNegative === true) && (parseInt(decimalNumber[0]) === 0) && (parseInt(decimalNumber[1]) > 0)) {
            signChar = "-";
          }

          decimalNumber[0] = "" + parseInt(decimalNumber[0]);

          if(ddstrObj.maxlength && decimalNumber[0].length > (ddstrObj.maxlength + signLen)) {
            value.valid = false;
            setBgColor($field, value.valid, bgColor);
            return false;
          }
          if((parseInt(decimalNumber[0]) > 90071992546) || (parseInt(decimalNumber[0]) < -90071992546)) {
            value.valid = false;
            setBgColor($field, value.valid, bgColor);
            return false;
          }

          if (decimalNumber[1].length > 5) {
            value.valid = false;
            setBgColor($field, value.valid, bgColor);
            return false;
          }

          decimalNumber[1] = (decimalNumber[1] + "00000").slice(0, 5);
          if (convert) {
            str = signChar + parseInt(decimalNumber[0] + decimalNumber[1]);
            formatStr = signChar + decimalNumber[0] + "." + decimalNumber[1];
          } else {
            str = signChar + decimalNumber[0] + "." + decimalNumber[1];
            formatStr = str;
          }

          value.valid = true;
          setBgColor($field, value.valid, bgColor);
          value.val = str;
          if (format) {
            $field.trigger("spruit-val-set", [ formatStr ]);
          }
          return false;
        }
      });
    };

    inputtextHtml2 = InputText.html2(args);
    this.$it = inputtextHtml2.$field;
    this.cssOut = inputtextHtml2.cssOut;
    this.maxlength = maxLength;
    this.html = html;
    this.validate = validate;
    this.validate();
  };

  html = function(htmlArgs, conf /* { maxlength } */) {
    let ddstr, maxlength = 11, defaultSize = 21;

    if (conf !== undefined) {
      if (conf.maxlength !== undefined) {
        maxlength = conf.maxlength;
      }
    }
    if (htmlArgs.attrs !== undefined) {
      if (htmlArgs.attrs.input !== undefined) {
        if (htmlArgs.attrs.input.size === undefined) {
          htmlArgs.attrs.input.size = defaultSize;
        }
        if (htmlArgs.attrs.input.maxlength === undefined) {
          htmlArgs.attrs.input.maxlength = defaultSize;
        }
      } else {
        htmlArgs.attrs.input = { size:defaultSize, maxlength:defaultSize };
      }
    } else {
      htmlArgs.attrs = { input:{ size:defaultSize, maxlength:defaultSize } };
    }

    ddstr = new DDStr(htmlArgs, maxlength);
    return ddstr.html();
  };

  html2 = function(htmlArgs, conf /* { maxlength } */) {
    let ddstr, maxlength = 11, defaultSize = 21;

    if (conf !== undefined) {
      if (conf.maxlength !== undefined) {
        maxlength = conf.maxlength;
      }
    }
    if (htmlArgs.attrs !== undefined) {
      if (htmlArgs.attrs.input !== undefined) {
        if (htmlArgs.attrs.input.size === undefined) {
          htmlArgs.attrs.input.size = defaultSize;
        }
        if (htmlArgs.attrs.input.maxlength === undefined) {
          htmlArgs.attrs.input.maxlength = defaultSize;
        }
      } else {
        htmlArgs.attrs.input = { size:defaultSize, maxlength:defaultSize };
      }
    } else {
      htmlArgs.attrs = { input:{ size:defaultSize, maxlength:defaultSize } };
    }

    ddstr = new DDStr(htmlArgs, maxlength);
    return { $field:ddstr.html(), cssOut:ddstr.cssOut };
  };

  return {
    html: html,
    html2: html2
  };
}());

AlphaNumericString = (function(){

  let html, html2, alphanumericstring;

  html = function(args) {
    let anstr = new alphanumericstring(args);
    return anstr.html();
  };

  html2 = function(args) {
    let anstr = new alphanumericstring(args);
    return { $field:anstr.html(), cssOut:anstr.cssOut };
  };

  alphanumericstring = function(args) {
    let html, $content, events, matchRegexp = args.matchRegexp, inputtext2Html2;

    html = function() {
      return this.$content;
    };

    events = function() {
      let alphaNumericString = this;

      alphaNumericString.valid = function(event, conf, value) {
        let str = value.val.trim(), emptyValid = conf.emptyValid, bgColor = conf.bgColor, format = conf.format,
          $field = alphaNumericString.$content, $bgColor = $field.children("input");

        if ($field.hasClass("spruit-multiline")) {
          $bgColor = $field.children("span").children("input");
        }

        if (str.length === 0) {
          if (emptyValid === true) {
            value.valid = true;
            setBgColor($bgColor, value.valid, bgColor);
            return false;
          } else {
            value.valid = false;
            setBgColor($bgColor, value.valid, bgColor);
            return false;
          }
        }

        if(str.match(alphaNumericString.matchRegexp)) {
          value.val = str;
          value.valid = true;
          if (format) {
            $field.trigger("spruit-val-set", [ value.val ]);
          }
        } else {
          value.valid = false;
        }
        setBgColor($bgColor, value.valid, bgColor);

        return false;
      };

      this.$content.on("spruit-validate", alphaNumericString.valid);
    }; // events

    inputtext2Html2 = InputText2.html2(args); // { $field:, cssOut: }

    $content =    inputtext2Html2.$field;
    this.cssOut = inputtext2Html2.cssOut;

    if (matchRegexp === undefined) {
      matchRegexp = /^[0-9a-zA-Z]+$/;
    }

    this.html = html;
    this.$content = $content;
    this.matchRegexp = matchRegexp;
    this.events = events;
    this.events();
  };

  return {
    html: html,
    html2: html2
  };
}());

Select = (function() {
  let html, val, content, validate;

  html = function(args /* { fieldName, attrs, optionsList } */) {
    let optionsList = args.options, name, spanAttr = { class: "spruit-field" },
      fieldName = undefined, attrs = {};

    if (args.attrs) {
      attrs = args.attrs;
    }

    if (args.fieldName) {
      fieldName = args.fieldName;
    }

    if (fieldName === undefined) {
      name = undefined;
    } else {
      name = fixId(fieldName),
      spanAttr["name"] = name;
    }

    if (attrs.span) {
      spanAttr.class = attrs.span.class;
    }
    if (args.key === true) {
      spanAttr.class += " spruit-key";
    }

    return Tag( "span", spanAttr, content(fieldName, name, optionsList), false, val, undefined, validate);
  };

  val = function(event, val, fromServer) {
    let $field = $(this), $select = $field.children("select"), name = $field.attr("name");

    if (event.type === "spruit-val-get") {
      if (name !== undefined && name.length && $field.hasClass("spruit-table-field") === false) {
        val[name] = $select.val();
      } else {
        val._val = $select.val();
      }
    } else {
      if (fromServer === true) {
        if (val.valid === true) {
          val = val.val;
        }
      }
      $select.val(val);
    }
    return false;
  };

  content = function(fieldName, name, optionsList) {
    let tags = [], options;

    options = function(optionsList) {
      let optionsListLen = optionsList.length, optionTags = [];

      for (let i=0; i<optionsListLen; i++) {
        optionTags.push( Tag("option", { value: optionsList[i] }, [ optionsList[i] ]) );
      }
      return optionTags;
    };

    if (fieldName !== undefined) {
      tags.push(Tag( "label", { for: name, class: "field" }, [fieldName] ));
    }
    tags.push(Tag( "select", { class: "field"}, options(optionsList)));

    return tags;
  };

  validate = function(event, conf, value) {
    let $field = $(this), bgColor = conf.bgColor;

    value.valid = true;
    setBgColor($field, value.valid, bgColor);
    return false;
  };

  return {
    html: html
  };
}());

Div = function(args, content) {
	let d = $("<div></div>").attr(args);

	if (content !== undefined) {
		d.append(content);
	}
	return d;
};

Tag = function(tag, attrs, contents, isEmpty, valFunc, clickFunc, validateFunc) {
  let $tag, contentsLen;

  if (contents === undefined) {
    console.log("Tag(): " + JSON.stringify(attrs));
  } else {
    contentsLen = contents.length;
  }

  if (isEmpty === true) {
      $tag = $("<" + tag + ">").attr(attrs);
  } else {
      $tag = $("<" + tag + "></" + tag + ">").attr(attrs);
  }
  for (let i=0; i<contentsLen; i++) {
      $tag.append(contents[i]);
  }
  if (valFunc !== undefined) {
    $tag.on("spruit-val-set", valFunc);
    $tag.on("spruit-val-get", valFunc);
  }
  if (clickFunc !== undefined) {
    $tag.on("click", clickFunc);
  }
  if (validateFunc !== undefined) {
    $tag.on("spruit-validate", validateFunc);
  }
  return $tag;
};

_Tag = (function() {
  let html, val, content, validate;

  html = function(args) {
    return Tag(args.tag, args.attrs, args.contents, args.isEmpty, args.valFunc, args.clickFunc, args.validateFunc);
  };

  return {
    html:html
  };
}());

Month = {
  monInt: {
    "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5, "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
  },

  getMonStr: function(mon) {
    let monStr = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    return monStr[mon];
  },
  daysInMonth: function(year, mon) {
    let leapYear = 0;

    switch (mon) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      return 31;
    case 1:
      if ((year % 100) === 0) {
        if ((year % 400) === 0) {
          leapYear = 1;
        }
      } else {
        if ((year % 4) === 0) {
          leapYear = 1;
        }
      }
      return 28 + leapYear;
    default:
      return 30;
    }
  },
  getDaysInMonth: function(date) {
    return Month.daysInMonth(date.getFullYear(), date.getMonth());
  },

  str2int: function(monStr) {
    return Month.monInt[monStr];
  }
};

Calendar = (function() {
  let html, calendar;

  html = function($dest) {
    let cal = new calendar({$dest:$dest});
    return cal;
  };

  calendar = function(args) {
    let html, content, events, $dest = args.$dest, $content, $weeks=[];

    html = function() {
      return this.$content;
    };

    content = function() {
      let trs=[], week;

      week = function() {
        return Tag("tr",{class:"spruit-calendar-week"},[
	  Tag("td",{class:"spruit-calendar-mon-day"}, [ "&nbsp;" ]),
	  Tag("td",{class:"spruit-calendar-mon-day"}, [  ]),
	  Tag("td",{class:"spruit-calendar-mon-day"}, [  ]),
	  Tag("td",{class:"spruit-calendar-mon-day"}, [  ]),
	  Tag("td",{class:"spruit-calendar-mon-day"}, [  ]),
	  Tag("td",{class:"spruit-calendar-mon-day"}, [  ]),
	  Tag("td",{class:"spruit-calendar-mon-day"}, [  ])
	]);
      };

      trs.push(
        Tag("tr",{class:"spruit-calendar-header"},[
	  Tag("td",{class:"spruit-calendar-header-dec"},["<"]),
	  Tag("td",{class:"spruit-calendar-header-ym",colspan:"5"},[ ]),
	  Tag("td",{class:"spruit-calendar-header-inc"},[">"])]),
	Tag("tr",{class:"spruit-calendar-weekdays"},[
	  Tag("td",{class:"spruit-calendar-wday"}, [ "Mon" ]),
	  Tag("td",{class:"spruit-calendar-wday"}, [ "Tue" ]),
	  Tag("td",{class:"spruit-calendar-wday"}, [ "Wed" ]),
	  Tag("td",{class:"spruit-calendar-wday"}, [ "Thu" ]),
	  Tag("td",{class:"spruit-calendar-wday"}, [ "Fri" ]),
	  Tag("td",{class:"spruit-calendar-wday"}, [ "Sat" ]),
	  Tag("td",{class:"spruit-calendar-wday"}, [ "Sun" ])
	]),
        week(), week(), week(), week(), week(), week()
      );
      return trs;
    };

    events = function() {
      let calObj = this;

      calObj.clickDay = function() {
        let day = $(this).html(), date = new Date(calObj.timestamp);

        date.setDate(day);
        calObj.timestamp = date.getTime();
        calObj.$dest.trigger("spruit-val-set", [ { year: "" + date.getFullYear(), mon: (("00" + (date.getMonth() + 1)).slice(-2)), day: (("00" + date.getDate()).slice(-2)) } ]);
        calObj.$content.css({"display":""});

        return false;
      };

      calObj.$content.on("spruit-val-set", function(event, val) {
        if (val !== undefined) {
          if (event.type === "spruit-val-set") {
            let srcdate, mon, year, r, day = 1, dayOfWeek, daysInMonth, row, $day;

            calObj.timestamp = val;
            srcdate = new Date(calObj.timestamp);
            mon = Month.getMonStr(srcdate.getMonth()),
            year = srcdate.getFullYear();
            daysInMonth = Month.getDaysInMonth(srcdate),

            calObj.$ym.html(mon + " " + year);

            calObj.$weeks.forEach( function($week) {
              $week.forEach( function($day) {
                $day
                 .empty()
                 .css("cursor", "")
                 .off("click");
              });
            });
            for (r = 0; r < 6 && day <= daysInMonth; day++) {
              row = calObj.$weeks[r];
              srcdate.setDate(day);

              dayOfWeek = srcdate.getDay();
              switch (dayOfWeek) {

              case 0: // su
                $day = row[6];
                $day
                  .html(day)
                  .css("cursor", "pointer")
                  .on("click", calObj.clickDay);
                r++;
                break;

              default:
                $day = row[(dayOfWeek-1)];
                $day
                  .html(day)
                  .css("cursor", "pointer")
                  .on("click", calObj.clickDay);
                break;
              }
            }
          } // if (event.type)
        }
        return false;
      });

      calObj.$dec.on("click", function() {
        let $calendar = calObj.$content, date = new Date(calObj.timestamp);

        if (date.getMonth() > 0) {
          date.setDate(1);
          date.setMonth(date.getMonth() - 1);
        } else {
         date.setDate(1);
         date.setMonth(11);
         date.setFullYear(date.getFullYear() - 1);
        }

        $calendar.trigger("spruit-val-set", [ date.getTime() ]);
        return false;
      });

      calObj.$inc.on("click", function() {
        let $calendar = calObj.$content, date = new Date(calObj.timestamp);

        if (date.getMonth() < 11) {
          date.setDate(1);
          date.setMonth(date.getMonth() + 1);
        } else {
          date.setDate(1);
          date.setMonth(0);
          date.setFullYear(date.getFullYear() + 1);
        }

        $calendar.trigger("spruit-val-set", [ date.getTime() ]);
        return false;
      });

    };

    $content = Tag("table", { class:"spruit-calendar" }, content());

    $content.find(".spruit-calendar-week").each( function() {
      let $week = $(this), $weekDays = [] ;

      $week.find(".spruit-calendar-mon-day").each( function() {
        let $day = $(this);

        $weekDays.push($day);
      });
      $weeks.push($weekDays);
    });

    this.timestamp = 0;
    this.$dest = $dest;
    this.$content = $content;
    this.$ym = $content.find(".spruit-calendar-header-ym");
    this.$dec = $content.find(".spruit-calendar-header-dec");
    this.$inc = $content.find(".spruit-calendar-header-inc");
    this.$weeks = $weeks;
    this.html = html;
    this.events = events;
    this.events();
  };

  return {
    html: html,
    calendar: calendar
  };
}());


InputDate = (function() {
  let html, val, content, toggleCalendar, validate;

  html = function(args /* { fieldName } */) {
    let fieldName = args.fieldName, spanAttr = { class: "spruit-field spruit-inputdate" }, $inputdate;

    if (fieldName !== undefined) {
      spanAttr["name"] = fieldName;
    }
    if (args.attrs) {
      if (args.attrs.span) {
        if (args.attrs.span.class) {
          spanAttr.class = args.attrs.span.class;
        }
        if (args.attrs.span.name) {
          spanAttr.name = args.attrs.span.name;
        }
      }
    }
    $inputdate = Tag("span", spanAttr, [], false, val, undefined, validate);
    content(fieldName, $inputdate);

    return $inputdate;
  };

  val = function(event, val, fromServer) {
    let $field = $(this), $year = $field.children(".spruit-inputdate-year"), $mon = $field.children(".spruit-inputdate-mon"), $day = $field.children(".spruit-inputdate-day"),
      name = $field.attr("name"), date;

    if (event.type === "spruit-val-set") {
      if (val !== undefined) {
        if (fromServer === true) {
          if (val.valid === true) {
            if (val.val === -1) {
              val = { year: "", mon:"", day:"" };
            } else {
              date = new Date(val.val);
              val = { year: date.getFullYear(), mon: ("00" + (date.getMonth() + 1)).slice(-2), day: ("00" + date.getDate()).slice(-2) };
            }
          }
        }
        $year.val(val.year);
        $mon.val(val.mon);
        $day.val(val.day);
      }
    } else {
      if (name !== undefined && name.length) {
        val[name] = {};
        val[name].year = $year.val();
        val[name].mon = $mon.val();
        val[name].day = $day.val();
      } else {
        val._val = {};
        val._val.year = $year.val();
        val._val.mon = $mon.val();
        val._val.day = $day.val();
      }
    }
    return false;
  };

  content = function(fieldName, $inputdate) {
    if (fieldName !== undefined) {
      $inputdate.append(Tag("label", { class: "field" }, [ fieldName ]));
    }

    $inputdate.append(
      Tag("input", { class: "spruit-inputdate-year", maxlength: 4 }, [], true),
      Tag("span", { class: "spruit-inputdate-betweenyymm" }, [ " / " ]),              // was: " / ",
      Tag("input", { class: "spruit-inputdate-mon", maxlength: 2 }, [], true),
      " / ",
      Tag("input", { class: "spruit-inputdate-day", maxlength: 2 }, [], true),
      Tag("span", { class: "spruit-inputdate-separator" }, []),
      Tag("i", { class: "fa fa-calendar", "aria-hidden": true }, [], false, undefined, toggleCalendar )
    );
  };

  toggleCalendar = function() {
    let $cal = calendar.html(), offset = $(this).offset(), borderBottomWidth;

    calendar.$dest = $(this).parent();

    if ($cal.css("display") !== "table") {
      $cal.trigger("spruit-val-set", [ Date.now() ]);

      borderBottomWidth = $(this).parent().find(".spruit-inputdate-year").css("border-bottom-width");
      borderBottomWidth = parseInt(borderBottomWidth.slice(0, borderBottomWidth.length-2));
      offset.top = offset.top + ui.component.fontSize + borderBottomWidth;
    }

    $cal.toggle();
    $cal.offset( /*$(this).*/ offset);

    // console.log("offset:" + JSON.stringify($(this).offset()) + ", fontSize=" + ui.component.fontSize);
    // console.log("border-bottom-width=" + borderBottomWidth);

    return false;
  };

  validate = function(event, conf, value) {
    let dateVals=[], dateValsValid = true, dateVal, ymd = value.val, emptyValid = conf.emptyValid, convert = conf.convert, $field = $(this).children("input"), bgColor = conf.bgColor,
      format = conf.format, formatVal;

    if (ymd.year.length === 0 && ymd.mon.length === 0 && ymd.day.length === 0) {
      if (emptyValid === undefined || emptyValid === false) {
        value.valid = false;
        setBgColor($field, value.valid, bgColor);
        return false;
      } else {
        if (convert !== undefined && convert === true) {
          value.valid = true;
          value.val = -1;
          setBgColor($field, value.valid, bgColor);
          return false;
        }
        else {
          value.valid = true;
          setBgColor($field, value.valid, bgColor);
          return false;
        }
      }
    }

    dateVals[0] = ymd.year.trim();
    dateVals[1] = ("00" + ymd.mon.trim()).slice(-2);
    dateVals[2] = ("00" + ymd.day.trim()).slice(-2);

    dateVals.forEach( function(val) {
      let dsValue = { val: val };

      DigitString.valid({},{}, dsValue);

      if (dsValue.valid === false) {
        dateValsValid = false;
        return false;
      }
    });

    if (dateValsValid === false || dateVals[0] < 1970 || dateVals[0] > 2100) {
      value.valid = false;
      setBgColor($field, value.valid, bgColor);
      return false;
    }

    if (dateVals[2] > ui.component.Month.daysInMonth(dateVals[0], dateVals[1]-1)) {
      value.valid = false;
      setBgColor($field, value.valid, bgColor);
      return false;
    }
    dateVal = Date.parse(dateVals[0]+"-"+dateVals[1]+"-"+dateVals[2]+"T00:00:00Z");
    if (isNaN(dateVal)) {
      value.valid = false;
      setBgColor($field, value.valid, bgColor);
      return false;
    }

    value.valid = true;
    setBgColor($field, value.valid, bgColor);
    if (convert !== undefined && convert === true) {
      formatVal = { year: dateVals[0], mon: dateVals[1], day: dateVals[2] };
      value.val = dateVal;
    } else {
      value.val = { year: dateVals[0], mon: dateVals[1], day: dateVals[2] };
      formatVal = value.val;
    }
    if (format) {
      $field.trigger("spruit-val-set", [ formatVal ]);
    }
    return false;
  };

  return {
    html: html,
    val: val,
    content: content,
    validate: validate
  };
}());

Clock = (function() {
  let html, isVisible, clockfaceNum, clockfaceNumVal, clockfaceNumClick, setSix, clickAM, clickPM, clickHH, clickMM, clickSS, clickFace;

  clockfaceNum = {
    "spruit-clockface-td0008": 0,
    "spruit-clockface-td0104": 11,
    "spruit-clockface-td0112": 1,
    "spruit-clockface-td0401": 10,
    "spruit-clockface-td0415": 2,
    "spruit-clockface-td1608": 6,
    "spruit-clockface-td0800": 9,
    "spruit-clockface-td0816": 3,
    "spruit-clockface-td1201": 8,
    "spruit-clockface-td1215": 4,
    "spruit-clockface-td1504": 7,
    "spruit-clockface-td1512": 5
  };

  clockfaceNumVal = function(event, val) {
    let clist = $(this).prop("classList");
    val.num = Clock.clockfaceNum[ clist[1] ];
    return false;
  };

  html = function(parentClass, sec) {
    let
      doSec = function(sec) {
        if (sec !== true) {
          return "";
        }
        return Tag("span", { class: "spruit-clock-ss spruit-x2" }, [ "ss" ], false, undefined, Clock.clickSS);
      },

      face = function() {
        let rows = [],

          doCols = function(rowNum) {
            let cols = [], clockfaceClass, clockfaceNumVal, clockfaceNumClick, clockfaceNum;

            for (let i=0; i<17; i++) {
              clockfaceClass = "spruit-clockface-td" + ("00" + rowNum).slice(-2) + ("00" + i).slice(-2);
              clockfaceNum = Clock.clockfaceNum[clockfaceClass];
              if (Clock.clockfaceNum[clockfaceClass] >= 0) {
                clockfaceNumVal = Clock.clockfaceNumVal;
                clockfaceNumClick = Clock.clockfaceNumClick;
              } else {
                clockfaceNumVal = undefined
                clockfaceNumClick = undefined;
              }
              clockfaceClass = "spruit-clockface " + clockfaceClass;
              cols.push(Tag("td", { class: clockfaceClass }, [], false, clockfaceNumVal, clockfaceNumClick));
            }
            return cols;
          };

        for (let i=0; i<17; i++) {
          rows.push(Tag("tr", { class: "spruit-clockface-tr" + ("00" + i).slice(-2) }, [ doCols(i) ]));
        }
        return rows;
      },
      spanArgs = { class: "spruit-clock" };

    if (parentClass !== undefined) {
      spanArgs["spruit-parent-class"] = parentClass;
    }

    return Tag("span", spanArgs, [
      Tag("table", { class: "spruit-clock-table" }, [
        Tag("tbody", {}, face())
      ]),
      Tag("i", { class: "spruit-clock-am fa fa-moon-o fa-2x", "aria-hidden": true }, [], false, undefined, Clock.clickAM),
      Tag("i", { class: "spruit-clock-pm fa fa-sun-o", "aria-hidden": true }, [], false, undefined, Clock.clickPM),
      Tag("span", { class: "spruit-clock-hh spruit-2x" }, [ "hh" ], false, undefined, Clock.clickHH),
      Tag("span", { class: "spruit-clock-dc spruit-2x" }, [ ":" ]),
      Tag("span", { class: "spruit-clock-mm spruit-x2" }, [ "mm" ], false, undefined, Clock.clickMM),
      doSec(true /* sec */),
      Tag("span", { class: "spruit-clock-atsix" }, [ "06" ])
    ], false, undefined, Clock.clickFace);
  };

  isVisible = function($clock) { return $clock.css("display") === "block" ? true : false; };

  clockfaceNumClick = function(event) {
    let num = {}, val = {}, /*$clock = $(this).parent().parent().parent().parent(),*/ parentClass = $clock.attr("spruit-parent-class"), $parent,
      $hh = $clock.children(".spruit-clock-hh"), isHour = $hh.hasClass("spruit-2x"), 
      $mm = $clock.children(".spruit-clock-mm"), isMin = $mm.hasClass("spruit-2x"), 
      $ss = $clock.children(".spruit-clock-ss"), 
      $pm = $clock.children(".spruit-clock-pm"), isPM = $pm.hasClass("fa-2x");

    $(this).trigger("spruit-val-get", [ num ]);

    if (isHour) {
      val.hour = num.num
      if (isPM) {
        val.hour += 12;
      }
      val.hour = ("00" + val.hour).slice(-2);
      $mm.trigger("click");
    } else if (isMin) {
      val.min = num.num * 5;
      val.min = ("00" + val.min).slice(-2);

      if ($ss !== undefined) {
        $ss.trigger("click");
      }
    } else {
      val.sec = num.num * 5;
      val.sec = ("00" + val.sec).slice(-2);
    }

    if (parentClass.length) {
      $parent = Clock.$parent; //$clock.parent().parent();
      $parent.trigger("spruit-val-set", [ val ]);
    }
    return false;
  };

  setSix = function($atsix, isHH, isPM) {
    let atSix = "06";

    if (isHH) {
      if (isPM) {
        atSix = "18"
      }
      $atsix.html(atSix);
    } else {
      $atsix.html("30");
    }
  };

  clickAM = function() {
    let $am = $(this), $pm = $am.siblings(".spruit-clock-pm").first(), $hh = $am.siblings(".spruit-clock-hh").first(), $atsix = $am.siblings(".spruit-clock-atsix").first();

    $pm.removeClass("fa-2x");
    $am.addClass("fa-2x");
    Clock.setSix($atsix, $hh.hasClass("spruit-2x"), $pm.hasClass("fa-2x"));
    return false;
  };

  clickPM = function() {
    let $pm = $(this), $am = $pm.siblings(".spruit-clock-am").first(), $hh = $pm.siblings(".spruit-clock-hh").first(), $atsix = $pm.siblings(".spruit-clock-atsix").first();

    $am.removeClass("fa-2x");
    $pm.addClass("fa-2x");
    Clock.setSix($atsix, $hh.hasClass("spruit-2x"), $pm.hasClass("fa-2x"));
    return false;
  };

  clickHH = function() {
    let $hh = $(this), $mm = $hh.siblings(".spruit-clock-mm").first(), $atsix = $hh.siblings(".spruit-clock-atsix").first(), $pm = $hh.siblings(".spruit-clock-pm").first(), 
      isPM = $pm.hasClass("fa-2x"), atsix="06", $ss = $hh.siblings(".spruit-clock-ss").first();

    $ss
      .removeClass("spruit-2x")
      .addClass("spruit-x2");
    $mm
      .removeClass("spruit-2x")
      .addClass("spruit-x2");
    $hh
      .removeClass("spruit-x2")
      .addClass("spruit-2x");

    if (isPM) {
      atsix = "18";
    }
    $atsix.html(atsix);
    return false;
  };

  clickMM = function() {
    let $mm = $(this), $hh = $mm.siblings(".spruit-clock-hh").first(), $atsix = $mm.siblings(".spruit-clock-atsix").first(), $ss = $mm.siblings(".spruit-clock-ss").first();

    $mm
      .removeClass("spruit-x2")
      .addClass("spruit-2x");
    $hh
      .removeClass("spruit-2x")
      .addClass("spruit-x2");
    $ss
      .removeClass("spruit-2x")
      .addClass("spruit-x2");

    $atsix.html("30");
    return false;
  };

  clickSS = function() {
    let $ss = $(this), $hh = $ss.siblings(".spruit-clock-hh").first(), $mm = $ss.siblings(".spruit-clock-mm").first(), $atsix = $ss.siblings(".spruit-clock-atsix").first();

    $ss
      .removeClass("spruit-x2")
      .addClass("spruit-2x");
    $mm
      .removeClass("spruit-2x")
      .addClass("spruit-x2");
    $hh
      .removeClass("spruit-2x")
      .addClass("spruit-x2");

    $atsix.html("30");
    return false;
  };

  clickFace = function() { return false; };

  return {
    clockfaceNum: clockfaceNum,
    isVisible: isVisible,
    html: html,

    $parent:undefined,

    clockfaceNumVal: clockfaceNumVal,
    clockfaceNumClick: clockfaceNumClick,
    setSix: setSix,
    clickAM: clickAM,
    clickPM: clickPM,
    clickHH: clickHH,
    clickMM: clickMM,
    clickSS: clickSS,
    clickFace: clickFace
  };
}());

InputTime = (function() {
  let inputtime, html, content;

  inputtime = function(args) {
    let html, val, content/*, toggleClock*/, validate, events;

    html = function(args) {
      let fieldName = args.fieldName, spanAttr = { class: "spruit-field spruit-inputtime" }, sec, microSec;

      if (fieldName !== undefined) {
        spanAttr["name"] = fieldName;
      }
      if (args.attrs) {
        if (args.attrs.span) {
          if (args.attrs.span.class) {
            spanAttr.class = args.attrs.span.class;
          }
        }
      }
      sec = args.sec;
      microSec = args.microSec;

      return Tag("span", spanAttr, content(fieldName, sec, microSec), false, val, undefined, validate);
    };

  val = function(event, num, fromServer) {
    let $field = $(this), $hour = $field.children(".spruit-inputtime-hour"), $min = $field.children(".spruit-inputtime-min"), $sec = $field.children(".spruit-inputtime-sec"),
      $microSec = $field.children(".spruit-inputtime-microsec"), /* $clock = $field.children(".fa-clock-o").children(".spruit-clock"),*/ name = $field.attr("name"), hour, min, sec, isSec=false, 
      isMicrosec=false;

    if ($sec.length) {
      isSec = true;

      if ($microSec.length) {
        isMicrosec = true;
      }
    }

    if (event.type === "spruit-val-set") {
      if(num !== undefined) {
        if (fromServer === true) {
          if (num.valid === true) {
            if (num.val === -1) {
              num = { hour:"", min:"", sec:"" };
            } else {
              hour = ("00" + Math.floor(num.val/3600)).slice(-2);
              min = ("00" + Math.floor((num.val % 3600)/60)).slice(-2);
              num = { hour:hour, min:min };
              if (isSec) {
                sec = num.val - (hour * 3600 + min * 60);
              }
            }
          }
        }
        if (num.hour !== undefined) {
          $hour.val(num.hour);
        }
        if (num.min !== undefined) {
          $min.val(num.min);
        }

        if (num.sec !== undefined) {
          if (isSec) {
            $sec.val(num.sec);
          }

          if (num.microSec !== undefined) {
            if (isMicrosec) {
              $microSec.val(num.microSec);
            }
          }
        }

        if (Clock.isVisible($clock) && $hour.val().length && $min.val().length && (isSec === false || $sec.val().length)) {
          $clock.css("display", "");
        }
      }
    } else {
      if (num !== undefined) {
        if (name !== undefined && name.length) {
          num[name] = {};
          num[name].hour = $hour.val();
          num[name].min = $min.val();
          if (isSec) {
            num[name].sec = $sec.val();

            if (isMicrosec) {
              num[name].microSec = $microSec.val();
            }
          }
        } else {
          num._val = {};
          num._val.hour = $hour.val();
          num._val.min = $min.val();
          if (isSec) {
            num._val.sec = $sec.val();

            if (isMicrosec) {
              num._val.microSec = $microSec.val();
            }
          }
        }
      }
    }
    return false;
  };  // val

  content = function(fieldName, sec, microSec) {
    let inputtime = [];

    if (fieldName !== undefined) {
      inputtime.push(Tag("label", { class: "field" }, [ fieldName ]));
    }
    inputtime.push(
      Tag("input", { class: "spruit-inputtime-hour", maxlength: 2 }, [], true),
      " : ",
      Tag("input", { class: "spruit-inputtime-min", maxlength: 2 }, [], true)
    );
    if (sec === true) {
      inputtime.push(
        " : ",
        Tag("input", { class: "spruit-inputtime-sec", maxlength: 2 }, [], true)
      );

      if (microSec === true) {
        inputtime.push(
          " . ",
          Tag("input", { class: "spruit-inputtime-microsec", maxlength: 6 }, [], true)
        );
      }
    }
    inputtime.push(
      Tag("span", { class: "spruit-inputtime-separator" }, []),
      Tag("i", { class: "fa fa-clock-o", "aria-hidden": true }, [
        /* Clock.html("spruit-inputtime", sec, microSec) */
      ], false, undefined/*, toggleClock*/)
    );
    return inputtime;
  };

/*  toggleClock = function(event) {
    let $clock = $(this).children(".spruit-clock");

    if (Clock.isVisible($clock)) {
      $clock.css("display", "");
    } else {
      $clock.css("display", "block");
    }
  };
*/

  validate = function(event, conf, value) {
    let timeVals = [], i, sec="00", hm = value.val, emptyValid = conf.emptyValid, maxH = conf.maxH, convert = conf.convert, $field = $(this).children("input"), bgColor = conf.bgColor,
      format = conf.format, formatVal, secDefined = false, microsecDefined = false;

    hm.hour = hm.hour.trim();
    hm.min = hm.min.trim();
    if (hm.sec !== undefined) {
      hm.sec = hm.sec.trim();
      secDefined = true;
      timeVals[2] = hm.sec;

      if (hm.microSec !== undefined) {
        hm.microSec = hm.microSec.trim();
        microsecDefined = true;
        timeVals[3] = hm.microSec;
      }
    }

    if ("" === hm.hour) {
      if ("" === hm.min) {
        if (secDefined === true) {
          if ("" !== hm.sec) {
            value.valid = false;
            setBgColor($field, value.valid, bgColor);
            return false;
          }

          if (microsecDefined === true) {
            if ("" !== hm.microSec) {
              value.valid = false;
              setBgColor($field, value.valid, bgColor);
              return false;
            }
          }
        }
        if (emptyValid === undefined || emptyValid === false) {
          value.valid = false;
        } else {
          value.valid = true;
          if (convert !== undefined && convert === true) {
            value.val = -1;
          }
        }
      } else {
        value.valid = false;
      }
      setBgColor($field, value.valid, bgColor);
      return false;
    } else {
      if (hm.min === "") {
        value.valid = false;
        setBgColor($field, value.valid, bgColor);
        return false;
      }
    }

    timeVals[0] = hm.hour;
    timeVals[1] = hm.min;

    for (i=0; i<timeVals.length; i++) {
      let dsValue = { val: timeVals[i] };

      DigitString.valid({},{}, dsValue);

      if (dsValue.valid === false) {
        value.valid = false;
        setBgColor($field, value.valid, bgColor);
        return false;
      }
      switch (i) {
      case 0:
        if (maxH === undefined) {
          maxH = 24;
        }
        if (timeVals[i] < 0 || timeVals[i] > maxH) {
          value.valid = false;
          setBgColor($field, value.valid, bgColor);
          return false;
        }
        break;
      case 2:
        sec = timeVals[i];
      case 1:
        if (parseInt(timeVals[0]) === 24) {
          if (parseInt(timeVals[i]) !== 0) {
            value.valid = false;
            setBgColor($field, value.valid, bgColor);
            return false;
          }
        } else {
          if (timeVals[i] < 0 || timeVals[i] > 59) {
            value.valid = false;
            setBgColor($field, value.valid, bgColor);
            return false;
          }
        }
        break;
      case 3:
        if (timeVals[i] < 0 || timeVals[i] > 999999) {
          value.valid = false;
          setBgColor($field, value.valid, bgColor);
          return false;
        }
        break;
      default:
        value.valid = false;
        setBgColor($field, value.valid, bgColor);
        return false ;
      } // switch
    } // for (i)

    value.valid = true;
    setBgColor($field, value.valid, bgColor);
    if (convert !== undefined && convert === true) {
      value.val = parseInt(timeVals[0]) * 3600 + parseInt(timeVals[1]) * 60 + parseInt(sec);
      timeVals[0] = ("00" + hm.hour).slice(-2);
      timeVals[1] = ("00" + hm.min).slice(-2);
      if (secDefined === true) {
        timeVals[2] = ("00" + hm.sec).slice(-2);

        if (microsecDefined === true) {
          timeVals[3] = ("000000" + hm.microSec).slice(-6);
        }
      }
    } else {
      timeVals[0] = ("00" + hm.hour).slice(-2);
      timeVals[1] = ("00" + hm.min).slice(-2);
      value.val = { hour: timeVals[0], min: timeVals[1] };
      if (secDefined === true) {
        timeVals[2] = ("00" + hm.sec).slice(-2);
        value.val.sec = timeVals[2];

        if (microsecDefined === true) {
          timeVals[3] = (hm.microSec + "000000").slice(0,6);
          value.val.microSec = timeVals[3];
        }
      }
    }
    if (format) {
      formatVal = { hour: timeVals[0], min: timeVals[1] };
      if (secDefined === true) {
        formatVal.sec = timeVals[2];

        if (microsecDefined === true) {
          formatVal.microSec = timeVals[3];
        }
      }
      $field.trigger("spruit-val-set", [ formatVal ]);
    }
    return false;
  };  // validate

    events = function() {
      let inputTimeObj = this;

      inputTimeObj.toggleClock = function(event) {
        let /* $clock = $(this).children(".spruit-clock"), */ 
          $hh = $clock.children(".spruit-clock-hh"), $ss = $clock.children(".spruit-clock-ss"), offset = $(this).offset();

        if (Clock.isVisible($clock)) {
          $clock.css("display", "");
        } else {
          $clock.css("display", "block");
          offset.top = offset.top + ui.component.fontSize;
          offset.left = offset.left - 73;
          $clock.offset( offset );
          $hh.trigger("click");
        }

        if(inputTimeObj.sec === true) {
          $ss.css("display", "inline-block");
        } else {
          $ss.css("display", "none");
        }

        Clock.$parent = $(this).parent();
        // console.log("inputtime, events, toggleClock");
      };

      inputTimeObj.$inputTime.children(".fa-clock-o").each(function() {
        $(this).on("click", inputTimeObj.toggleClock);
      });      
    };

    this.$inputTime = html(args);
    this.content = content;
    this.val = val;

    this.sec = args.sec;
    this.microSec = args.microSec;

    this.events = events;
    this.events();
  }; // inputtime

  html = function(args) {
    let inputTime = new inputtime(args);

    return inputTime.$inputTime;
  };

  content = function(fieldName, sec, microSec) {
    let inputTime = new inputtime({ fieldName:fieldName, sec:sec, microSec:microSec });

    return inputTime; // .content(fieldName, sec, microSec);
  };

  return {
    html: html,
    /* val: val, */
    content: content
    /* validate: validate */
  };
}());

InputDateAndTime = (function() {
  let html, val, content, validate;

  html = function(args /* { fieldName, attr } */) {
    let fieldName = args.fieldName, spanAttr = { class: "spruit-field spruit-inputdateandtime" }, $inputdateandtime;

    if (fieldName !== undefined) {
      spanAttr["name"] = fieldName;
    }
    if (args.attrs) {
      if (args.attrs.span) {
        if (args.attrs.span.class) {
          spanAttr.class = args.attrs.span.class;
        }
      }
    }
    if (args.key === true) {
      spanAttr.class += " spruit-key";
    }

    $inputdateandtime = Tag("span", spanAttr, [], false, val, undefined, validate);
    content(fieldName, $inputdateandtime, args.sec, args.microSec);
    return $inputdateandtime;
  };

  val = function(event, ymdhm, fromServer) {
    let $field = $(this), $inputDate = $field.children(".spruit-inputdate"), $inputTime = $field.children(".spruit-inputtime"), ymd = {}, hm = {}, name = $field.attr("name"), date,
      milliSec, microSec;

    if (event.type === "spruit-val-set") {
      if (ymdhm !== undefined) {
        if (isArray(ymdhm.val)) {
          milliSec = ymdhm.val[0];
          microSec = ((milliSec % 1000) * 1000) + ymdhm.val[1];
        } else {
          milliSec = ymdhm.val;
        }

        if (milliSec === -1) {
          ymd = { year:"", mon:"", day:"" };
          hm = { hour:"", min:"", sec:"" };
        } else {
          date = new Date(milliSec);
          ymd = { year:date.getUTCFullYear(), mon:("00" + (date.getUTCMonth()+1)).slice(-2), day:("00" + date.getUTCDate()).slice(-2) };
          hm = { hour: ("00" + date.getUTCHours()).slice(-2), min: ("00" + date.getUTCMinutes()).slice(-2), sec: ("00" + date.getUTCSeconds()).slice(-2), 
                 microSec: (microSec + "000000").slice(0, 6) 
               };
        }
        $inputDate.trigger("spruit-val-set", [ ymd ]);
        $inputTime.trigger("spruit-val-set", [ hm ]);
      }
    } else {
      if (ymdhm !== undefined) {
        $inputDate.trigger("spruit-val-get", [ ymd ]);
        $inputTime.trigger("spruit-val-get", [ hm ]);

        if (name !== undefined && name.length) {
          ymdhm[name] = {};
          Object.assign(ymdhm[name], ymd._val, hm._val);
        } else {
          ymdhm._val = {};
          Object.assign(ymdhm._val, ymd._val, hm._val);
        }
        //console.log("InputDateAndTime.val: ymdhm=" + JSON.stringify(ymdhm));
      }
    }
    return false;
  };

  content = function(fieldName, $inputdateandtime, sec, microSec) {
    let $inputdate = Tag("span", { class: "spruit-inputdate"}, [], false, InputDate.val), inputTime, $inputTime;

    InputDate.content(undefined, $inputdate);

    if (fieldName !== undefined) {
      $inputdateandtime.append(Tag("label", { class: "field" }, [ fieldName ]));
    }

    inputTime = InputTime.content(undefined, sec, microSec);
    $inputTime = Tag("span", { class: "spruit-inputtime"}, inputTime.content(undefined, sec, microSec), false, inputTime.val);
    $inputTime.children(".fa-clock-o").on("click", inputTime.toggleClock);

    $inputdateandtime.append(
      $inputdate,
      Tag("span", { class: "spruit-inputdateandtime-separator" }, []),
      $inputTime /* Tag("span", { class: "spruit-inputtime"}, inputTime.content(undefined, sec, microSec), false, inputTime.val) */
    );
    return $inputdateandtime;
  };

  validate = function(event, conf, value) {
    let dateTimeVal, ymdhm = value.val, ymd = { val:ymdhm }, hm = { val:ymdhm }, emptyValid = conf.emptyValid, convert = conf.convert,
      $field = $(this).children(".spruit-inputdate,.spruit-inputtime").children("input"), bgColor = conf.bgColor,
      format = conf.format, formatVal, msec, microSec;

    if ("" === ymdhm.year && "" === ymdhm.mon && ymdhm.day === "" && ymdhm.hour === "" && ymdhm.min === "") {
      if (emptyValid === undefined || emptyValid === false) {
        value.valid = false;
      } else {
        value.valid = true;
        if (convert !== undefined && convert === true) {
          value.val = -1;
        }
      }
      //console.log("InputDateAndTime.validate: empty: valid=" + value.valid);
      setBgColor($field, value.valid, bgColor);
      return false;
    }

    //console.log("*** InputDateAndTime.validate: value=" + JSON.stringify(value));

    InputDate.validate({},{ emptyValid: false }, ymd);
    if (ymd.valid === false) {
      value.valid = false;
      setBgColor($field, value.valid, bgColor);
      return false;
    }
    InputTime.validate({},{ emptyValid:false, maxH:23 }, hm);
    if (hm.valid === false) {
      value.valid = false;
      setBgColor($field, value.valid, bgColor);
      return false;
    }
    //console.log("*** InputDateAndTime.validate: hm=" + JSON.stringify(hm));
    dateTimeVal = Date.parse(ymd.val.year+"-"+ymd.val.mon+"-"+ymd.val.day+"T"+hm.val.hour+":"+hm.val.min+":"+(hm.val.sec ? hm.val.sec : "00")+"Z");
    if (isNaN(dateTimeVal)) {
      value.valid = false;
      setBgColor($field, value.valid, bgColor);
      return false;
    }

    value.valid = true;
    setBgColor($field, value.valid, bgColor);
    if (convert !== undefined && convert === true) {

      if (hm.val.microSec !== undefined) {
        msec = parseInt(hm.val.microSec);
        if (!isNaN(msec)) {
          msec = Math.floor( msec/1000 );
          microSec = hm.val.microSec - msec * 1000;
          dateTimeVal += msec;
          dateTimeVal = [ dateTimeVal, microSec ];
        }
      }

      value.val = dateTimeVal;
      formatVal = { year:ymd.val.year, mon:ymd.val.mon, day:ymd.val.day, hour:hm.val.hour, min:hm.val.min, sec:hm.val.sec, microSec: hm.val.microSec };
    } else {
      value.val = { year:ymd.val.year, mon:ymd.val.mon, day:ymd.val.day, hour:hm.val.hour, min:hm.val.min, sec:hm.val.sec, microSec: hm.val.microSec };
      formatVal = value.val;
    }
    if (format) {
      $field.trigger("spruit-val-set", [ formatVal ]);
    }

    return false;
  };

  return {
    html: html
  }
}());

Table = (function() {
  let html, html2, val, setTitle, setColNames, setRows, content, validate;

  html = function(args /* { fieldName, numRows, rowNum, colTitle, cellNum, colTypes, attrs } */) {
    let fieldName = args.fieldName, numRows = args.numRows, rowNum = args.rowNum, colTitle = args.colTitle, cellNum = args.cellNum, colTypes = args.colTypes,
      attrs = args.attrs, divAttrs = { class: "spruit-field spruit-table " + fixId(fieldName), name: fieldName };

    if (attrs != undefined) {
      if (attrs.replace) {
        if (attrs.replace.class) {
          divAttrs = { class: attrs.replace.class + " spruit-table " + fixId(fieldName), name: fieldName };
        }
      }
      if (attrs.add) {
        if (attrs.add.class) {
          divAttrs.class += " " + attrs.add.class;
        }
      }
    }

    return Tag("div", divAttrs, content(fieldName, numRows, rowNum, colTitle, cellNum, colTypes), false, val, undefined, validate);
  };

  html2 = function(args /* { fieldName, numRows, rowNum, colTitle, cellNum, colTypes, attrs } */) {
    let fieldName = args.fieldName, numRows = args.numRows, rowNum = args.rowNum, colTitle = args.colTitle, cellNum = args.cellNum, colTypes = args.colTypes,
      attrs = args.attrs, divBaseClass="spruit-field", divAttrs = { class: divBaseClass + " spruit-table " + fixId(fieldName), name: fieldName }, cssOut=[], css=args.css;

    if (attrs != undefined) {
      if (attrs.replace) {
        if (attrs.replace.class) {
          divBaseClass = attrs.replace.class;
          divAttrs = { class: divBaseClass + " spruit-table " + fixId(fieldName), name: fieldName };
        }
      }
      if (attrs.add) {
        if (attrs.add.class) {
          divAttrs.class += " " + attrs.add.class;
        }
      }
    }

    if (css !== undefined) {
      if (css.div !== undefined) {
        cssOut.push("." + divBaseClass + "[name=\"" + fieldName + "\"] { " + css.div + " }");
      }
      if (css.title !== undefined) {
        cssOut.push("." + divBaseClass + "[name=\"" + fieldName + "\"] > .spruit-table-title { " + css.title + " }");
      }
      if (css.colnames !== undefined) {
        cssOut.push("." + divBaseClass + "[name=\"" + fieldName + "\"] > .spruit-table-row-colnames { " + css.colnames + " }");
      }
      if (css.colnamesCols !== undefined) {
        let colnamesColsLen = css.colnamesCols.length, colnamesColsI;
        for (colnamesColsI=0; colnamesColsI<colnamesColsLen; colnamesColsI++) {
          cssOut.push("." + divBaseClass + "[name=\"" + fieldName + "\"] > .spruit-table-row-colnames > .spruit-table-colname-" + (colnamesColsI + 1) + " { " + css.colnamesCols[colnamesColsI] + " }");
        }
      }
      if (css.row !== undefined) {
        cssOut.push("." + divBaseClass + "[name=\"" + fieldName + "\"] > .spruit-table-row { " + css.row + " }");
      }
      if (css.cols !== undefined) {
        let colsLen = css.cols.length, colsI;
        for (colsI=0; colsI<colsLen; colsI++) {
          cssOut.push("." + divBaseClass + "[name=\"" + fieldName + "\"] > .spruit-table-row > .spruit-table-col-" + (colsI + 1) + " { " + css.cols[colsI] + " }");
        }
      }
    }

    return { $field: Tag("div", divAttrs, content(fieldName, numRows, rowNum, colTitle, cellNum, colTypes), false, val, undefined, validate), cssOut:cssOut };
  }; // html2

  val = function(event, tableData, fromServer) {
    let $table = $(this), name = $table.attr("name"), content, numRows;

    if (event.type === "spruit-val-set") {
      if (tableData !== undefined) {
        if (fromServer === true) {
          if (tableData.valid === true) {
            tableData = tableData.val;
          }
        }
        content = [];
        $table.children(".spruit-table-row").each( function() {   // was find
          let $row = $(this), row=[];

          $row.children(".spruit-table-field").each( function() { // was find
            row.push($(this));
          });

          content.push(row);
        });
        numRows = tableData.length;
        for (let rowI=0; rowI<numRows; rowI++) {
          let row = tableData[rowI], numCols = row.length, colI;

          for (colI=0; colI<numCols; colI++) {
            content[rowI][colI].trigger("spruit-val-set", [ tableData[rowI][colI], fromServer ]);
          }
        }
      }
    } else {
      if (tableData !== undefined) {
        if (name !== undefined && name.length && $table.hasClass("spruit-table-field") === false) {
          tableData[name] = [];
          content = tableData[name];
        } else {
          tableData._val = [];
          content = tableData._val;
        }

        $table.children(".spruit-table-row").each( function() { // was find()
          let $row = $(this), row=[];

          $row.children(".spruit-table-field").each( function() { // was find()
            let $field = $(this), fieldVal = {};

            $field.trigger("spruit-val-get", [ fieldVal ]);
            row.push(fieldVal._val);
          });

          content.push(row);
        });
      }
    }
    return false;
  };

  setTitle = function(tbl, fieldName) {
    if (fieldName !== undefined) {
      tbl.push(Tag("span", { class: "spruit-table-title" }, [ fieldName ]));
    }
  };

  setColNames = function(tbl, rowNum, colTitle, colTypes) {
    let names = [], colTypesLen = colTypes.length;

    if (colTitle !== true) {
      return false;
    }
    if (rowNum) {
      names.push(Tag("span", { class: "spruit-table-rownum" }, [ ]))
    }

    for (let i=0; i<colTypesLen; i++) {
      if(i>0) {
        names.push(Tag("span", { class: "spruit-table-col-space" }, []));
      }
      names.push(Tag("span", { class: "spruit-table-colname-" + (i+1) }, [ colTypes[i].title ]));
    }

    tbl.push(Tag("div", { class: "spruit-table-row-colnames" }, names));
    return true;
  };

  setRows = function(tbl, numRows, rowNum, cellNum, colTypes) {
    let row, colI, rowI, colTypesLen = colTypes.length;

    for (rowI=0; rowI<numRows; rowI++) {
      row=[];
      if (rowNum) {
        row.push(Tag("span", { class: "spruit-table-rownum" }, [ "" + (rowI+1) ]))
      }
      for (colI=0; colI<colTypesLen; colI++) {
        if (cellNum) {
          row.push(Tag("span", { class: "spruit-table-cellnum" }, [ "" + ((colI+1) + rowI * colTypesLen) ]));
        }

        /* Auto configure the htmlArgs of columns
         *
         *   type:ui.component.DigitString
         *   htmlArgs:{ attrs:{ 
         *     span:{ class:"spruit-table-field spruit-table-col-1" },                      <--- this is auto configured
         *     input:{ size:2, maxlength:2 }
         *   }}
         *
         *   type:ui.component.InputCheckbox,
         *   htmlArgs:{ attrs:{span:{ class:"spruit-table-field spruit-table-col-1" }} },   <--- this is auto configured
         *
         *   type:ui.component.Select,
         *   htmlArgs:{ 
         *     attrs:{ span:{ class:"spruit-table-field spruit-table-col-2" }},             <--- this is auto configured
         *     options:[ "e-mail address", "MSISDN", "IPv4 Address", "IPv6 Address", "Numeric Shortcode", "Alphanumeric Shortcode", "Other", "IMSI" ]
         *   }
         */
        if (colTypes[colI].htmlArgs === undefined) {
          colTypes[colI].htmlArgs = { attrs:{span:{ class:"spruit-table-field spruit-table-col-" + (colI + 1) }} };
        } else {

          if (colTypes[colI].htmlArgs.attrs === undefined) {
            colTypes[colI].htmlArgs.attrs = { span:{ class:"spruit-table-field spruit-table-col-" + (colI + 1) }};
          } else {

            if (colTypes[colI].htmlArgs.attrs.span === undefined) {
              colTypes[colI].htmlArgs.attrs.span = { class:"spruit-table-field spruit-table-col-" + (colI + 1) };
            }
          }
        }

        row.push(colTypes[colI].type.html( colTypes[colI].htmlArgs ));
      }
      tbl.push(Tag("div", { class: "spruit-table-row" }, row));
    }
  };

  content = function(fieldName, numRows, rowNum, colTitle, cellNum, colTypes) {
    let tbl = [], colTypesLen = colTypes.length;

    setTitle(tbl, fieldName);
    setColNames(tbl, rowNum, colTitle, colTypes);
    setRows(tbl, numRows, rowNum, cellNum, colTypes);

    return tbl;
  };

  validate = function(event, conf, value) {
    let $table = $(this), tableData = value.val, $tableFields = [], numRows, convert = conf.convert, bgColor = conf.bgColor, format = conf.format, emptyValid = !$table.hasClass("spruit-key");
    value.valid = true;

    $table.children(".spruit-table-row").each( function() {   // was find
      let $row = $(this), row=[];

      $row.children(".spruit-table-field").each( function() { // was find
        row.push($(this));
      });

      $tableFields.push(row);
    });

    numRows = tableData.length;
    for (let rowI=0; rowI<numRows; rowI++) {
      let row = tableData[rowI], numCols = row.length, colI, fieldValue;

      for (colI=0; colI<numCols; colI++) {
        fieldValue = { val: tableData[rowI][colI] };
        $tableFields[rowI][colI].trigger("spruit-validate", [ { emptyValid:emptyValid, convert: convert, bgColor: bgColor, format:format }, fieldValue ]);
        if (fieldValue.valid === false) {
          value.valid = false;
        } else {
          tableData[rowI][colI] = fieldValue.val;
        }
      }
    }
    return false;
  };

  return {
    html: html,
    html2: html2
  };
}());

TabSheet = (function() {
  let html, html2, val, setTitle, setTabs, setSheets, content, clickTab, validate;

  html = function(args /* { fieldName, sheets:[ {}, {}, ... ], tabsheetClass } */) {
    let $field, fieldName = args.fieldName, sheets = args.sheets, tabsheetClass = args.tabsheetClass, css = args.css, addCss = args.addCss, cssOut=[];

    if (tabsheetClass === undefined) {
      tabsheetClass = "spruit-field";
    }

    if (css !== undefined) {
      if (css.tabs !== undefined) {
        if (tabsheetClass == "spruit-field") {
          cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] > .spruit-tabsheet-tabs { " + css.tabs + " }");
        } else {
          cssOut.push("\"] > .spruit-tabsheet-tabs " + css.tabs);
        }
      }
      if (css.title !== undefined) {
        cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] > .spruit-tabsheet-title { " + css.title + " }");
      }
      if (css.sheets !== undefined) {
        cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] > .spruit-tabsheet-sheets { " + css.sheets + " }");
      }
      if (css.field !== undefined) {
        cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] { " + css.field + " }");
      }
    }

    $field = Tag("div", { class: tabsheetClass + " spruit-tabsheet " + fixId(fieldName), name: fieldName },
      content(fieldName, sheets, cssOut), false, val, undefined, validate);

    if (addCss === true) {
      let i;
      for (i=0; i<cssOut.length; i++) {
        console.log("cssOut: " + cssOut[i]);
      }
    }

    return $field;
  };

  html2 = function(args /* { fieldName, sheets:[ {}, {}, ... ], tabsheetClass } */) {
    let $field, fieldName = args.fieldName, sheets = args.sheets, tabsheetClass = args.tabsheetClass, css = args.css, addCss = args.addCss, cssOut=[];

    if (tabsheetClass === undefined) {
      tabsheetClass = "spruit-field";
    }

    if (css !== undefined) {
      if (css.tabs !== undefined) {
        if (tabsheetClass == "spruit-field") {
          cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] > .spruit-tabsheet-tabs { " + css.tabs + " }");
        } else {
          cssOut.push(fieldName + "\"] > .spruit-tabsheet-tabs { " + css.tabs + " }");
        }
      }
      if (css.title !== undefined) {
        if (tabsheetClass == "spruit-field") {
          cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] > .spruit-tabsheet-title { " + css.title + " }");
        } else {
          cssOut.push(fieldName + "\"] > .spruit-tabsheet-title { " + css.title + " }");
        }
      }
      if (css.sheets !== undefined) {
        if (tabsheetClass == "spruit-field") {
          cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] > .spruit-tabsheet-sheets { " + css.sheets + " }");
        } else {
          cssOut.push(fieldName + "\"] > .spruit-tabsheet-sheets { " + css.sheets + " }");
        }
      }
      if (css.field !== undefined) {
        if (tabsheetClass == "spruit-field") {
          cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] { " + css.field + " }");
        } else {
          cssOut.push(fieldName + "\"] { " + css.field + " }");
        }
      }
    }

    $field = Tag("div", { class: tabsheetClass + " spruit-tabsheet " + fixId(fieldName), name: fieldName },
      content(fieldName, sheets, cssOut, tabsheetClass), false, val, undefined, validate);
    /*
      let i;
      for (i=0; i<cssOut.length; i++) {
        console.log("cssOut: ." + tabsheetClass + "[name=\"" + fieldName + "\"] " + cssOut[i]);
      }
    */
    return { $field:$field, cssOut:cssOut };
  };

  val = function(event, val, fromServer) {
    let $tabsheet = $(this), $sheets = $tabsheet.children(".spruit-tabsheet-sheets"), fieldName = $tabsheet.attr("name");

    if (event.type === "spruit-val-set") {
      if (val !== undefined) {
        if (fromServer === true) {
          if (val.valid === true) {
            val = val.val;
          }
        }

        $sheets.children().each( function() {
          let $sheet = $(this), tabName = $sheet.prop("classList")[0].slice(22), sheetsFound=false;

          $sheet.find(".spruit-tabsheet-field-" + fieldName + "-" + tabName).each( function() {
            let $field = $(this), tabsheetFieldName = $field.attr("name");
            $field.trigger("spruit-val-set", [ val[tabName][tabsheetFieldName], fromServer ]);
            sheetsFound = true;
          });
          
          if (sheetsFound === false) {
            $sheet.find(".spruit-tabsheet-field").each( function() {
              let $field = $(this), tabsheetFieldName = $field.attr("name");
              $field.trigger("spruit-val-set", [ val[tabName][tabsheetFieldName], fromServer ]);
            });
          }
        });
      }
    } else {
      if (val !== undefined) {
        val[fieldName] = {};

        $sheets.children().each( function() {
          let $sheet = $(this), tabName = $sheet.prop("classList")[0].slice(22), sheetsFound=false;
          val[fieldName][tabName] = {};

          $sheet.find(".spruit-tabsheet-field-" + fieldName + "-" + tabName).each( function() {
            let $field = $(this);
            $field.trigger("spruit-val-get", [ val[fieldName][tabName] ]);
            sheetsFound === true;
          });

          if (sheetsFound === false) {
            $sheet.find(".spruit-tabsheet-field").each( function() {
              let $field = $(this);
              $field.trigger("spruit-val-get", [ val[fieldName][tabName] ]);
            });
          }
        });
      }
    }
    return false;
  };

  setTitle = function(tabsheet, fieldName) {
    if (fieldName !== undefined) {
      tabsheet.push(Tag("span", { class: "spruit-tabsheet-title" }, [ fieldName ]));
    }
  };

  setTabs = function(tabsheet,  sheets) {
    let i, sheetsLen = sheets.length, tabs = [];

    for (i=0; i<sheetsLen; i++) {
      tabs.push( Tag("span", { class:"spruit-tabsheet-tab", "spruit-sheet": sheets[i].name }, [ sheets[i].name ], false, undefined, clickTab) );
    }
    tabsheet.push( Tag("div", { class: "spruit-tabsheet-tabs" }, tabs) );
  };

  setSheets = function(tabsheet, sheets, cssOut, fieldName, tabsheetClass) {
    let i, sheetsLen = sheets.length, shts = [], sheetsClass = "spruit-tabsheet-sheets", sheetClass;

    for (i=0; i<sheetsLen; i++) {
      sheetClass = "spruit-tabsheet-sheet-" + sheets[i].name;
      shts.push( Tag("div", { class:sheetClass }, sheets[i].content) );

      if (sheets[i].css !== undefined) {
        if (sheets[i].css.sheets !== undefined) {
          if (sheets[i].css.sheets[sheets[i].name] !== undefined) {
            cssOut.push("." + tabsheetClass + "[name=\"" + fieldName + "\"] ." + sheetsClass + " > " + "." + sheetClass + " { " + sheets[i].css.sheets[sheets[i].name] + " }");
          }
        }
      }
    }
    tabsheet.push( Tag("div", { class:sheetsClass }, shts) );
  };

  content = function(fieldName, sheets, cssOut, tabsheetClass) {
    let tabsheet = [];

    setTitle(tabsheet, fieldName);
    setTabs(tabsheet, sheets);
    setSheets(tabsheet, sheets, cssOut, fieldName, tabsheetClass);

    return tabsheet;
  };

  clickTab = function() {
    let $tab = $(this), $tabsheet = $tab.parent().parent(), $tabs = $tab.parent(), $sheets = $tabsheet.children(".spruit-tabsheet-sheets"),
      $sheet = $sheets.children(".spruit-tabsheet-sheet-" + $tab.attr("spruit-sheet")),
      $visibleSheet = $sheets.children(".spruit-tabsheet-visible"), $visibleTab = $tabs.children(".spruit-tabsheet-tab-visible");

    if ($tab.hasClass("spruit-tabsheet-tab-visible")) {
      return false;
    }

    if ($visibleTab !== undefined) {
      $visibleTab
        .removeClass("spruit-tabsheet-tab-visible")
        .css("backgroundColor", "");
    }
    if ($visibleSheet !== undefined) {
      $visibleSheet
        .removeClass("spruit-tabsheet-visible")
        .css("display", "");
    }
    $tab.addClass("spruit-tabsheet-tab-visible");
    $sheet
      .addClass("spruit-tabsheet-visible")
      .css("display", "block");
    return false;
  };

  validate = function(event, conf, value) {
    var $tabsheet = $(this), $sheets = $tabsheet.children(".spruit-tabsheet-sheets"), $tabs = $tabsheet.children(".spruit-tabsheet-tabs"),
      tabsheet = value.val, emptyValid = conf.emptyValid, convert = conf.convert, bgColor = conf.bgColor, format = conf.format, fieldName = $tabsheet.attr("name");

    value.valid = true;
    $sheets.children().each( function() {
      var $sheet = $(this), tabName = $sheet.prop("classList")[0].slice(22), $tab, tabValid = true, sheetsFound=false;

      $tabs.children().each( function() {
        if ($(this).attr("spruit-sheet") === tabName) {
          $tab = $(this);
        }
      });

      $sheet.find(".spruit-tabsheet-field-" + fieldName + "-" + tabName).each( function() {
        var $field = $(this), tabsheetFieldName = $field.attr("name"), fieldValue = { val: tabsheet[tabName][tabsheetFieldName] };

        $field.trigger("spruit-validate", [ { emptyValid: emptyValid, convert: convert, bgColor: bgColor, format:format }, fieldValue ]);

        if (fieldValue.valid === false) {
          value.valid = false;
          tabValid = false;
        } else {
          tabsheet[tabName][tabsheetFieldName] = fieldValue.val;
        }
        sheetsFound = true;
      });

      if (sheetsFound === false) {
        $sheet.find(".spruit-tabsheet-field").each( function() {
          var $field = $(this), tabsheetFieldName = $field.attr("name"), fieldValue = { val: tabsheet[tabName][tabsheetFieldName] };

          $field.trigger("spruit-validate", [ { emptyValid: emptyValid, convert: convert, bgColor: bgColor, format:format }, fieldValue ]);

          if (fieldValue.valid === false) {
            value.valid = false;
            tabValid = false;
          } else {
            tabsheet[tabName][tabsheetFieldName] = fieldValue.val;
          }
        });
      }
      setBgColor($tab, tabValid, bgColor);
    });

    return false;
  };

  return {
    html: html,
    html2:html2
  };
}());

fakeMessage = {
        "MobileNumber":"573007072831",
        "State":"Insufficient Funds",
        "EnableMcommerce":false,
        "Activation Date":{"year":"2017","mon":"06","day":"01"},
        "Start time":{"hour":"18","min":"30"},
        "Free Friend Time FF":{"year":"2018","mon":"01","day":"01","hour":"00","min":"00"},
        "TP Periodic Services":[["valset1",{"year":"2017","mon":"01","day":"31"},{"year":"2020","mon":"10","day":"20"}],
                                ["valset2",{"year":"2016","mon":"02","day":"26"},{"year":"2021","mon":"11","day":"21"}],
                                ["valset3",{"year":"2015","mon":"03","day":"29"},{"year":"2022","mon":"12","day":"22"}],
                                ["valset4",{"year":"2014","mon":"04","day":"28"},{"year":"2023","mon":"09","day":"23"}],
                                ["valset5",{"year":"2013","mon":"05","day":"27"},{"year":"2024","mon":"08","day":"24"}]],
        "Group ID":[["111111011111"],["2"],["333"]],
        "Loyalty Bonus Programs":[[false,true,false,true,false,true,false,true,true,false,true,false,true,false,true,false]],
        "Subscription Services":{
          "1":{"ServiceID":"serviceid1","State":"On","PriceListID":"pricelist1",
               "Valid From":{"year":"2000","mon":"01","day":"02","hour":"03","min":"04"},"Valid Until":{"year":"2001","mon":"05","day":"06","hour":"07","min":"08"},
               "Billed Until":{"year":"2002","mon":"09","day":"10","hour":"13","min":"14"},"Next Billing Time":{"year":"2003","mon":"11","day":"12","hour":"15","min":"16"}},
          "2":{"ServiceID":"serviceid222","State":"Pending","PriceListID":"pricelistid2",
               "Valid From":{"year":"2010","mon":"12","day":"31","hour":"23","min":"59"},"Valid Until":{"year":"2009","mon":"11","day":"30","hour":"22","min":"58"},
               "Billed Until":{"year":"2008","mon":"10","day":"29","hour":"21","min":"57"},"Next Billing Time":{"year":"2007","mon":"09","day":"28","hour":"20","min":"56"}},
          "3":{"ServiceID":"serviceid333","State":"On","PriceListID":"pricelistid3",
               "Valid From":{"year":"2020","mon":"10","day":"11","hour":"12","min":"13"},"Valid Until":{"year":"2021","mon":"09","day":"12","hour":"13","min":"14"},
               "Billed Until":{"year":"2022","mon":"08","day":"13","hour":"15","min":"16"},"Next Billing Time":{"year":"2023","mon":"07","day":"14","hour":"17","min":"18"}}}
};
Message = (function() {
  let message;

  message = function(args) {
    var isFakeRead = false, url = args.url, $screen = args.$screen,
      send;

    send = function(msg) {
      var $scr = this.$screen, action = msg.action;

      if (this.isFakeRead) {
        this.$screen.trigger( "spruit-server-message",
                              [{
                                 resultCode: 999,
                                 notification: { text: msg.action + " OK" },
                                 fields: fakeMessage
                              }]
                            );
      } else {

        $.ajax({
          type: "POST",
          url: this.url,
          contentType: "application/json",
          data: JSON.stringify(msg),

          success: function(response) { $scr.trigger("spruit-server-message", [ response, action ]); },
          error: function(jqXHR, exception) { console.log(jqXHR.status); }
        });
      }
    };

    this.isFakeRead = isFakeRead;
    this.url = url;
    this.$screen = $screen;
    this.send = send;
  };

  return {
    message: message
  };
}());

Row = function(content, cssOut) {
  let i, len=content.length, cssoutI, cssoutLen;

  if (cssOut !== undefined) {
    for (i=0; i<len; i++) {
      if (content[i].$field !== undefined) {

        // console.log("Row: i=" + i + " cssOut.len=" + content[i].cssOut.length);

        cssoutLen = content[i].cssOut.length;
        for (cssoutI=0; cssoutI<cssoutLen; cssoutI++) {
          // console.log("Row, cssOut[" + cssoutI + "]=" + content[i].cssOut[cssoutI]);
          cssOut.push(content[i].cssOut[cssoutI]);
        }
        content[i] = content[i].$field;
      }
    } // for(i)
  }

  return Tag( "div", { class: "screen-row" }, content);
};

View = function(content, cssOut) {
  let view = [], rowI, numRows=content.length;

  for (rowI=0; rowI<numRows; rowI++) {
    view.push(Row(content[rowI], cssOut));
  }

  return view;
};

Screen = function(screenName /* "" */, 
                  sheets     /* [] */, 
                  css        /* [] */) {
  let 
    screen = [ TabSheet.html2({ fieldName: screenName /* "Recharge Reversal Maintenance" */, tabsheetClass:"spruit-screen-view", addCss:true, sheets:sheets }).$field ],
    i, len = css.length;

  for (i=0; i<len; i++) {
    console.log("Screen: .spruit-screen-view[name=\"" + screenName + "\"] " + css[i]);
    css[i] = ".spruit-screen-view[name=\"" + screenName + "\"] " + css[i];
    ui.component.$style.append(css[i]);
  }

  return screen;             /* [] */
};

calendar = new Calendar.calendar({});
$clock = Clock.html("spruit-inputtime", true /*sec*/, true /*microSec*/);

return {
  Screen:Screen,
  View:View,
  Row:Row,
  Message: Message,
  TabSheet: TabSheet,
  Table: Table,
  InputDateAndTime: InputDateAndTime,
  InputTime: InputTime,
  Clock: Clock,
  $clock: $clock,
  InputDate: InputDate,
  Month: Month,
  Calendar: Calendar,
  $calendar: calendar.html(),
  _Tag: _Tag,
  Tag: Tag,
  Div: Div,
  Select: Select,
  AlphaNumericString: AlphaNumericString,
  DecimalDigitString: DecimalDigitString,
  DigitString: DigitString,
  InputText2: InputText2,
  InputCheckbox: InputCheckbox
};

}());
