Select = function(args) {
let
options = args.options,emptyVal = args.emptyVal,view = args.view,
$options,optionsLen,i,selection,$select,$span,$i,initialVal,valueMap,me,
init,
getVal,setVal,empty,validate;
init = function(that) {
  Component.call(that, args);

  if (view === undefined) {
    $select = $("<ul>", {class:"spruits-select"});
    $options = $("<ul>");
    $i = $("<i>", {class:"fa fa-angle-down"});
    optionsLen = options.length;

    that.$field.append($select);

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
        $span.val(selected); // $(that).prev().prev().html(selected); 
        $options.toggleClass("show");
	$span.trigger("blur");
	return false; 
      })
    ));
  } else { // using another Select's $field
    $span = view.fields[that.name].$field.find(".selected");
    initialVal = view.fields[that.name].get("initialVal");
  }
  me = that;
  $span.on("blur", e => that.handleBlur(e, me));
};
init(this);
getVal = function(propName) {
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
};
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
};
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
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
};