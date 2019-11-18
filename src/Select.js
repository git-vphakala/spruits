//****************************************************************************************************************************************************************************
function init() {
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
        $options.append( $("<li>").append( $("<span>",{class:"value"}).html(selection), Array(selection.length).fill("&nbsp;").reduce((str,val) => str+=val,"") ) );
        if ($span === undefined) {
          $span = $("<input>", { type:"text" }).val(selection); // $("<span>").html(selection);
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
      $("<i>", {class:"fa fa-angle-down"}).on("click", function(e){ $(e.target).next().toggleClass("show"); return false; }),
      $options.on("click", function(e){ 
        let selected = $(e.target).hasClass("value") ? $(e.target).html() : $(e.target).children("span").html(); 
        $span.val(selected); // $(this).prev().prev().html(selected); 
        $options.toggleClass("show");
	$span.trigger("blur");
	return false; 
      })
    ));
  } else { // using another Select's $field
    $span = view.fields[this.name].$field.find(".selected");
    initialVal = view.fields[this.name].get("initialVal");
  }
  me = this;
  $span.on("blur", e => this.handleBlur(e, me));
}

//****************************************************************************************************************************************************************************
function getVal(propName) {
  switch (propName) {
  case "initialVal":
    // console.log("getVal, initialVal=" + initialVal);
    return initialVal;
    break;
  case "empty":
    return "" + initialVal;
    break;
  default:
    return $span.val(); // html();
  } // switch
}

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
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
}

//****************************************************************************************************************************************************************************
function empty() {
  $span.val(initialVal); // html( initialVal );
}

//****************************************************************************************************************************************************************************
function validate() {
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
}

//****************************************************************************************************************************************************************************
exports.className = "Select";
// options = [ "selection 1", "selection 2" ] or { "selection 1":x1, "selection 2":x2 }
// emptyVal = { value:"", description:"&lt; not selected &gt;", initial:true }
exports.args =      [ "options", "emptyVal", "view" ];
// $options = $("<ul>"),
// $select = $("<ul>", {class:"spruits-select"}),
// $i = $("<i>", {class:"fa fa-angle-down"}),
// valueMap, when option = {...}, this is { "x1":"selection 1", "x2":"selection 2" }
exports.props =     [ "$options", "optionsLen", "i", "selection",  "$select", "$span", "$i", "initialVal", "valueMap", "me" ],
// exports.methods =   {}
exports.init =      init;
/*exports.interfaceProps = [
 ""
]*/
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};
