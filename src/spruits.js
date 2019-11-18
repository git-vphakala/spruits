var spruits = (function(){
"use strict";

let 
  isArray, isFunction, isString, id = 0, getId, mediaQuery,
  Component,
  InputText, AlphaNumericString, DigitString, DecimalDigitString,
  InputCheckbox, 
  Select,
  Month, Modal, Calendar, InputDate,
  Spinner, TimePicker, InputTime, InputDateAndTime,
  getResponsiveTable,
  Table, TabSheet, TabSheet2, CustomType,
  Entity, Container,
  Menu,
  Crud,
  Notification,
  PageManager,
  TouchManager,
  init;

isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

isFunction = function(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};

isString = function (obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

getId = function(base) {
  let yourId;

  if (base !== undefined) {
    yourId = base + id;
  } else {
    yourId = "" + id;
  }
  id++;

  return yourId;
}

mediaQuery = function(){ 
  return ($(window).width() >= 800); 
}; // mediaQuery

Component = function(args) {
  let
    insertLabel = args.insertLabel,
    name =        args.fieldName,
    fieldClass =  args.fieldClass,
    $field =      args.$field,
    attrs =       args.attrs,
    view =        args.view,
    isKey =       args.isKey,

    $label,
    cacheVal,

    get, set, testTemplateProcessor;

  if (view !== undefined) {
    if (view.fields[name] === undefined) {
      console.log(name);
    }
    $field = view.fields[name].$field;
    insertLabel = false;
  }
  
  if ($field === undefined) {
    $field = $("<span class=\"spruit-field\"></span>");

    if (attrs !== undefined) {
      if (attrs.span !== undefined) {
        if (attrs.mediaquery !== undefined && attrs.mediaquery.span !== undefined) {
          if (attrs.mediaquery.span()) {
            $field.attr(attrs.span);
          }
        } else {
          $field.attr(attrs.span);
        }
      }
    }
  }

  if (fieldClass !== undefined) {
    if (fieldClass !== false) {
      $field.removeClass("spruit-field");
      $field.addClass(fieldClass);
    }
  }

  if (insertLabel !== false) {
    $label = $("<label>" + name + "</label>");
    $field.append($label);

    if (attrs !== undefined) {
      if (attrs.label !== undefined) {
        $label.attr(attrs.label);
      }
    }
  }

  get = function(propName) {
    switch (propName) {
    case "val":
      cacheVal = this.getVal();
      return cacheVal;
      break;
    case "cache":
      if (cacheVal === undefined) {
        cacheVal = this.getVal("empty");
      }
      return cacheVal;
      break;
    case "isKey":
      return isKey;
      break;
    case "valid":
      return this.validate();
    default:
      return this.getVal(propName);
      break;
    } // switch
  }; // get

  set = function(propName, val) {
    let localCacheVal;

    switch(propName) {
    case "fromCache":
      if (cacheVal === undefined) {
        this.empty();
        localCacheVal = cacheVal;
      } else {
        this.setVal(cacheVal);

        localCacheVal = cacheVal;

        if (val === true /* cleanCache */) {
          cacheVal = undefined;
        }
      }
      return localCacheVal;
      break;
    case "val":
      this.setVal(val);
      break;
    case "empty":
      this.empty();
      break;
    default:
      this.setVal(propName, val);
      break;
    } // switch
  }; // set

  testTemplateProcessor = function(template) {
    return "\"" + name + "\":" + JSON.stringify(template);
  }; // testTemplateProcessor

  this.name = name;
  this.attrs = attrs;
  this.$label = $label;
  this.$field = $field;

  this.get = get;
  this.set = set;
  this.testTemplateProcessor = testTemplateProcessor;
}; // Component

InputText = function(args) {
  let
    size =    args.size,
    $input =  args.$input, // $("<input type=\"text\">"),
    view =    args.view,
    len, i,

    template, templateProcessor, tmplProcessor, 

    getVal, setVal, empty;

  tmplProcessor = function() {
    if (templateProcessor !== undefined) {
      return templateProcessor(this.fieldName, template);
    } else {
      return this.testTemplateProcessor(template);
    }
  }; // tmplProcessor

  Component.call(this, args);

  if (view !== undefined) {
    $input = view.fields[this.name].$input;
  }

  if ($input === undefined) {
    $input = $("<input type=\"text\">");
    if (this.attrs !== undefined && this.attrs.input !== undefined) {
      if (isArray(this.attrs.input)) {
        len = this.attrs.input.length;
        for (i=0; i<len; i++) {
          $input = $("<input type=\"text\">").attr(this.attrs.input[i]);
          this.$field.append($input);
        }
      } else {
        $input.attr(this.attrs.input);
        this.$field.append($input);
      }
    } else {
      this.$field.append($input);

      if (size !== undefined) {
        $input.attr({ "size":size, "maxlength":size });
        $input.addClass("len" + size);
      }
    }
  } // $input === undefined

  getVal = function(propName) {
    switch(propName) {
    default:
      return this.$input.val();
    case "empty":
      return "";
    }
  }; // getVal

  setVal = function(propName, val) {
    if (val === undefined) {
      this.$input.val(propName);
    } else {
      switch(propName) {
      case "val":
        this.$input.val(val);
        break;
      case "testcaseTemplate":
        template = val.template;
        templateProcessor = val.templateProcessor;     
        break;
      } // switch (propName)
    }
  }; // setVal

  empty = function() {
    this.$input.val("");
  };

  this.$input = $input;

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.templateProcessor = tmplProcessor;
}; // InputText

AlphaNumericString = function(args) {
  let validate;

  InputText.call(this, args); 

  validate = function() {
    let 
      valid = { valid:true }, value, regExp = /[^a-f0-9A-F]/; // test a non digit/alpha character

    value = this.getVal("val");
    // console.log("DigitString.validate, value=" + value);

    if (regExp.test(value)) {
      valid.valid = false;
      valid.invalid = value;
    }

    return valid;
  };

  this.validate = validate;
};

DigitString = function(args) { 
  let validate;

  InputText.call(this, args); 

  validate = function() {
    let 
      valid = { valid:true }, value, regExp = /\D/; // test a non-digit character

    value = this.getVal("val");
    // console.log("DigitString.validate, value=" + value);

    if (regExp.test(value)) {
      valid.valid = false;
      valid.invalid = value;
    }

    return valid;
  }; // validate

  this.validate = validate;
}; // DigitString

DecimalDigitString = function(args) { 
  let validate;

  if (args === undefined) {
    args = {};
  }
  if (args.size === undefined) {
    args.size = "21";
  }
  InputText.call(this, args); 

  validate = function() {
    let 
      valid = { valid:true }, value, regExp = /^\-?\d*\.?\d*$/; // [-] digits [ . [ decimal-digits ] ]

    value = this.getVal("val");
    // console.log("DigitString.validate, value=" + value);

    // foo = value.match(regExp)
    if (value.match(regExp) === null) {
      valid.valid = false;
      valid.invalid = value;
    }

    return valid;
  };

  this.validate = validate;
};

InputCheckbox = function(args) {
  let
    view = args.view,
    initial = false,
    $input,           // = $("<input type=\"checkbox\">"),

    template, templateProcessor, tmplProcessor, 

    getVal, setVal, empty, validate;

  tmplProcessor = function() {
    if (templateProcessor !== undefined) {
      return templateProcessor(this.fieldName, template);
    } else {
      return this.testTemplateProcessor(template);
    }
  }; // tmplProcessor

  if (args === undefined) {
    args = {};
  };
  if (args.initial !== undefined) {
    initial = args.initial;
    if (initial !== true) {
      initial = false;
    }
  }

  Component.call(this, args);
  if (view === undefined) {
    $input = $("<input type=\"checkbox\">");
    $input[0].checked = initial;
    this.$field.append($input);
  } else {
    $input = view.fields[this.name].get("$input");
    initial = view.fields[this.name].get("initial");
    $input[0].checked = initial;
  }

  getVal = function(propName) {
    switch(propName) {
    case "$input":
      return $input;
      break;
    case "empty":
      return initial;
      break;
    default:
      return $input.prop("checked");
      break;
    } // switch
  }; // getVal

  setVal = function(propName, val) {
    if (val === undefined) {
      $input[0].checked = propName;
    } else {
      switch(propName) {
      case "val":
        $input[0].checked = val;
        break;
      case "testcaseTemplate":
        template = val.template;
        templateProcessor = val.templateProcessor;     
        break;
      } // switch (propName)
    }
  }; // setVal

  empty = function() {
    $input[0].checked = initial;
  }; // empty

  validate = function() {
    return { valid:true };
  }; // validate

  this.$input = $input;

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
  this.templateProcessor = tmplProcessor;
}; // InputCheckbox

Select = function(args) {
  let
    options =        args.options,     // [ "selection 1", "selection 2" ] or { "selection 1":x1, "selection 2":x2 }
    emptyVal =       args.empty,       // { value:"", description:"&lt; not selected &gt;", initial:true }
    view =           args.view,

    $options,                                      // = $("<ul>"),
    optionsLen, i, selection,
    $select,                                       // = $("<ul>", {class:"spruits-select"}),
    $span,
    $i,                                            // = $("<i>", {class:"fa fa-angle-down"}),
    initialVal,
    valueMap,                          // when option = {...}, this is { "x1":"selection 1", "x2":"selection 2" }

    template, templateProcessor, tmplProcessor, 

    getVal, setVal, empty, validate;

  tmplProcessor = function() {
    if (templateProcessor !== undefined) {
      return templateProcessor(this.fieldName, template);
    } else {
      return this.testTemplateProcessor(template);
    }
  }; // tmplProcessor

  Component.call(this, args);

  if (view === undefined) {
    $select = $("<ul>", {class:"spruits-select"});
    $options = $("<ul>");
    $i = $("<i>", {class:"fa fa-angle-down"});
    optionsLen = options.length;

    this.$field.append($select);

    if (emptyVal !== undefined) {
      $options.prepend( $("<li>").append( $("<span>",{class:"value"}).html(emptyVal.value), emptyVal.description) );
      if (emptyVal.initial === true) {
        $span = $("<input>").val(emptyVal.value); // $("<span>").html(emptyVal.value);
        initialVal = emptyVal.value;
      }
    }

    if (isArray(options) === true) {
      for (i=0; i<optionsLen; i++) {
        selection = options[i];
        $options.append( $("<li>").append( $("<span>",{class:"value"}).html(selection) ) );
        if ($span === undefined) {
          $span = $("<input>").val(selection); // $("<span>").html(selection);
          initialVal = selection;
        }
      }
    } else {
      valueMap = {};
      for (selection in options) {
        $options.append( $("<li>").append( $("<span>",{class:"value"}).html("" + options[selection]), selection) );
        if ($span === undefined) {
          $span = $("<input>").val(options[selection]); // $("<span>").html(options[selection]);
          initialVal = options[selection];
        }
        valueMap[ ("" + options[selection]) ] = selection;
      }
    }

    $select.append( $("<li>").append(
      $span.addClass("selected"), 
      $("<i>", {class:"fa fa-angle-down"}).on("click", function(){ $(this).next().toggleClass("show"); return false; }),
      $options.on("click", function(e){ 
        let selected = $(e.target).children("span").html(); 
        $span.val(selected); // $(this).prev().prev().html(selected); 
        $(this).toggleClass("show"); return false; 
      })
    ));
  } else { // using another Select's $field
    $span = view.fields[this.name].$field.find(".selected");
    initialVal = view.fields[this.name].get("initialVal");
  }

  getVal = function(propName) {
    switch (propName) {
    case "initialVal":
      // console.log("getVal, initialVal=" + initialVal);
      return initialVal;
      break;
    case "empty":
      return initialVal;
      break;
    default:
      return $span.val(); // html();
    } // switch
  }; // getVal

  setVal = function(propName, val) {
    if (val === undefined) {
      $span.val(propName);
    }
    else {
      switch(propName) {
      case "val":
        $span.val(val); // html(val);
        break;
      case "testcaseTemplate":
        template = val.template;
        templateProcessor = val.templateProcessor;     
        break;
      } // switch (propName)
    }
  }; // setVal

  empty = function() {
    $span.val(initialVal); // html( initialVal );
  };

  validate = function() {
    let 
      valid = { valid:true }, value;

    value = this.get("val");

    if (isArray(options) === true) {
    } else {
      if (valueMap[value] === undefined) {
        valid.valid = false;
        valid.invalid = value;
      }
    }

    return valid;
  }; // validate

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
  this.templateProcessor = tmplProcessor;
}; // Select

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
}; // Month

Modal = function(args) {
  let 
    $modalcontainer = args.$container,
    $bodycontent =    args.$modalbody,
    closeCallback =   args.closeCallback,
    modalinClass =    args.modalinClass,
    modaloutClass =   args.modaloutClass,
    id =              args.id,
    $pageboxes =      args.$pageboxes,
    crud =            args.crud,

    $modalBody,
    $title =          $("<h2>"),
    setVal,
    iHidedPageboxes = false,
    iHidedCrud =      false;

  if (args === undefined) {
    args = {};
  };
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-modal";
  }
  args.insertLabel = false;

  Component.call(this, args);
  $title.html(this.name);

  $modalBody = $("<div>", {class:"modal-body"});
  if ($bodycontent !== undefined) {
    $modalBody.append($bodycontent);
  }

  this.$field.append(
    $("<div>", {class:"modal-content"}).append(
      $("<div>", {class:"modal-header"}).append(
        $("<span>", {class:"close"}).html("&times;")
        .on("click", function(e){
          e.preventDefault();

          if (closeCallback !== undefined) {
            closeCallback(e, $title.html());
          }
          $(this).parents(".modal-content").removeClass("modalIn").addClass("modalout");
          return false;
        }),
        $title
      ),

      $modalBody,

      $("<div>", {class:"modal-footer"}).append(
        "&nbsp;"
      )
    ) // .modal-content
    .on("animationend", function() {
      if ($(this).hasClass("modalout")) {
        $(this).parents(".spruits-modal").css("display","none");
        if (iHidedPageboxes === true) {
          $pageboxes.removeClass("hide");
          iHidedPageboxes = false;
        }
        if (iHidedCrud === true) {
          crud.set("show");
          iHidedCrud = false;
        }
      }
      return false;
    })
  ); // .spruits-modal
  this.$field.attr("id", id);
  $modalcontainer.append(this.$field);

  setVal = function(propName, val) {
    switch(propName) {
    case "$modalbody":
      $modalBody.children().detach();
      $modalBody.append(val);
      break;
    case "$title":
      $title.html(val);
      break;
    case "show":
      this.$field.css("display", "block");
      this.$field.find(".modal-content").removeClass("modalout").addClass("modalin");
      if (($pageboxes !== undefined) && ($pageboxes.hasClass("hide") === false)) {
        $pageboxes.addClass("hide");
        iHidedPageboxes = true;
      } else {
        iHidedPageboxes = false;
      }
      if ((crud !== undefined) && (crud.get("isHidden") === false)) {
        crud.set("hide");
        iHidedCrud = true;
      } else {
        iHidedCrud = false;
      }
      break;
    case "close":
      this.$field.find(".modal-content").removeClass("modalin").addClass("modalout");
      break;
    } // switch
  }; // setVal

  this.setVal = setVal;
}; // Modal

Calendar = function(args) {
  let 
    timestamp, 
    $dest, 
    $content,

    modalId,
    modal,
    modalAttrs,
    $modalcontainer = args.$modalcontainer,
    attrs =           args.attrs,
    $pageboxes =      args.$pageboxes,
    crud =            args.crud,

    getVal, setVal, empty, setCalendar, clickDay, dec, inc;

  dec = function() {
    let date = new Date(timestamp);

    if (date.getMonth() > 0) {
      date.setDate(1);
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setDate(1);
      date.setMonth(11);
      date.setFullYear(date.getFullYear() - 1);
    }

    setCalendar(date.getTime());
    return false;
  }; // dec

  inc = function() {
    let date = new Date(timestamp);

    if (date.getMonth() < 11) {
      date.setDate(1);
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setDate(1);
      date.setMonth(0);
      date.setFullYear(date.getFullYear() + 1);
    }

    setCalendar(date.getTime());
    return false;
  }; // inc

  if (args === undefined) {
    args = {};
  };
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-calendar";
  }
  args.insertLabel = false;

  Component.call(this, args);

  // $content = $("<div>", {class:"spruits-calendar"}).append(
  this.$field.append(
    // $("<span>").html("field name"),
    // $("<span>", {class:"out"}).html("&times;").on("click", function(){ $content.removeClass("calendarSlideIn").addClass("calendarSlideOut"); return false; }),
    $("<table>").append( $("<tbody>").append(
      $("<tr>").append(
        $("<td>").append( $("<i>", {class:"fa fa-angle-left"}).on("click", dec) ),
        $("<td>").attr("colspan", "5"),
        $("<td>").append( $("<i>", {class:"fa fa-angle-right"}).on("click", inc) ),
      ),
      $("<tr>").append( $("<td>").html("Mon"), $("<td>").html("Tue"), $("<td>").html("Wed"), $("<td>").html("Thu"), $("<td>").html("Fri"), $("<td>").html("Sat"), $("<td>").html("Sun") ),
      $("<tr>").append( $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html("") ),
      $("<tr>").append( $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html("") ),
      $("<tr>").append( $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html("") ),
      $("<tr>").append( $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html("") ),
      $("<tr>").append( $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html("") ),
      $("<tr>").append( $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html(""), $("<td>").html("") )
  )));
  $content = this.$field;

  if (attrs !== undefined) {
    modalAttrs = attrs.modal;
  }
  modalId = getId("spruits-cal");
  modal = new Modal({ fieldName:"Calendar", "$modalbody":$content, id:modalId, $container:$modalcontainer, attrs:modalAttrs, $pageboxes:$pageboxes, crud:crud });

  clickDay = function(e) {
    let day = $(this).html(), date = new Date(timestamp);

    date.setDate(day);
    timestamp = date.getTime();
    $dest.val( "" + date.getFullYear() +  "-" + (("00" + (date.getMonth() + 1)).slice(-2))+ "-" + (("00" + date.getDate()).slice(-2)) );
    //$content.children(".out").trigger("click");
    // modal.$field.css("display", "none");
    modal.set("close"); // $field.find(".modal-content").removeClass("modalin").addClass("modalout");
    return false;
  }; // clickDay

  setCalendar = function(ts) {
    let srcdate, mon, year, r, day = 1, dayOfWeek, daysInMonth, row, $day;

    timestamp = ts;

    srcdate = new Date(timestamp);
    mon = Month.getMonStr(srcdate.getMonth()),
    year = srcdate.getFullYear();
    daysInMonth = Month.getDaysInMonth(srcdate),

    $content.find("tr:first-child td:nth-child(2)").html(mon + " " + year); // $(".spruits-calendar tr:first-child td:nth-child(2)").html(mon + " " + year);

    /*$weeks*/
    for (row=3;row<=8;row++) {
      $content.find("tr:nth-child(" + row + ") td").each( function() { $(this).empty().css("cursor", "").off("click"); });
    }

    for (r = 0; r < 6 && day <= daysInMonth; day++) {
      row = $content.find("tr:nth-child(" + (r + 3) + ")");
      srcdate.setDate(day);

      dayOfWeek = srcdate.getDay();

      switch (dayOfWeek) {
      case 0: // su
        $day = row.children("td:nth-child(" + 7 + ")");
        $day.html(day).css("cursor", "pointer").on("click", clickDay);
        r++;
        break;

      default:
        $day = row.children("td:nth-child(" + dayOfWeek + ")");
        $day.html(day).css("cursor", "pointer").on("click", clickDay);
        break;
      } // switch
    } // for (r)
  }; // setCalendar

  getVal = function() {
    return $content;
  }; // getVal

  setVal = function(propName, val) {
    switch(propName) {
    case "field name":
      modal.set("$title", val);
      // $content.children("span:first-child").html(val);
      break;
    default:
    case "val":
    case "date":
      setCalendar(val);
      break;
    case "$dest":
      $dest = val;
      break;
    case "show":
      modal.set("show"); // $field.css("display", "block");
      // modal.$field.find(".modal-content").removeClass("modalout").addClass("modalin");
      //$content.removeClass("calendarSlideOut").addClass("calendarSlideIn");
      break;
    } // switch
  }; // setVal

  empty = function(){
  }; // empty

  this.inc = inc;
  this.dec = dec;
  this.getVal = getVal;
  this.setVal = setVal;   
  this.empty = empty;
}; // Calendar

InputDate = function(args) {
  let 
    cal = args.cal,
    view = args.view,
    name,

    template, templateProcessor, tmplProcessor, 

    getVal, setVal, empty, validate;

  tmplProcessor = function() {
    if (templateProcessor !== undefined) {
      return templateProcessor(this.fieldName, template);
    } else {
      return this.testTemplateProcessor(template);
    }
  }; // tmplProcessor

  Component.call(this, args);
  name = this.name;

  if (view === undefined) {
    this.$field.append(
      $("<input>").attr({"type":"text", "size":"10", maxlength:"10"}), 
      $("<i>", {class:"fa fa-calendar"})
      .on("click", function(){
        if (cal.get("$field").hasClass("calendarSlideIn")) {
          return false;
        }
        cal.set("field name", name);
        cal.set("date", Date.now());
        cal.set("$dest", $(this).prev());
        cal.set("show");
        return false;
      })
    ).css("whiteSpace","noWrap");
  }

  getVal = function(propName) {
    switch(propName){
    default:
      return this.$field.children("input").val();
    case "empty":
      return "";
    }
  }; // getValue

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
  }; // setValue

  empty = function() {
    this.$field.children("input").val("");
  }; // empty

  validate = function() {
    let 
      valid = { valid:true },
      value,
      y, m, d, dateVal, dateVals; // [ year, mon, day ] which is created from the value

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
    } // there is a value in the field

    if (valid.valid === false) {
      valid.invalid = value;
    }

    return valid;
  }; // validate

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
  this.templateProcessor = tmplProcessor;
}; // InputDate

Spinner = function(args) {
  let min, max, initial, padding, tailpadding, doTailpadding, doPadding, get, init;

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

  doTailpadding = function(val) {
    if (tailpadding !== undefined) {
      val = (val + tailpadding).slice(0, tailpadding.length);
    }
    return val;
  }; // doTailpadding

  if (args === undefined) {
    args = {};
  };
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-spinner";
  }
  min = args.min;
  max = args.max;
  initial = args.initial;
  padding = args.padding;
  tailpadding = args.tailpadding;

  if (min === undefined) {
    min = 0;
  }
  if (initial === undefined) {
    initial = min;
  }
  initial = doPadding(initial);
  initial = doTailpadding(initial);

  Component.call(this, args);

  this.$field.append(
    $("<div>", {class:"arrow-up"}).on("click", function(){
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
    }),
    $("<input>").attr(args.attrs.input).val("" + initial), 
    $("<div>", {class:"arrow-down"}).on("click", function(){
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
    })
  );

  get = function(propName) {
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
  }; // get

  init = function() {
    this.$field.children("input").val("" + initial);
  };

  this.get = get;
  this.init = init;
}; // Spinner

TimePicker = function(args) {
  let 
    modes = { "hhmm":true, "hhmmss":true, "hhmmssmicros":true },
    mode = "hhmm", /* configures the spinners which are visible. Optional. */
    hh = new Spinner({ fieldName:"hh", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:24, padding:"0" }),
    mm = new Spinner({ fieldName:"mm", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:59, padding:"0" }),
    ss = new Spinner({ fieldName:"ss", attrs:{ input:{ class:"numdigits-2", maxlength:"2"}}, min:0, max:59, padding:"0" }),
    micros = new Spinner({ fieldName:"micros", attrs:{ input:{ class:"numdigits-6", maxlength:"6"}}, min:0, max:999999, tailpadding:"000000" }),
    $dest,

    modalId,
    modal,
    modalAttrs,
    $modalcontainer = args.$modalcontainer,
    attrs =           args.attrs,
    $pageboxes =      args.$pageboxes,

    setMode, getVal, set;

  micros.$field.children(".arrow-up, .arrow-down").addClass("hide");

  if (args === undefined) {
    args = {};
  };
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-timepicker";
  }
  args.insertLabel = false;
  if (args.mode !== undefined) {
    if (modes[args.mode] === true) {
      mode = args.mode;
    }
  }

  Component.call(this, args);

  /* this.$field.prepend($("<div>").append( 
    $("<span>", {class:"close"}).html("&times;")
    .on("click", function(){
      $(this).parents(".spruits-timepicker").removeClass("timepickerSlideIn").addClass("timepickerSlideOut");
      return false;
    }) 
  )); */
  this.$field.append( 
    $("<div>", {class:"timepicker-container"}).append(
      hh.$field,
      mm.$field,
      ss.$field,
      micros.$field
    ),
    $("<div>", {class:"ok-container"}).append( 
      $("<span>", {class:"ok"}).html("Ok")
    )
    .on("click", function(){
      $dest.val(getVal());
      // $(this).parents(".spruits-timepicker").removeClass("timepickerSlideIn").addClass("timepickerSlideOut");
      //modal.$field.css("display", "none");
      modal.set("close"); // $field.find(".modal-content").removeClass("modalin").addClass("modalout");
      return false;
    })
  );

  if (attrs !== undefined) {
    modalAttrs = attrs.modal;
  }
  modalId = getId("spruits-timepicker");
  modal = new Modal({ fieldName:"TimePicker", "$modalbody":this.$field, id:modalId, $container:$modalcontainer, attrs:modalAttrs, $pageboxes:$pageboxes });

  setMode = function(m) {
    let microsOffset, fontSize, marginTop;
    
    hh.init();
    mm.init();

    switch (m) {
    default:
    case "hhmm":
      ss.$field.addClass("hide");
      micros.$field.addClass("hide");
      break;
    case "hhmmss":
      ss.init();
      ss.$field.removeClass("hide");
      micros.$field.addClass("hide");
      break;  
    case "hhmmssmicros":
      ss.init();
      micros.init();
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
  }; // setMode

  getVal = function() {
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
  }; // getVal

  set = function(propName, val) {
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
  }; // set

  this.set = set;

  setMode(mode);
}; // TimePicker

InputTime = function(args) {
  let
    modes = { "hhmm":true, "hhmmss":true, "hhmmssmicros":true },
    mode = "hhmm", /* configures the side (class) of the input field. Optional. */  
    maxlength = { "hhmm": "5", "hhmmss":"8", "hhmmssmicros":"15" },
    timepicker = args.timepicker,
    view = args.view,
    name,
    maxH = 23,

    template, templateProcessor, tmplProcessor, 

    getVal, setVal, empty, validate;

  tmplProcessor = function() {
    if (templateProcessor !== undefined) {
      return templateProcessor(this.fieldName, template);
    } else {
      return this.testTemplateProcessor(template);
    }
  }; // tmplProcessor

  if (args.mode !== undefined) {
    if (modes[args.mode] === true) {
      mode = args.mode;
    }
  }

  if (args.maxH === 24) {
    maxH = args.maxH;
  }

  Component.call(this, args);
  name = this.name;

  if (view === undefined) {
    this.$field.append(
      $("<input>").addClass("spruits-inputtime-" + mode).attr("maxlength", maxlength[mode]),
      $("<i>", {class:"fa fa-clock-o"})
      .on("click", function(){
        /* if (timepicker.$field.hasClass("timepickerSlideIn")) {
          return false;
        } */
        timepicker.set("$dest", $(this).prev());
        timepicker.set("label", name);
        //timepicker.$field.removeClass("timepickerSlideOut").addClass("timepickerSlideIn");
        timepicker.set("show");
        timepicker.set("spinners", mode);
        return false;
      })
    );
  }

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
  }; // getVal
  
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
  }; // setVal

  empty = function() {
    this.$field.children("input").val("");
  };

  validate = function() {
    let
      valid = { valid:true },
      value,
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
    }

    return valid;
  }; // validate

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
  this.templateProcessor = tmplProcessor;
}; // InputTime

InputDateAndTime = function(args) {
  let 
    inputdate, inputtime, 
    mode = args.mode, 
    cal = args.cal, 
    timepicker = args.timepicker,
    view = args.view,

    template, templateProcessor, tmplProcessor, 

    getVal, setVal, empty, validate; // value = { inputdate:val, inputtime:val }

  tmplProcessor = function() {
    if (templateProcessor !== undefined) {
      return templateProcessor(this.fieldName, template);
    } else {
      return this.testTemplateProcessor(template);
    }
  }; // tmplProcessor

  Component.call(this, args);

  if (view === undefined) {
    this.$field.addClass("spruits-inputdateandtime");
    inputdate = new InputDate({ fieldName:this.name, fieldClass:"", insertLabel:false, cal:cal });
    inputtime = new InputTime({ fieldName:this.name, fieldClass:"", insertLabel:false, mode:mode, timepicker:timepicker });

    this.$field.append(inputdate.$field, inputtime.$field);
  } else {
    inputdate = view.fields[this.name].get("inputdate");
    inputtime = view.fields[this.name].get("inputtime");
  }

  getVal = function(propName) {
    switch (propName) {
    case "inputdate":
      return inputdate;
      break;
    case "inputtime":
      return inputtime;
      break;
    case "empty":
      return "";
      break;
    default:
      return { inputdate:inputdate.get("val"), inputtime:inputtime.get("val") };
      break;
    } // switch
  }; // getVal 

  setVal = function(propName, val) {
    if (val === undefined) {
      inputdate.set("val", propName.inputdate);
      inputtime.set("val", propName.inputtime);
    }
    else {
      switch(propName) {
      case "val":
        inputdate.set("val", val.inputdate);
        inputtime.set("val", val.inputtime);
        break;
      case "testcaseTemplate":
        template = val.template;
        templateProcessor = val.templateProcessor;     
        break;
      } // switch (propName)
    }
  }; // setVal

  empty = function() {
    inputdate.set("empty");
    inputtime.set("empty");
  }; // empty

  validate = function() {
    let
      valid = { valid:true }, validInputdate, validInputtime;

    validInputdate = inputdate.get("valid");
    validInputtime = inputtime.get("valid");

    if (validInputdate.valid === false) {
      valid.valid = false;
      valid.invalid = { "inputdate":inputdate.get("val") };
    }

    if (validInputtime.valid === false) {
      if (valid.invalid === undefined) {
        valid.valid = false;
        valid.invalid = { "inputtime":inputtime.get("val") };
      } else {
        valid.invalid["inputtime"] = inputtime.get("val");
      }
    }

    return valid;
  }; // validate

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
  this.templateProcessor = tmplProcessor;
}; // InputDateAndTime

getResponsiveTable = function(myFields, colTypes) {
  let 
    myType, myArgs, myFieldsLen, i, addShowClicks, 

    getColTypes;

  getColTypes = function(colTypes, useTable) {
    let ct, i, colTypesLen;

            if (useTable === true) {
              return colTypes;
            }
            colTypesLen = colTypes.length;

            ct = { type:CustomType, args:{ 
              attrs:{ $screen:{ class:"spruits-container padding hide" }, $row:{ class:"field-row-nocolors dotted last" }, label:{ class:"rowtitle" } },
              fields:{}
            }};
            for (i=0;i<colTypesLen;i++) {
              ct.args.fields[colTypes[i].title] = { type:colTypes[i].type, args:colTypes[i].args };
            }

    return ct;
  }; // getColTypes

  myFieldsLen = myFields.length;

          if (mediaQuery(800)) {
            myType = Table;
            myArgs ={ numRows:myFieldsLen, colTitle:true, 

              colTypes: getColTypes(colTypes, true /* useTable */), 

              attrs:{ rowtitle:myFields }
            };
            addShowClicks = false;
          } else { // VW less than 800px
            myType = CustomType;
            myArgs = {
              attrs:{ $screen:{ class:"spruits-container padding" }, $row:{ class:"field-row-nocolors dotted last" } },
              fields:{}
            };
            for (i=0;i<myFieldsLen;i++) {
              myArgs.fields[ myFields[i] ] = getColTypes(colTypes);
            }
            addShowClicks = true;
          }
  return { myType:myType, myArgs:myArgs, addShowClicks:addShowClicks };
}; // getResponsiveTable

Table = function(args) {
  let
    colTitle =    args.colTitle,
    rowNum =      args.rowNum,
    numRows =     args.numRows,
    cellNum =     args.cellNum,
    colTypes =    args.colTypes, // [ { title:"Col Title", type:component, args:{ args of the component } }, ... ]
    attrs =       args.attrs,
    view =        args.view,
    
    table, container,

    template, templateProcessor, tmplProcessor, 

    createComponentTable, createPositionView, createTableview, getVal, setVal, empty, validate;

  tmplProcessor = function() {
    if (templateProcessor !== undefined) {
      return templateProcessor(this.name, template, numRows);
    } else {
      return this.testTemplateProcessor(template);
    }
  }; // tmplProcessor

  createComponentTable = function(colTypes, numRows, container, view) {
    return Array(numRows).fill(null).map((row, rowI) => colTypes.map((col, colI) => { 
      let itemName;
      col.args.insertLabel = (col.args.insertLabel === undefined) ? false : col.args.insertLabel;
      col.args.fieldClass = (col.args.fieldClass === undefined) ? "" : col.args.fieldClass;
      itemName = rowI + "-" + ((col.title !== undefined) && (col.title.length)) ? col.title : "" + colI;
      if (view === undefined) {
        container.createField(itemName, col.type, col.args);
        return container.fields[itemName];
      } else {
        return new col.type({ fieldName:itemName, view:container });
      }
  }))};

  // src:[ row, row, ... ], row:[ component, component, ... ]
  // $dest
  // attrs:{ table:{ position:{ create:boolean, table, coltitle, tr, td }}}, 
  //   table:{}, coltitle:{ posi:[ [ "col-style", "col-style", ... ], [], ... ], titles:[ "", "", ... ]}
  createPositionView = function(src, $dest, attrs) {
    let 
      positionAttr = attrs.table.position, 
      $table = $("<div>").attr(positionAttr.table ? positionAttr.table : {});

    if (positionAttr.coltitle !== undefined) {
      positionAttr.coltitle.posi.map((posi, posiI) => positionAttr.coltitle.titles.map((title, titleI) => $table.append($("<div>").html(title).attr({ "style": "position:absolute;" + posi[titleI] })) ));
    }

    $table.append( src.map((row, rowI) => {
      return $("<span>")
        .attr(isString(positionAttr.tr[rowI]) ? { "style": "position:relative;" + positionAttr.tr[rowI] } : positionAttr.tr[rowI])
        .append(attrs.rowtitle !== undefined ? $("<div>").html(attrs.rowtitle[rowI]).attr({ "style":"position:absolute;" + positionAttr.rowtitle[rowI] }) : [])
        .append(row.map((comp, i) => { 
          if ( positionAttr.td !== undefined) {
            isString(positionAttr.td[i]) ? comp.$field.attr({ "style":"position:absolute;" + positionAttr.td[i] }) : comp.$field.attr(positionAttr.td[i]);
          }
          return comp.$field;
      }));
    }));

    $dest.append($table);
  };  // createPositionView

  createTableview = function(srcArg, $dest, rowNum, colTitle, cellNum, rowTitle, colTitles) {
    const $table = $("<table>");
    let ct = 0, src;
  
    src = colTitle ? [colTitles].concat(srcArg) : srcArg.slice(); // colTitles-array is added as the first line

    if (rowNum === true) {
      if (colTitle === true) {
        $table.addClass("spruit-table-rownum");
      } else {
        $table.addClass("spruit-table-rownum-nocoltitle");
      }
    } else if (cellNum === true) {
      $table.addClass("spruit-table-cellnum");
    }

    $table.append(
      src.map((li, i) => { 
        const $tr = $("<tr>");
        if (colTitle === true && i === 0) {
          ct = 1;
          if(rowTitle !== undefined) {
            $tr.append( $("<th>") );
          }
          return $tr.append( li.map((val,i) => $("<th>").html(val)));
        } else {
          if(rowTitle !== undefined) {
            $tr.append( $("<td>", { class:"spruit-rowtitle" }).html(rowTitle[i - ct]) );
          }
          return $tr.append(
            li.map(val => $("<td>").append( isString(val) ? val : val.$field ))
          ); 
        }} ) // else, =>, lists.map
    );

    $dest.append($table);
  } // createTableview

  Component.call(this, args);

  if (view !== undefined) {
    numRows = view.fields[this.name].get("numRows");
    colTypes = view.fields[this.name].get("colTypes");
    container = view.fields[this.name].get("container");
  } else {
    container = new Container();
    container.$screen = this.$field;
  }

  // colTitles = colTypes.map(val => val.title);

  table = createComponentTable(colTypes, numRows, container, view);

  if (view === undefined) {
    if (attrs !== undefined && attrs.table !== undefined && attrs.table.position !== undefined && attrs.table.position.create === true) {
      createPositionView(table, this.$field, attrs);
    } else {
      createTableview(table, this.$field, rowNum, colTitle, cellNum, (attrs !== undefined) ? attrs.rowtitle : undefined, colTypes.map(val => val.title));
    }
  }

  getVal = function(propName) {
    switch(propName) {
    default:
      return table.map(row => row.map(comp => comp.get("val")));
      break;
    case "empty":
      return table.map(row => row.map(col => col.get("empty")));
      break;
    case "numRows":
      return numRows;
      break;
    case "colTypes":
      return colTypes;
      break;
    case "container":
      return container;
      break;
    } // switch
  }; // getVal

  setVal = function(propName, val) {
    if (val === undefined) {
      table.forEach((row, rowI) => row.forEach((col, colI) => col.set("val", propName[rowI][colI])));
    }
    else {
      switch(propName) {
      case "val":
        table.forEach((row, rowI) => row.forEach((col, colI) => col.set("val", val[rowI][colI])));
        break;
      case "testcaseTemplate":
        template = val.template;
        templateProcessor = val.templateProcessor;     
        break;
      } // switch (propName)
    }
  }; // setVal

  empty = function() {
    table.forEach(row => row.forEach(comp => comp.empty()));
  }; // empty

  validate = function() {
    let
      compValid, valid = { valid:true };

    table.forEach((row, rowI) => row.forEach((comp, colI) => {
      compValid = comp.get("valid");
      if (compValid.valid === false) {
        valid.valid = false;
        if (valid.invalid === undefined) {
          valid.invalid = [];
        }
        valid.invalid.push({ rowI:rowI, colI:colI, value:compValid.invalid });
      }
    }));
    return valid;
  }; // validate

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
  this.templateProcessor = tmplProcessor;
}; // Table

TabSheet2 = function(args) {
  let
    tabNames =        args.tabs,
    $modalcontainer = args.$modalcontainer,
    fields =          args.fields,      // When all tabs are equal, this contains field definitions. For example, fields of Subscription Service
    view =            args.view,
    attrs =           args.attrs,
    $pageboxes =      args.$pageboxes,
    crud =            args.crud,

    i,
    tab,
    modalId,
    modalAttrs,
    modal,
    container,
    val,
    tabButtons = {},
    $tabButtons,
    tsObj,

    template, templateProcessor, tmplProcessor, 

    init, getModalValues, getVal, setVal, empty, validate;

  tmplProcessor = function() {
    if (templateProcessor !== undefined) {
      return templateProcessor(this.name, tabNames, template);
    } else {
      return this.testTemplateProcessor(template);
    }
  }; // tmplProcessor

  init = function() {
    val = {};
    for (tab in tabNames) {
      val[tab] = {};
      for (i in container.fields) {
        val[tab][i] = container.fields[i].get("empty");
      } // for(i)
    } // for(tab)
  }; // init

  getModalValues = function(e) {
    let field;

    for (field in container.fields) {
      val[tab][field] = container.fields[field].get("val");
    }
  }; // getModalValues

  Component.call(this, args);
  tsObj = this;

  if (view === undefined) {
    container = new Container();
    for (i in fields) {
      container.createField(i, fields[i].type, fields[i].args);
    }
    container.insertFields();

    modalId = getId("spruits-ts");
    if (attrs !== undefined) {
      modalAttrs = attrs.modal;
    }
    modal = new Modal({ fieldName:this.name, $modalbody:container.$screen, closeCallback:getModalValues, id:modalId, $container:$modalcontainer, attrs:modalAttrs, 
                        $pageboxes:$pageboxes, crud:crud });

    $tabButtons = $("<ul>", {class:"tabbuttons"});
    for (i in tabNames) {
      let tabId = getId("spruits-ts");
      tabButtons[i] = $("<li>", {class:"tabbutton"}).append( $("<a>", {href:"#" + tabId}).html(i) ).on("click", function(e){ 
        // open tab

        let field;

        tab = $(this).children("a").html();
        modal.set("$title", tsObj.name + " : " + tab);
        for (field in container.fields) {
          container.fields[field].set("val", val[tab][field]);
        }
        modal.set("show");
        return false;
      });
      $tabButtons.append( tabButtons[i] );
    } // for(i)
    this.$field.append($tabButtons).addClass("spruits-tabsheet");
  } // (view === undefined)
  else {
    tabNames = view.fields[this.name].get("tabNames");
    container = view.fields[this.name].get("container");
  }

  init();

  getVal = function(propName) {
    switch(propName) {
    case "tabNames":
      return tabNames;
    case "container":
      return container;
    case "tabButtons":
      return tabButtons;
    case "empty":
      init();
    case "val":
    default:
      return JSON.parse(JSON.stringify(val));
    }
  }; // getVal

  setVal = function(propName, valArg) {
    if (valArg === undefined) {
      val = propName;
    }
    else {
      switch(propName) {
      case "val":
        val = valArg;
        break;
      case "testcaseTemplate":
        template = valArg.template;
        templateProcessor = valArg.templateProcessor;     
        break;
      } // switch (propName)
    }
  }; // setVal

  empty = function() {
    init();
  }; // empty

  validate = function() {
    return { valid:true };
  }; // validate

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
  this.templateProcessor = tmplProcessor;
}; // TabSheet2

TabSheet = function(args) {
  let
    tabs =        args.tabs,        // { "tab1":{ fields:{ ... }, $screen:$screen1 }, "tab2":{ fields:{ ... }, $screen:$screen2 }, ... } or { "tab1":true, "tab2":true, ... }
    activate =    args.activate,    // TBA
    $modalcontainer = args.$modalcontainer,
    fields =      args.fields,      // When all tabs are equal, this contains field definitions. For example, fields of Subscription Service
    view =        args.view,
    attrs =       args.attrs,
    $pageboxes =  args.$pageboxes,
    crud =        args.crud,

    $tabButtons = $("<ul>", {class:"tabbuttons"}),
    tabButtons = {},
    modal,
    modalAttrs,
    $tabButton, 
    tab,
    tabId,
    modalId,
    name,
    Tab, tabCreator,                // Equal tabs are created by Tab

    getValues, setValues, getVal, setVal, empty;

  Tab = function(fields, tabs) { // fields = { "fieldName":{ component: < ComponentType >, args:{} }, ... }, tabs = { "tab1":true, "tab2":true, ... }
    let tabview = new Container(), i, init, create, getVal;
          
    init = function() {
      let t = new Container();
  
      for (i in fields) {
        t.createField(i, fields[i].component, { view:tabview });
      }
      return t;
    }; // init

    create = function() {
      let t = init();    
      t.$screen = tabview.$screen;
      return t;
    }; // create

    if (view === undefined) {
      for (i in fields) {
        tabview.createField(i, fields[i].component, fields[i].args);
      }
      tabview.insertFields();
    } else {
      tabview = view.fields[name].get("tabview");
    }

    for (i in tabs) {
      tabs[i] = create(); // Converts tabs to { "tab1":{ fields:{ ... }, $screen:$screen1 }, "tab2":{ fields:{ ... }, $screen:$screen2 }, ... } according the fields.
    }

    getVal = function(propName) {
      return tabview;
    };

    this.$screen = tabview.$screen;
    this.getVal = getVal;
  }; // Tab

  getValues = function(e, title) {
    let 
      i,
      tab = title.split(" : ")[1],
      val;

      for (i in tabs[tab].fields) {
        if (tabs[tab].fields.hasOwnProperty(i)) {
          val = tabs[tab].fields[i].get("val");
          if (isString(val)) {
            console.log("getValues, tab=" + tab + ", field=" + i + ", val=" + val);
          } else {
            console.log("getValues, tab=" + tab + ", field=" + i + ", val=" + JSON.stringify(val));
          }
        }
      } // for (i)
  }; // getValues

  setValues = function(tab, cleanCache) {
    let 
      i,
      val;

      for (i in tabs[tab].fields) {
        if (tabs[tab].fields.hasOwnProperty(i)) {
          val = tabs[tab].fields[i].set("fromCache", cleanCache);
          console.log("setValues, tab=" + tab + ", field=" + i + ", val=" + val);
        }
      } // for (i)
  }; // setValues

  Component.call(this, args);
  name = this.name;

  if (view === undefined) {
    this.$field.append($tabButtons).addClass("spruits-tabsheet");
  } else {
    fields = view.fields[name].get("fields");
    tabs = view.fields[name].get("tabs");
  }

  if (fields !== undefined) {
    tabCreator = new Tab(fields, tabs);
  }

  if (view === undefined) {
    for (tab in tabs) {
      tabId = getId("spruits-ts");
      tabButtons[tab] = $("<li>", {class:"tabbutton"}).append( 
        $("<a>").attr("href", "#" + tabId).html(tab)
      );
      $tabButtons.append( 
        tabButtons[tab]
        .on("click", function(e){
          e.preventDefault();
          e.stopPropagation();

          let 
            id = $(this).children("a").attr("href"), 
            tab = $(this).children("a").html();
          if (fields === undefined) {
            modal.set("$modalbody", tabs[tab].$screen);
          }
          modal.set("$title", name + " : " + tab);
          setValues(tab, true /* clean cache */);
          modal.set("show");
          return false;
        })
      );
    } // for (tab)

    modalId = getId("spruits-ts");
    if (tabCreator === undefined) {
      console.log("TabSheet, args.view=" + JSON.stringify(args.view));
    }
    if (attrs !== undefined) {
      modalAttrs = attrs.modal;
    }
    modal = new Modal({ fieldName:this.name + " : " + tab, "$modalbody":tabCreator.$screen, closeCallback:getValues, id:modalId, $container:$modalcontainer, attrs:modalAttrs, 
                        $pageboxes:$pageboxes, crud:crud });
  } // view === undefined

  getVal = function(propName) {
    let val, tab, field;

    switch(propName) {
    case "tabview":
      val = tabCreator.getVal("tabview");
      break;
    case "tabs":
      val = {};
      for (tab in tabs) {
        val[tab] = true;
      } // for (tab)
      break;
    case "fields":
      val = fields;
      break;
    case "tabButtons":
      val = tabButtons;
      break;
    case "val":
    default:
      val = {};
      for (tab in tabs) {
        if (tabs.hasOwnProperty(tab)) {
          val[tab] = {};
          for (field in tabs[tab].fields) {
            if (tabs[tab].fields.hasOwnProperty(field)) {
              val[tab][field] = tabs[tab].fields[field].get("cache");
            }
          } // for (field)
        }
      } // for (tab)
      break;
    case "empty":
      val = {};
      for (tab in tabs) {
        if (tabs.hasOwnProperty(tab)) {
          val[tab] = {};
          for (field in tabs[tab].fields) {
            if (tabs[tab].fields.hasOwnProperty(field)) {
              val[tab][field] = tabs[tab].fields[field].get("empty");
            }
          } // for (field)
        }
      } // for (tab)
      break;
    } // switch

    return val;
  }; // getVal

  setVal = function(val) {
    console.log("TabSheet.setVal, name=" + name);
  }; // setVal

  empty = function() {
  }; // empty

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
}; // TabSheet

CustomType = function(args) {
  let fields, i, screenRowClass, view, viewObj, callback, crud,
    getVal, setVal, empty, validate;

  if (args !== undefined) {
    fields = args.fields;
    view = args.view;
    if (args.attrs !== undefined && args.attrs.$row !== undefined) {
      screenRowClass = args.attrs.$row.class;
    }
    callback = args.callback;
    crud = args.crud;
  }
  Component.call(this, args);
  if (args.name === undefined) {
    args.name = this.name; // Component has set this.name, Container looks for and sets it from args.
  }
  Container.call(this, args);
  this.crud = crud;

  if (view !== undefined) {
    fields = view.fields[this.name].get("fields");
    viewObj = view.fields[this.name].get("this");
  }
  if (fields !== undefined) {
    for (i in fields) {
      if (fields.hasOwnProperty(i)) {
        if (view === undefined) {
          this.createField(i, fields[i].type, fields[i].args);
        } else {
          this.createField(i, fields[i].type, { view:viewObj });
        }
      }
    } // for (i)

    if (view === undefined) {
      if (callback !== undefined) {
        callback(this);
      } else {
        this.insertFields(screenRowClass);
        this.$field.append(this.$screen);
      }
    }
  } // if (fields)

  getVal = function(propName) {
    let val, i;

    switch (propName) {
    case "fields":
      return fields;
      break;
    case "this":
      return this;
      break;
    default:
      val = {};
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          val[i] = this.fields[i].get("val");
          console.log("CustomeType.getVal[" + i + "] = " + val[i]);
        }
      } // for (i)
      break;
    case "empty":
      val = {};
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          val[i] = this.fields[i].get("empty");
          console.log("CustomeType.getVal[" + i + "] = " + val[i]);
        }
      } // for (i)
      break;
    } // switch

    return val;
  }; // getVal

  setVal = function(propName, val) {
    let i;

    if (val === undefined) {
      val = propName;
    }
    switch (propName) {
    default:
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          this.fields[i].set("val", val[i]);
        }
      } // for (i)
      break;
    } // switch

  }; // setVal

  empty = function() {
    let i;

    for (i in this.fields) {
      if (this.fields.hasOwnProperty(i)) {
        this.fields[i].empty();
      }
    } // for (i)
  }; // empty

  validate = function() {
    return { valid:true };
  }; // validate

  this.getVal = getVal;
  this.setVal = setVal;
  this.empty = empty;
  this.validate = validate;
}; // CustomType

Entity = function(name, tabs) {
  this.fields = {};
  this.$screen = $("<div></div>").addClass("spruit-screen");
  this.menu =   $("<li></li>").append( $("<div></div>").html(name) );

  this.name = name;
  this.tabs = tabs;

  this.addField = function(fieldName, type, args, tab) {
    let field;

    if (args === undefined) {
      args = {};
      args["fieldName"] = fieldName;
    }

    if (args.fieldName === undefined) {
      args["fieldName"] = fieldName;
    }

    field = new type(args);

    if (this.tabs !== undefined && tab !== undefined) {
      this.tabs[tab].addField(fieldName, type, args);
    } else { 
      this.$screen.append(field.$field);
    }

    this.fields[fieldName] = field;
  };

  this.createField = function(fieldName, type, args) {
    if (args === undefined) {
      args = {};
      args["fieldName"] = fieldName;
    }

    if (args.fieldName === undefined) {
      args["fieldName"] = fieldName;
    }

    if (args.crud === undefined) {
      args.crud = this.crud; // PageManager has set the property
    }

    this.fields[fieldName] = new type(args);
  };

  this.addBr = function(tab) {
    if (this.tabs !== undefined && tab !== undefined) {
      this.tabs[tab].addBr();
    } else {
      this.$screen.append("<br>");
    }
  };

  this.createTabSheet = function(activate) {
    let ts = new TabSheet({ fieldName: this.name + " Maintenance", fieldClass:"spruit-screen", tabs:this.tabs, activate:activate });
    this.$screen = ts.$field;
  };

  this.addScreenLabel = function() {
    this.$screen.prepend( $("<label></label>").html(this.name + " Maintenance"), "<br>" );
  };

  this.insertFields = function(rowClass, lastRowClass) {
    let i;

    if (rowClass === undefined) {
      rowClass = "screen-row";
    }

    for (i in this.fields) {
      if (this.fields.hasOwnProperty(i)) {
        this.$screen.append( 
          $("<div>", {class:rowClass}).append( 
            this.fields[i].$field 
          ) 
        );
      }
    } // for (i)

    this.$screen.find(":last-child").addClass("last");
  };

  this.load = function(screenUrl, screens) {
    let fake, screen = screens[screenUrl];

    if (screen !== undefined || fake === true) {
      // spruits.screen = spruits.fake.screen[screenUrl];

      console.log("Entity.load: creating " + screenUrl);

      if (screen === undefined) {
        this.$screen.append("<p>TBA</p>");
        this.addScreenLabel();
      } else {
        screen.create(this);
      }
    } else {
      $.getScript(screenUrl)
        .done(function(script, textStatus) {
          console.log("loading " + screenUrl + ":" + textStatus);

          spruits.screen.create(this);
          delete spruits.screen.create;
        })
        .fail(function( jqxhr, settings, exception ) {
          console.log("getScript failed: " + screenUrl);
        });
    }
  };

  this.getProp = function(propName) {
    let val, i, first, str, valid;

    switch (propName) {
    case "val":
      val = {};
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          val[i] = this.fields[i].get("val");
        }
      } // for (i)
      break;
    case "key":
      val = {};
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          if (this.fields[i].get("isKey") === true) {
            val[i] = this.fields[i].get("val");
          }
        }
      } // for (i)
      break;
    case "template":
      first = true;
      str = "{\n";
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          if (first === false) {
            str += ",\n";
          } else {
            first = false;
          }
          if (this.fields[i].templateProcessor !== undefined) {
            str += this.fields[i].templateProcessor();
          }
        }
      }
      str += "\n}";
      val = str;
      break;
    case "valid":
      val = { valid:true, invalid:{} };
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          valid = this.fields[i].get("valid");
          if (valid.valid !== true) {
            val.valid = false;
            val.invalid[i] = valid.invalid;
          }
        }
      } // for(i)
      break;
    } // switch(propName)

    return val;
  }; // getProp

  this.setProp = function(propName, val) {
    let i;

    switch (propName) {
    case "val":
      for (i in this.fields) {
        if (this.fields.hasOwnProperty(i)) {
          this.fields[i].set("val", val[i]);
        }
      } // for (i)
      break;
    } // switch(propName)
  }; // setProp

}; // Entity
  
Container = function(args) {
    let name, attrs;

    if (args !== undefined) {
      name = args.name;
      attrs = args.attrs;
    }

    Entity.call(this, name);

    this.$screen.removeClass().addClass("spruits-container");
    if (attrs !== undefined && attrs.$screen !== undefined) {
      this.$screen.attr(attrs.$screen);
    }
}; // Container

Menu = function(args) {
  let 
    aClickCallback,
    name2url = args.urlMap,
    showSubmenu = function(e) {
      e.preventDefault();
      e.stopPropagation();

      $(".log").append("showSubmenu: " + $(e.target).prev().html() + "<br>");

      if ($(this).hasClass("fa-angle-down")) {
        $(this).next().addClass("show-dropdown-content");
        $(this).removeClass("fa-angle-down").addClass("fa-angle-up");
      } else {
        $(this).next().removeClass("show-dropdown-content");
        $(this).removeClass("fa-angle-up").addClass("fa-angle-down");
      }
    },
    collapseMenu = function(e, $itemClicked) {
      let $menu = $itemClicked.parents(".spruits-menubar"), $dropdown = $itemClicked.parents(".dropdown");

      console.log("collapseMenu");
      $(".log").append("collapseMenu: " + $itemClicked.html() + "<br>");

      e.preventDefault();
      e.stopPropagation();

      $menu.removeClass("showdropdown");
      $dropdown.removeClass("show");
      $menu.find("ul").removeClass("show-dropdown-content");
      $menu.find("i").each(function(){
        if ($(this).hasClass("fa-angle-up")) {
          $(this).removeClass("fa-angle-up").addClass("fa-angle-down");
        }
      });
    },
  $menu2 = args.$menu,
  map = function(name) {
    return name2url[name];
  },
  get = function(propName) {
    return $menu2;
  },
  set = function(propName, val) {
    switch (propName) {
    case "i":
      if (val === undefined) {
        val = "fa-angle-down";
      }
      //$(".spruits-menubar i").addClass("fa " + val).on("click", showSubmenu);
      $menu2.find("i").addClass("fa " + val).on("click", showSubmenu);
      break;
    case "a":
      aClickCallback = val;
      $menu2.find("a:only-child").attr("href", "javascript:;").on("click", function(e){ 
        collapseMenu(e, $(this));
        if (aClickCallback !== undefined) {
          aClickCallback(e, $(this));
        } 
      }); // on.click
      break;
    case "$menu2":
      $menu2 = val;
      break;
    } // switch
  };
  
  this.showSubmenu = showSubmenu;
  this.collapseMenu = collapseMenu;
  this.map = map;
  this.get = get;
  this.set = set;
}; // Menu

Crud = function(args) {
  const 
    CREATE_PENDING = 0, CREATE_OK = 1, CREATE_NOK = 2, CREATE_VALID_NOK = 3,
    READ_PENDING = 0, READ_OK = 1, READ_NOK = 2;

  let 
    attrs, $modalcontainer, $pageboxes, crudObj, pm, entity, $log, notification, 
    status, valid,

    $icon, buttons = {}, $buttons, modalAttrs, modalId, modal, 

    notificationMap = { 
       "1":  "successful", 
      "10": "exists already", 
      "11": "not found",

      "valid.valid !== true": "validation failed"
    },

    send, buttonClickHandler, modalClosed, getVal, setVal;

  send = function(msg) {
    $.ajax({
      type: "POST",
      url: "/crud",
      contentType: "application/json",
      data: JSON.stringify(msg),

      success: function(response) { 
        console.log("Crud.send.success, response=" + JSON.stringify(response) + "\n   entity.name=" + entity.name);

        switch (response.action) {
        case "C":
          if (response.resultCode === "1") {
            status = CREATE_OK;
            modal.set("close");
          } else {
            status = CREATE_NOK;
          }
          notification.show({ text: (response.action + ": " + notificationMap[response.resultCode]) });
          break;
        case "R":
          if (response.resultCode === "1") {
            status = READ_OK;
            modal.set("close");
            entity.setProp("val", response.data);
          } else {
            status = READ_NOK;
          }
          notification.show({ text: (response.action + ": " + notificationMap[response.resultCode]) });
          break;
        case "U":
          break;
        case "D":
          break;
        } // switch(response.action)
      }, // success
      error: function(jqXHR, exception) { console.log(jqXHR.status); }
    });
  }; // send

  buttonClickHandler = function() {
    let val, action;

    console.log("Crud.buttonClickHandler=" + $(this).html() + ", " + entity.name);

    action = $(this).html();

    switch(action) {
    case "C":
      valid = entity.getProp("valid");
      if (valid.valid !== true) {
        notification.show({ text: (action + ": " + notificationMap["valid.valid !== true"]) });
        status = CREATE_VALID_NOK;
        console.log("buttonClickHandler, valid=" + JSON.stringify(valid));
      } else {
        val = entity.getProp("val");
        if ($log !== undefined) {
          $log.append("Crud.buttonClickHandler=" + $(this).html() + ", " + entity.name + "<br>, val=" + JSON.stringify(val) + "<br>");
        }
        status = CREATE_PENDING;
        send({ action:action, entity:entity.name, data:val });
      }
      break;

    case "R":
      val = entity.getProp("key");
      if ($log !== undefined) {
        $log.append("Crud.buttonClickHandler=" + $(this).html() + ", " + entity.name + "<br>, val=" + JSON.stringify(val) + "<br>");
      }
      status = READ_PENDING;
      send({ action:action, entity:entity.name, data:val });
      break;

    case "U":
      break;

    case "D":
      break;
    } // switch(action)

    return false;
  };

  modalClosed = function(e, modaltitle) {
    entity = undefined;
    crudObj.set("show");
  };

  if (args === undefined) {
    args = {};
  }
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-crud";
  }
  attrs =           args.attrs;
  $modalcontainer = args.$modalcontainer;
  $pageboxes =      args.$pageboxes;
  pm =              args.pm;
  notification =    args.notification;

  Component.call(this, args);
  crudObj = this;

  buttons["create"] = $("<i>", { class:"crud-button" }).html("C").on("click", buttonClickHandler);
  buttons["read"] =   $("<i>", { class:"crud-button" }).html("R").on("click", buttonClickHandler);
  buttons["update"] = $("<i>", { class:"crud-button" }).html("U").on("click", buttonClickHandler);
  buttons["delete"] = $("<i>", { class:"crud-button" }).html("D").on("click", buttonClickHandler);
  $buttons = $("<div>", { class:"spruits-crud-modal-content" }).append(buttons.create, buttons.read, buttons.update, buttons.delete);

  if (attrs !== undefined) {
    modalAttrs = attrs.modal;
  }
  modalId = getId("spruits-crud");
  modal = new Modal({ fieldName:"CRUD", $modalbody:$buttons, id:modalId, $container:$modalcontainer, attrs:modalAttrs, $pageboxes:$pageboxes, crud:crudObj /*, closeCallback:modalClosed */ });

  $icon = $("<i>", { class:"fa fa-database" }).on("click", function(){
    entity = pm.get("entity");
    modal.set("show");
    return false;
  });

  getVal = function(propName) {
    switch(propName) {
    case "isHidden":
      return crudObj.$field.hasClass("fadeOut");
      break;
    case "status":
      return status;
      break;
    }
  }; // getVal

  setVal = function(propName, val) {
    switch(propName) {
    case "show":
      crudObj.$field.removeClass("fadeOut").addClass("fadeIn");
      break;
    case "hide":
      crudObj.$field.removeClass("fadeIn").addClass("fadeOut");
      break;
    case "$log":
      $log = val;
      break;
    }
  }; // setVal

  this.$field.append($icon);
  this.getVal = getVal;
  this.setVal = setVal;
}; // Crud

Notification = function(args) {
  let 
    $content = $("<div>", { class:"content" }),
    show;

  if (args === undefined) {
    args = {};
  }
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-notification hide";
  }
  if (args.$field === undefined) {
    args.$field = $("<div>");
  }

  show = function(args) {
    let txt = args.text, notificationObj = this;

    if(this.$field.hasClass("fadeIn")){
      return false;
    }
    $content.html(txt);
    this.$field.addClass("fadeIn");
    setTimeout(function(){
      notificationObj.$field.removeClass("fadeIn");
      $content.html("");
    }, 2000);
    return true;
  }; // show

  Component.call(this, args);
  this.$field.append($content	);
  this.show = show;
}; // Notification

PageManager = function(args) {
  let
    urlMap,
    screens,
    $container, pages=[], pagesI=-1, 
    pageboxes=[], $pageboxes,
    $home, $homepage, frames=[],
    $arrowRight, $arrowLeft, // Page Left/Right - swipes for non-touch devices
    $menu, menu, menuItemClick, cal, thetimepicker, crud, notification,
    createPage, get, set, deletePage, show;

  urlMap =  args.urlMap;
  screens = args.screens;
  $menu =   args.$menu;
  $container = args.$container; // $("body");
  $homepage = $("<div>", { class:"homepage" });
  $pageboxes = $("<ul>", { class:"pageboxes" });
  $container.append($homepage, $pageboxes);
      
  $home = $("<i class=\"fa fa-home myhome\"></i>")
    .on("click", function(e){
      e.preventDefault();
        
      if ($home.hasClass("myhome-2x")) {
        if (pagesI<0) {
          pagesI = 0;
        }
        $home.removeClass("myhome-2x");
        pages[pagesI].$page
          .removeClass("slideOut")
          .addClass("slideInFromRight");
        pageboxes[pagesI]
          .addClass("pagebox-active");
        $homepage
          .removeClass("fadeIn")
          .addClass("fadeOut");
        crud.set("show"); // $field.removeClass("fadeOut").addClass("fadeIn");
      } else {
        $home.addClass("myhome-2x");
        $homepage
          .removeClass("fadeOut")
          .addClass("fadeIn");
        if (pagesI<0) {
          return false;
        }
        pages[pagesI].$page
          .removeClass("slideIn slideInFromRight")
          .addClass("slideOut");
        crud.set("hide"); // $field.removeClass("fadeIn").addClass("fadeOut");
      }
    }); // on(click)
    $pageboxes.append($home);
    if ($.support.touch) {
    } else {
      $arrowLeft = $("<i>", { class:"fa fa-arrow-circle-left arrow-swipe" }).on("click", function(){
        $container.trigger("swipe-left");
        return false;
      });
      $arrowRight = $("<i>", { class:"fa fa-arrow-circle-right arrow-swipe" }).on("click", function(){
        $container.trigger("swipe-right");
        return false;
      });
      $pageboxes.append( $arrowLeft, $arrowRight );
    }
	
    $container.on("swipe-right", function(e){
      e.preventDefault();
	
      if ($home.hasClass("myhome-2x")) {
        return;
      }
	  
      if (pagesI < 0) {
        pagesI = 0;
	pages[0].$page.addClass("slideIn");
	pageboxes[0].addClass("pagebox-active");
      } else {
	pages[pagesI].$page
          .removeClass("slideIn slideInFromRight")
          .addClass("slideOut");
        pageboxes[pagesI]
          .removeClass("pagebox-active");
	pagesI++;
	if (pagesI > pages.length-1) {
          pagesI = 0;
        }
	pages[pagesI].$page
          .removeClass("slideOut slideOutToLeft")
          .addClass("slideIn");
        pageboxes[pagesI]
          .addClass("pagebox-active");
      }
      // crud.$field.removeClass("fadeOut").addClass("fadeIn");
    }); // $container.on("swipe-right")

    $container.on("swipe-left", function(e){
      e.preventDefault();
	
      if ($home.hasClass("myhome-2x")) {
        return;
      }
	  
      if (pagesI < 0) {
        pagesI = pages.length-1;
	pages[pagesI].$page.addClass("slideInFromRight");
        pageboxes[pagesI].addClass("pagebox-active");
      } else {
        pages[pagesI].$page
          .removeClass("slideIn slideInFromRight")
	  .addClass("slideOutToLeft");
        pageboxes[pagesI]
          .removeClass("pagebox-active");
        
	pagesI--;
	if (pagesI < 0) {
          pagesI = pages.length-1;
        }
	pages[pagesI].$page
          .removeClass("slideOut slideOutToLeft")
          .toggleClass("slideInFromRight");
        pageboxes[pagesI]
          .addClass("pagebox-active");
      }
    }); // $container.on("swipe-left")

    menuItemClick = function(e, $clickedItem) {
      let entity = new Entity($clickedItem.html());

      entity.cal = cal;
      entity.timepicker = thetimepicker;
      entity.$pageboxes = $pageboxes;
      entity.crud = crud;

      entity.load(menu.map(entity.name), screens);         // name to url ("Subscription" to "./js/bao.screen.subs.js")
      createPage({ $content: entity.$screen, entity:entity });
    }; // menuItemClick

    menu = new Menu({ $menu:$menu, urlMap:urlMap });
    $homepage.append(menu.get());
    menu.set("i");
    menu.set("a", menuItemClick);

    notification = new Notification({ insertLabel:false });
    crud = new Crud({ insertLabel:false, $pageboxes:$pageboxes, $modalcontainer:$container, attrs:{ modal:{ span:{ style:"z-index:3"} }}, pm:this, notification:notification });

    $container.append(crud.$field, notification.$field);

    cal = new Calendar({ $pageboxes:$pageboxes, $modalcontainer:$container, attrs:{ modal:{ span:{ style:"z-index:3"} }}, crud:crud });
    thetimepicker = new TimePicker({ $pageboxes:$pageboxes, $modalcontainer:$container, attrs:{ modal:{ span:{ style:"z-index:3"} }} });

    show = function(propName) {
      switch (propName) {
      case "$homepage":
        $home.trigger("click");
        break;
      } // switch
    }; // show
      
    deletePage = function($delButton) {
      let i = $delButton.data("pagesi"), len;
            
      pages[0].$page.append("i=" + i + "<br>");
            
      pages[i].$page.remove();
      pages.splice(i, 1);
      frames[i].remove();
      frames.splice(i, 1);
      pageboxes[i].remove();
      pageboxes.splice(i, 1);
            
      len = pages.length;
      if (pagesI > pages.length-1) {
        if (i === pagesI) {
          pagesI = 0;
        } else {
          pagesI = len - 1;
        }
      }
      if (i >= len) {
        i = len - 1;
      }
      for (; i<len; i++) {
        frames[i].children(".del").data("pagesi", "" + i);
      }
      //pageboxes = pageboxes.reverse();
    }; // deletePage
      
    createPage = function(args) {
      let 
        $content = args.$content,
        entity   = args.entity,
          
        $delButton = $("<div>", { class:"del" }).html("&times;"),
        $page = $("<div>", { class:"page" }),
        $pagebox = $("<li>", { class:"pagebox" }),
        $frame = $("<div>", { class:"frame" });
        
      $page.append($content);
      $frame.html($page.html());  
      $frame.prepend($delButton);
      pages.push({ $page:$page, entity:entity });
      frames.push($frame);
      pageboxes = [$pagebox].concat(pageboxes);
        
      $delButton.attr("data-pagesi", "" + pages.length-1)
        .on("click", function(e, ui){
          e.preventDefault();
          deletePage($(this));
      }); // $delButton.click
         
      $frame.on("swipe-left", function(e, ui) {
        e.preventDefault();
        pages[0].$page.append("frame-swipe<br>");
        $(this).one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend',   function(e) {
          e.preventDefault();
          deletePage($(this).children(".del"));
        });
        $(this).addClass("slideOutToLeft");
      }); // on("swipe-left")
        
      $page.insertBefore($pageboxes);
      $homepage.append($frame);
      $pagebox.insertBefore($home);
    }; // createPage
      
    get = function(propName) {
      let val;
        
      switch (propName) {
      case "pages":
        val = pages;
        break;
      case "entity":
        val = pages[pagesI].entity;
        break;
      case "crud":
        val = crud;
        break;
      } // switch
        
      return val;
    }; // get

    set = function(propName, val) {
      switch(propName) {
      case "$log":
        crud.set("$log", val);
        break;
      }
    }; // set
      
    this.show = show;
    this.createPage = createPage;
    this.get = get;
    this.set = set;
}; // PageManager

TouchManager = function() {
  let touch, isSwipe, log, set;
	
  isSwipe = function(touch) {
    let 
      duration, distanceX, distanceY, moves, numMoves, result, oneDirection, direction;
        
    moves = touch.moves;
    duration = touch.end.time - touch.start.time;
    distanceX = parseInt(touch.start.x - touch.end.x);
    distanceY = parseInt(touch.start.y - touch.end.y);

    oneDirection = function(moves, numMoves) {
      let prevX, prevY, i, horizontal, minY, maxY;

      if (numMoves <= 1) {
        return { horizontal:{ oneDirection:false } };
      }
      prevX = moves[0].x;
      minY = moves[0].y;
      maxY = minY;
      if (moves[1].y < minY) {
        minY = moves[1].y;
      } else if (moves[1].y > maxY) {
        maxY = moves[1].y;
      }
      if (prevX <= moves[1].x) {
        horizontal = { right:true, oneDirection:true };
		
        for (i=2; i<numMoves; i++) {
          if (prevX > moves[i].x) {
            horizontal.oneDirection = false;
            break;
          }
          prevX = moves[i].x;
		
          if (moves[i].y < minY) {
            minY = moves[i].y;
          } else if (moves[i].y > maxY) {
            maxY = moves[i].y;
          }
        } // for (i)
      } else {
        horizontal = { right:false, oneDirection:true };
		
        for (i=2; i<numMoves; i++) {
          if (prevX < moves[i].x) {
            horizontal.oneDirection = false;
            break;
          }
          prevX = moves[i].x;
		
          if (moves[i].y < minY) {
            minY = moves[i].y;
          } else if (moves[i].y > maxY) {
            maxY = moves[i].y;
          }
        } // for (i)
      } // horizontal -> left
		
      horizontal.verticalAltitude = Math.abs(minY - maxY);
		
      return { horizontal:horizontal };
    }; // oneDirection()
	
    result = (duration < 500);
    if (result &&
      (result = ((distanceX = Math.abs(distanceX))<300)) &&
      (result = (distanceX >= 30)) &&
      (result = ((numMoves = moves.length) <= 21)) &&
      (result = (numMoves > 0))) {

      direction = oneDirection(moves, numMoves);
      if ((result=direction.horizontal.oneDirection) &&
          (result=(direction.horizontal.verticalAltitude<30))) {
    }}
	
    return { result:result, horizontal: direction.horizontal };
  }; // isSwipe
	
  $("body")
    .on("touchstart", function(e) {
      touch = {
        start: { time: Date.now(),
                     x: e.changedTouches[0].screenX,
                     y: e.changedTouches[0].screenY,
                     numT:e.changedTouches.length
                   },
        moves: []
      };
    })
    .on("touchmove", function(e) {
	  touch.moves.push({ time: Date.now(),
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
        numT: e.changedTouches.length
      });
    })
    .on("touchend", function(e) {
      let swipe;
      
      touch.end = {
        time:Date.now(),
        x: e.changedTouches[0].screenX,
        y: e.changedTouches[0].screenY,
        numT:e.changedTouches.length
      };
      swipe = isSwipe(touch);
      if (swipe.result === true) {
        if (swipe.horizontal.right === true) {
          if (log !== undefined) {
            log.append("swipe-right<br>");
          }
          $(e.target).trigger("swipe-right");
        } else {
          if (log !== undefined) {
            log.append("swipe-left<br>");
          }
          $(e.target).trigger("swipe-left");
        }
      }
    }) // on(touchend)
    .on("touchcancel", function(e){
      if (log !== undefined) {
        log.append("Tcancel");
      }
    });
    
    set = function(propName, val) {
      switch (propName) {
      case "$log":
        log = val;
        break;
      } // switch
    }; // set
    
    this.set = set;
}; // TouchManager

init = function(args) {
  let pm, tm, $pmMenu = args.$pmMenu, screens = args.screens, urlMap = args.urlMap, $container = args.$container;

  pm = new PageManager({ $container:$container, $menu:$pmMenu, screens:screens, urlMap:urlMap });
  pm.createPage({ $content: "Log<br>", entity:{ $screen:"Log<br>" } });
  pm.set("$log", pm.get("pages")[0].$page);

  tm = new TouchManager();
  tm.set("$log", pm.get("pages")[0].$page);
  
  pm.show("$homepage");

  return pm;
}; // init


return {
  isArray:            isArray,
  isFunction:         isFunction, 
  isString:           isString, 
  getId:              getId,
  mediaQuery:         mediaQuery,

  Component:          Component,
  InputText:          InputText, 
  AlphaNumericString: AlphaNumericString, 
  DigitString:        DigitString, 
  DecimalDigitString: DecimalDigitString,
  InputCheckbox:      InputCheckbox, 
  Select:             Select,
  Modal:              Modal,
  Calendar:           Calendar,
  InputDate:          InputDate,
  TimePicker:         TimePicker,
  InputTime:          InputTime,
  InputDateAndTime:   InputDateAndTime,
  getResponsiveTable: getResponsiveTable,
  Table:              Table, 
  TabSheet:           TabSheet, 
  TabSheet2:          TabSheet2,
  CustomType:         CustomType,

  Entity:             Entity,
  Container:          Container,
  Menu:               Menu,
  PageManager:        PageManager,
  TouchManager:       TouchManager,
  init:               init
};

}());
