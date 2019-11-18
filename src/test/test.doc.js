let pm, screens ={}, pageName, menubar, dropdown, createPageLink, createDocPage, comps = {}, handleClickVal, fullSrc;

createPageLink = function(pageName, linkText) {
  let handleClickLink;

  handleClickLink = function(e, pageName) {
    e.preventDefault();
    // console.log("link to page " + pageName);
    pm.set("goto-page", pageName);
  };
  
  return $("<a>").attr("href","javascript:;").on("click", e => handleClickLink(e, pageName)).html(linkText ? linkText : pageName);
};

createDocPage = function(pageName, $page) {
  return {
    create: function(entity) {
      entity.createField(pageName, spruits2.Component, { insertLabel:false, $field:$("<span>").append($page) });
      entity.insertFields();
    }, // create
  }; // screens
};

//****************************************************************************************************************************************************************************
fullSrc = new spruits2.Modal({ fieldName:"Full Source", $modalbody:$("<p>").css("padding", "1em").html("Insert code here"), $container:$("body") });

function handleClickFullSource(e, src, title) {
  let $pre = $("<pre>").css({ "padding-left":"1em" }), $code = $("<code>").append( $pre ), htmlTemplate =
`
&lt;!DOCTYPE html&gt;
&lt;html&gt;&lt;head&gt;
&lt;meta charset="utf-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
&lt;link rel="stylesheet" href="font-awesome-4.7.0/css/font-awesome.min.css"&gt;
&lt;link rel="stylesheet" href="css/spruits-2018.9.css"&gt;
&lt;style id="spruits-app-styles"&gt;
&lt;/style&gt;
&lt;title&gt;${title?title:"Full Source"}&lt;/title&gt;
&lt;script src="js/jquery-3.1.1.min.js"&gt;&lt;/script&gt;
&lt;script src="js/spruits2.js"&gt;&lt;/script&gt;
&lt;script&gt;
"use strict"
$(document).ready(function(){

${src.reduce((all, line) => { line = line.replace(/</g, "&lt;") + "\n"; return all + line; }, "")}
}); //document.ready
&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;/body&gt;
&lt;/html&gt;
`; // ${title}, ${src} are replaced

  e.preventDefault();
  
  fullSrc.set("$modalbody", $pre.append(htmlTemplate));
  fullSrc.set("show");
}

//****************************************************************************************************************************************************************************
menubar = [ "File" ];
dropdown = {
  "File":[ { text:"Table of contents", dropdown:true } ],

  "Table of contents":[ 
    "Introduction",
    {text:"Screen JS", dropdown:true},
    {text:"Dev Env", dropdown:true},
    {text:"Test Env", dropdown:true}
  ],

  "Screen JS":[
    {text:"Core components", dropdown:true} ,
    {text:"Content Management", dropdown:true},
    "Data Type widgets"
  ],
  
  "Core components":[
    "Component",
    "Container",
  ],

  "Content Management":[
    "Entity",
    "PageManager",
    "TouchManager",
    "ResizeAgent",
    "Modal",
  ],
  
  "Data Type widgets":[
    "Crud",
    "AlphaNumericString",
    "DigitString",
    "DecimalDigitString",
    "InputCheckbox",
    "InputTime",
    "InputDate",
    "InputDateAndTime"
  ],
  
  "Dev Env":[
  ],
  "Test Env":[
  ],
};

//****************************************************************************************************************************************************************************
pageName = "Introduction";
screens[pageName] = createDocPage(pageName, [
  $("<h4>").html("Spruits Documentation"),
  $("<p>").html("Spruits are <b>S</b>im<b>P</b>le<b>R UI T</b>ool<b>S</b>."), // simpler ui tools => SimPleR UI ToolS
  $("<div>").append(
    "They contain",
    $("<ul>").append(
      $("<li>").append(createPageLink("Screen JS", "jslib"), " to create UIs"),
      $("<li>").html("Nodejs based dev environment"),
      $("<li>").html("Spruitster to test the UIs")
    ))
]);

//****************************************************************************************************************************************************************************
pageName = "Screen JS";
screens[pageName] = createDocPage(pageName, [
  $("<p>").append(
    "Spruits Screen JS is mobile first, component based, responsive SPA UI built on Jquery."
  ),
  $("<p>").append(
    "The core components are",
    $("<ul>").append( dropdown["Core components"].map(compName => $("<li>").append(createPageLink(compName))) )
  ),
  $("<p>").append(
    "Content management components",
    $("<ul>").append( dropdown["Content Management"].map(compName => $("<li>").append(createPageLink(compName))) )
  ),
  $("<p>").append(
    "Data Type widgets",
    $("<ul>").append( dropdown["Data Type widgets"].map(compName => $("<li>").append(createPageLink(compName))) )
  )
]);

//****************************************************************************************************************************************************************************
pageName = "Component";
comps["1"] = new spruits2.Component({});
comps["1.hw"] = () => {
  let hw = new spruits2.Component({ fieldName:"Hello World" });
  $("body").append(hw.$field);
};
comps["2"] = new spruits2.Component({ $field:"Hello World!!!" });
comps["2.$input"] = new spruits2.Component({ $field:$("<input>", { type:"radio" }) });
comps["3"] = new spruits2.Component({ $field:$("<div>") });
comps["4"] = new spruits2.Component({ fieldName:"Gender" });

comps["5"] = new spruits2.Component({ fieldName:"Gender" });
comps["5"].$field.append(
  $("<div>").append($("<span>").html("Male"),   $("<input>", { type:"radio", name:"Gender", value:"male"   }) ),
  $("<div>").append($("<span>").html("Female"), $("<input>", { type:"radio", name:"Gender", value:"female" }) ),
  $("<div>").append($("<span>").html("Other"),  $("<input>", { type:"radio", name:"Gender", value:"other"  }) )
);
comps["5"].$field.children("div").children("span").css({ display:"inline-block", "padding-left":"1em", width:"5em" });
comps["5.code"] = function Gender() {
  spruits2.Component.call(this, { fieldName:"Gender, v0.1" });

  this.$field.append(
    [ "Male", "Female", "Other" ].map(name => {
      return $("<div>").append(
	$("<span>").html(name),
	$("<input>", { type:"radio", name:"Gender", value:name }));
    })
  );
  
  this.$field.children("div").children("span").css(
    { display:"inline-block", "padding-left":"1em", width:"5em" }
  );
};

handleClickVal = function(e, compsNum) {
  let val;
	
  e.preventDefault();
	
  comps[compsNum].$field.find("input").each(function() {
    if ($(this).prop("checked")) val = $(this).val();
  });
  $(e.target).next().html(val);
};

//****************************************************************************************************************************************************************************
let radioGroups = [], RadioGroupImplementation = [], cssRules = [];

cssRules[0] = `.radiobutton {
  display:block;
  padding-left:1em;
}`;
RadioGroupImplementation[0] = {};
RadioGroupImplementation[0].f = function RadioGroup(args) {
  let
  buttonNames = args.buttonNames,
  
  RadioButton = function(args) {
    let groupName = args.groupName;
    
    spruits2.Component.call(this, args);
    this.$field.addClass("radiobutton").append(
      $("<input>", { type:"radio", name:groupName, value:this.name })
    );
  };

  spruits2.Component.call(this, args);

  buttonNames.map(buttonName => {
    return new RadioButton({ fieldName:buttonName, groupName:this.name });
  }).forEach(comp => { this.$field.append(comp.$field); });
};
RadioGroupImplementation[0].usage = { name:"RadioGroup", args:{
  fieldName:"Gender, v0.2",
  buttonNames:[ "Male", "Female", "Other" ],
}};
radioGroups[0] = new RadioGroupImplementation[0].f(RadioGroupImplementation[0].usage.args);

spruits2.addCssRules(cssRules[0], $("#spruits-app-styles"));

//****************************************************************************************************************************************************************************
cssRules[1] = `.radiobutton-1 {
  display:block;
  padding-left:1em;
}
.radiobutton-1 input {
  opacity:0;
}
.radiobutton-1.def input {
  opacity:unset;
}
.radiobutton-1 .custombutton {
  height:1em;
  width:1em;
  background-color:#ffff00;
  display:inline-block;
  border-radius:50%;
  border-bottom:1px solid #999900;
  border-right:1px solid #999900;
  margin-left:-1em;
}
.radiobutton-1:hover input ~ .custombutton {
  background-color:#999900;
}
.radiobutton-1 .custombutton:after {
  content:"";
  display:inline-block;
  background-color:#FFFF00;
  width:0.5em;
  height:0.5em;
  border-radius:50%;
  margin-left:0.25em;
  margin-bottom:0.125em;
}
.radiobutton-1 input:checked ~ .custombutton:after {
  display:inline-block;
  background-color:#333300;
}`;
RadioGroupImplementation[1] = {};
RadioGroupImplementation[1].f = function RadioGroup(args) {
  let buttonNames = args.buttonNames,
      custom = args.custom,
      
      RadioButton = function(args) {
	let groupName = args.groupName,
	    $customButton,

	    handleClickCheckbox = function(e) {
	      let $input = $(this).prev();
	      e.preventDefault();
	      $input[0].checked = $input[0].checked ? false : true;
	    };
    
	spruits2.Component.call(this, args);
	
	$customButton = (custom !== false) ?
	  $("<span>", { class:"custombutton" })
	  .on("click", handleClickCheckbox) : "";
	
	this.$field.addClass("radiobutton-1" + ((custom === false) ? " def" : "")).append(
	  $("<input>", { type:"radio", name:groupName, value:this.name }),
	  $customButton
	);
      };

  spruits2.Component.call(this, args);

  buttonNames.map(buttonName => {
    return new RadioButton({ fieldName:buttonName, groupName:this.name });
  }).forEach(comp => { this.$field.append(comp.$field); });
};
RadioGroupImplementation[1].usage = { name:"RadioGroup", args:{
  fieldName:"Gender, v1.0",
  buttonNames:[ "Male", "Female", "Other" ],
}};
radioGroups[1] = new RadioGroupImplementation[1].f(RadioGroupImplementation[1].usage.args);
//radioGroups[1] = new RadioGroupImplementation[1].f({ fieldName:"Gender, v1.0", buttonNames:[ "Male", "Female", "Other" ] });
spruits2.addCssRules(cssRules[1], $("#spruits-app-styles"));
//$("#spruits-app-styles").append(cssRules[1]);

//****************************************************************************************************************************************************************************
cssRules[2] = `.radiobutton-1 {
  display:block;
  padding-left:1em;
}
.radiobutton-1 input {
  opacity:0;
}
.radiobutton-1.def input {
  opacity:unset;
}
.radiobutton-1 .custombutton {
  height:1em;
  width:1em;
  background-color:#ffff00;
  display:inline-block;
  border-radius:50%;
  border-bottom:1px solid #999900;
  border-right:1px solid #999900;
  margin-left:-1em;
}
.radiobutton-1:hover input ~ .custombutton {
  background-color:#999900;
}
.radiobutton-1 .custombutton:after {
  content:"";
  display:inline-block;
  background-color:#FFFF00;
  width:0.5em;
  height:0.5em;
  border-radius:50%;
  margin-left:0.25em;
  margin-bottom:0.125em;
}
.radiobutton-1 input:checked ~ .custombutton:after {
  display:inline-block;
  background-color:#333300;
}`;
RadioGroupImplementation[2] = {};
RadioGroupImplementation[2].f = function RadioGroup(args) {
  let buttonNames = args.buttonNames,
      custom = args.custom,
      buttons,
      
      RadioButton = function(args) {
	let groupName = args.groupName,
	    $input,
	    $customButton,

	    handleClickCheckbox = function(e) {
	      // let $input = $(this).prev();
	      e.preventDefault();
	      $input[0].checked = $input[0].checked ? false : true;
	    };
    
	spruits2.Component.call(this, args);
	
	$input = $("<input>", { type:"radio", name:groupName, value:this.name });
	
	$customButton = (custom !== false) ?
	  $("<span>", { class:"custombutton" })
	  .on("click", handleClickCheckbox) : "";
	
	this.$field.addClass("radiobutton-1" + ((custom === false) ? " def" : "")).append(
	  $input,
	  $customButton
	);

	this.getVal = function getVal(propName) {
	  let val;

	  switch(propName) {
	  case "val":
	  default:
	    val = $input[0].checked ? true : false;
	    break;
	  }

	  return val;
	};
      };

  spruits2.Component.call(this, args);
  
  buttons = buttonNames.map(buttonName => {
    return new RadioButton({ fieldName:buttonName, groupName:this.name });
  });
  buttons.forEach(comp => { this.$field.append(comp.$field); });

  this.getVal = function(propName) {
    let val, len, i;
    
    switch(propName) {
    case "val":
    default:
      len = buttons.length;
      for (i=0; i<len; i++) {
	if (buttons[i].get("val")) {
	  val = buttons[i].name;
	  break;
	}
      }
      break;
    }

    return val;
  };
};
RadioGroupImplementation[2].usage = { name:"RadioGroup", args:{
  fieldName:"Gender, v1.0",
  buttonNames:[ "Male", "Female", "Other" ],
}};
radioGroups[2] = new RadioGroupImplementation[2].f(RadioGroupImplementation[1].usage.args);
// spruits2.addCssRules(cssRules[2], $("#spruits-app-styles"));

//****************************************************************************************************************************************************************************
screens[pageName] = createDocPage(pageName, [
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html("Components produce HTML and CSS which browser uses to render the UI. They may contain other components and also html elements which are not components. " +
		    "Every component has the <code>$field</code>-property which is a jquery object and can be inserted to the DOM."),
      $("<div>").html("Create an empty component:"),
      $("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text("comp = new Component({});") )
    ),
    $("<p>").append(
      $("<div>").append('It produces the following html:'),
      $("<code>").append( $("<pre>").text("  " + (comps["1"].$field.prop("outerHTML").replace("<label>","\n    <label>").replace("</label>", "</label>\n  "))) )
    ),
    $("<p>").append(
      $("<p>").html(
	"The argument object has some useful predefined properties. The most used one is <code>fieldName</code>. The name is inserted to the component's label-tag. Here is the code for the traditional Hello World."
      ),
      $("<code>").append(
	$("<pre>").text(comps["1.hw"].toString().replace(/\(\) => {/, "").replace("\n","").replace(/}$/, ""))
      ),
      $("<p>", { style:"font-size:0.8em;" }).append( $("<a>", { href:"javascript:;", style:"color:#999900" }).html("Full Source").on("click", e => {
	handleClickFullSource(e, [
	  comps["1.hw"].toString().replace(/\(\) => {/, "").replace("\n","").replace(/}$/, ""),
	], "Hello World");
      }))
    ),
    $("<p>").append(
      $("<p>").append(
	"Another much used property of the argument object is called ", $("<code>").html("attrs"),
	". It delivers the required CSS to the component. Styles can be inline or in classes. If Hello World-application is enhanced with text color and fatness it looks like",
	$("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text('attrs:{ label:{ style:"color:red;font-weight:bold;" } }')), "Or",
	$("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text('attrs:{ label:{ class:"hw-label" } }'))
      ),
      $("<p>").append(
	'In the latter case, a code for the class is needed. This is done by an utility function <code>addCssRule</code>. It populates the rule of the class to the application styles.'
      ),
      $("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text('spruits2.addCssRule(".spruit-field .hw-label { color:red;font-weight:bold; }");') )
    )
  ),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<div>").append(
	"Component can be extended by inserting html elements to the <code>$field</code>. For example, it may be needed to know if user is Male, Female or Other. In this case, the page needs a field which may ",
	"be called Gender. The field name is inserted to the component's label-tag. Html elements of the radio buttons are appended to the <code>$field</code>. ",
	"The names of the buttons are decorated with indent and their length is set to justify the button positions."
      ),
      $("<code>").append(
	$("<pre>").css({ "padding-left":"1em" }).text(comps["5.code"].toString()) // .replace(/\(\) => {/, "").replace("\n","").replace(/}$/, ""))
      )
    ),
    $("<p>").append(
      $("<div>", { style:"margin-bottom:0.5em" }).html("Here is the component in the action:"),
      (new comps["5.code"]()).$field.css({ display:"block", "padding-left":"1em" })
      /*
      $("<button>").html("val").on("click", e => handleClickVal(e, "5")), // XXX
      $("<span>", { style:"margin-left:1em" })
      */
    ),
    $("<p>", { style:"font-size:0.8em;" }).append( $("<a>", { href:"javascript:;", style:"color:#999900" }).html("Full Source").on("click", e => {
      handleClickFullSource(e, [
	comps["5.code"].toString(),
	'$("body").append((new Gender()).$field)', ' ',
      ], (new comps["5.code"]()).name);
    }))
  ),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<div>").html(
	"There are other use cases of the radio button groups. The above functionality can be generalized to a new component type called RadioGroup."
      ),
      $("<p>", { class:"usage", style:"margin-left:1em"}).append(
 	 '<code>' + 'new spruits2.' + RadioGroupImplementation[0].usage.name + '(' + JSON.stringify(RadioGroupImplementation[0].usage.args) + ')' + '</code>'
      ),
      $("<div>").html(
	"Argument object gets a new property called <code>buttonNames</code>. It is an array which replaces the hard coded array in Gender. Radio button is refactored so that it is also a component which extends Component."
      ),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text('spruits2.wc(' + RadioGroupImplementation[0].f.toString() + ')')
      ),
      $("<div>").html(
	"Now the button's $field tag is <code>&lt;span&gt;</code>. In order to keep the buttons " +
	"on separate lines and get the indent decoration, styles are set via CSS class <code>radiobutton</code>."
      ),
      $("<code>", { class:"cssrules" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text('spruits2.addCssRule(`' + cssRules[0] + '`);')
      )
    ),
    $("<p>").append(
      $("<div>").html("Here is the new RadioGroup-component in the action:"),
      radioGroups[0].$field.css({ display:"block", "padding-left":"1em" }) // comps["6"].$field.css({ "padding-left":"1em" }),
      //$("<button>").html("val").on("click", e => handleClickVal(e, "6")), // XXX
      //$("<span>", { style:"margin-left:1em" })
      //$("<div>").append(JSON.stringify(comps["6"]))
    ),
    $("<p>", { style:"font-size:0.8em;" }).append( $("<a>", { href:"javascript:;", style:"color:#999900" }).html("Full Source").on("click", e => {
      let $usage = $(e.target).parent().prev().prev().children(".usage").children("code"),
	  $impl = $(e.target).parent().prev().prev().children(".impl").children("pre"),
	  $cssrules = $(e.target).parent().prev().prev().children(".cssrules").children("pre");
      
      handleClickFullSource(e, [
	$impl.text(),
	$cssrules.text(),
	'$("body").append((' + $usage.text() + ').$field);'
      ], RadioGroupImplementation[0].usage.args.fieldName);
    }))
  ),
  $("<div>", { class:"field-row dotted last" }).append(
    $("<p>").append(
      $("<div>").append(
	"There may be need to style the grey radio button according the brand's look and feel, for example. This is done so that the <code>&lt;input&gt;</code> is hidden and styleable <code>&lt;span&gt;</code> having class ",
	"<code>custombutton</code> is inserted next to the input. Checkmark to indicate if the radio button is checked, is done via CSS pseudo-class <code>after</code>."
      ),
      $("<code>", { class:"cssrules" }).append(
	$("<pre>").css({ "padding-left":"1em" }).append(cssRules[1])
      ),
      $("<div>").append(
	"Clicking of the custom button is handled by <code>handleClickCheckbox</code>. Developer may choose between the custom and browser's default button via <code>args.custom</code>. In the latter case, hiding is cancelled by ",
	"<code>radiobutton.def</code>-class."
      ),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text(RadioGroupImplementation[1].f.toString())
      )
    ),
    $("<p>").append(
      $("<div>").html("Here is the customized RadioGroup-component in the action:"),
      radioGroups[1].$field.css({ display:"block", "padding-left":"1em" }) // comps["6"].$field.css({ "padding-left":"1em" }),
    ),
    $("<p>", { style:"font-size:0.8em;" }).append( $("<a>", { href:"javascript:;", style:"color:#999900" }).html("Full Source").on("click", e => {
      let $usage = $("<code>").text('new spruits2.' + RadioGroupImplementation[1].usage.name + '(' + JSON.stringify(RadioGroupImplementation[1].usage.args) + ')'),
	  $impl = $(e.target).parent().prev().prev().children(".impl").children("pre"),
	  $cssrules = $(e.target).parent().prev().prev().children(".cssrules").children("pre");
      
      handleClickFullSource(e, [
	"spruits2.wc(" + $impl.text() + ");",
	"spruits2.addCssRule(`" + $cssrules.text() + "`);",
	'$("body").append((' + $usage.text() + ').$field);'
      ], RadioGroupImplementation[1].usage.args.fieldName);
    }))
  )
  /*
    ,
  $("<div>", { class:"field-row dotted last" }).append(
    $("<p>").append(
      $("<div>").html("The default tag of the field is &lt;span&gt;. It can be replaced by another tag:"),
      $("<code>").append( $("<pre>").text('  comp = new Component({ $field:$("<div>") });\n') )
    ),
    $("<p>").append(
      $("<div>").html("The component produces the following html:"),
      $("<code>").append( $("<pre>").text("  " + (comps["3"].$field.prop("outerHTML").replace("<label>","\n    <label>").replace("</label>", "</label>\n  "))) )
    ),
    $("<p>").append(
      $("<div>").html("Or it can be replaced by a string:"),
      $("<code>").append( $("<pre>").text('  comp = new Component({ $field:"Hello World!!!" });\n') )
    ),
    $("<p>").append(
      $("<div>").html("The component produces the following html:"),
      $("<code>").append( $("<pre>").text("  " + comps["2"].$field) )
    ),
    $("<p>").append(
      $("<div>").html("If the field-tag is empty or it does not exist the component does not contain a label:"),
      $("<code>").append( $("<pre>").text('  comp = new Component({ $field:$("<input>", { type:"radio" }) });\n') )
    ),
    $("<p>").append(
      $("<div>").html("The component produces the following html:"),
      $("<code>").append( $("<pre>").text("  " + comps["2.$input"].$field.prop("outerHTML")) )
    )
  ),
   */
]);

//****************************************************************************************************************************************************************************
let pairs = [], Card, PairsImplementation = [], pairCssRules = [], cardCssRules;

Card = function Card(args) {
  let faceValue = args.faceValue,
      onClick =   args.onClick,
      $label;
  
  spruits2.Component.call(this, args);
  $label = this.$label;
  $label.html(faceValue);
  this.$field.addClass("card");
  this.$field.on("click", e => onClick(e, $label));
};

cardCssRules = `.spruit-field.card > label {
  width: 3em;
  height: 2.5em;
  padding-top:0.5em;
  text-align: center;
  border: 0;
  margin: 0.5em;
  border-radius: 8px;
  background: #ffff00;
  border-right: 1px solid #999900;
  border-bottom: 1px solid #999900;
  color: #333300;
}
.spruit-field.card > label.facedown {
  background: #999900;
  color: #999900;
  border-right-color: #ffff00;
  border-bottom-color: #ffff00;
}
.spruit-field.card > label.removed {
  background: #9ACD32;
  color: #9ACD32;
  border-right-color: #9ACD32;
  border-bottom-color: #9ACD32;
}`;
spruits2.addCssRule(cardCssRules);

//****************************************************************************************************************************************************************************
PairsImplementation[0] = {};
PairsImplementation[0].f = function FindPairs(args) {
  let pairList = [ "a", "b", "c", "d" ],
      $board = $("<div>"),
      
      shuffleCards = function() {
	/* very bad shuffler */
	return [ "a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2" ];
      },

      playGame = function(e, $label) {
	/* Turn cards, check pairs and manage game. */
      };

  spruits2.Component.call(this, args);
  spruits2.Container.call(this, this.name);

  /* Create pairs and store them to fields-property. Card-component has not been implemented yet. */
  pairList.forEach(card => {
    this.createField(card + "1", Card, { faceValue:card, attrs:{ label:{ class:"facedown" }}, onClick:playGame });
    this.createField(card + "2", Card, { faceValue:card, attrs:{ label:{ class:"facedown" }}, onClick:playGame });
  });

  /* shuffleCards returns an array which contains the fieldNames of the cards in random order. 
   * Cards are placed to the board in that order by the Array.map-method.
   */
  $board.append( shuffleCards().map(cardName => this.fields[cardName].$field) );
  this.$field.append($board);
};
PairsImplementation[0].usage = { name:"FindPairs", args:{
  fieldName:"FindPairs, v0.1",
}};
pairCssRules[0] = "";
pairs.push(new PairsImplementation[0].f(PairsImplementation[0].usage.args));
//spruits2.addCssRule(pairCssRules[0]);

//****************************************************************************************************************************************************************************
PairsImplementation[1] = {};
PairsImplementation[1].f = function FindPairs(args) {
  let pairList = [ "a", "b", "c", "d" ],
      $board = $("<div>", { class:"board" }),
      faceUp = [],
      
      shuffleCards = function(numPairs) {
	/* very bad shuffler */
	return [ "a1", "a2", "b1", "b2", "c1", "c2", "d1", "d2" ];
      },

      playGame = function playGame(e, $label) {
	let turned = false;
	
	e.preventDefault();
	
	if (faceUp.length < 2 && $label.hasClass("facedown")) {
	  $label.removeClass("facedown");
	  faceUp.push($label);
	  turned = true;
	}
	
	if (faceUp.length > 1) {
	  /* two cards are face-up */
	  
	  if (faceUp[0].html() === faceUp[1].html()) {
	    /* pair found */
	    faceUp.forEach($label => $label.addClass("removed"));
	    faceUp = [];
	  } else {
	    /* not a pair */
	    
	    if (turned === false) {
	      /* return cards back to the face-down state */
	      faceUp.forEach($label => $label.addClass("facedown"));
	      faceUp = [];
	    }
	  }
	}
      };
  
  spruits2.Component.call(this, args);
  spruits2.Container.call(this, this.name);

  /* Create pairs and store them to fields-property. */
  pairList.forEach(card => {
    this.createField(card + "1", Card, { faceValue:card, pairId:"1", attrs:{ label:{ class:"facedown" }}, onClick:playGame });
    this.createField(card + "2", Card, { faceValue:card, pairId:"2", attrs:{ label:{ class:"facedown" }}, onClick:playGame });
  });

  /* shuffleCards returns an array which contains the fieldNames of the cards a1, a2, ..., d1, d2. 
   * Cards are placed to the board in that order by the Array.map-method.
   */
  $board.append( shuffleCards(pairList.length).map(cardName => this.fields[cardName].$field) );
  this.$field.addClass("findpairs").append($board);

  this.playGame = playGame; // XXX this for documentary purpose only
};
PairsImplementation[1].usage = { name:"FindPairs", args:{ fieldName:"Find Pairs, v0.2" }};
pairCssRules[1] = `.spruit-field.findpairs .board {
  background-color: #9ACD32;
  margin: 1em;
}`;
pairs.push(new PairsImplementation[1].f({ fieldName:PairsImplementation[1].usage.args.fieldName }));
spruits2.addCssRule(pairCssRules[1]);

//****************************************************************************************************************************************************************************
PairsImplementation[2] = {};
PairsImplementation[2].f = function FindPairs(args) {
  let pairList = [ "a", "b", "c", "d" ],
      $board = $("<div>", { class:"board" }),
      faceUp = [],
      
      shuffleCards = function(numPairs) {
	let cardId = [ 1, 2 ],
	    alreadySet = {},
	    boardSize = 2*numPairs,
	    board = Array(boardSize).fill(null),
	    i;
	
	pairList.forEach(pairName => {
	  cardId.forEach(id => {
	    for (;;) {
	      i = Math.floor(Math.random() * boardSize); // i = integer [0 - (boardSize-1)]
	      if (alreadySet["" + i] !== true) {
		alreadySet["" + i] = true;
		board[i] = pairName + id;
		break;
	      }
	    } // for(;;)
	  });
	});
	
	return board;
      },

      playGame = function(e, $label) {
	let turned = false;
	
	e.preventDefault();
	
	if (faceUp.length < 2 && $label.hasClass("facedown")) {
	  $label.removeClass("facedown");
	  faceUp.push($label);
	  turned = true;
	}
	
	if (faceUp.length > 1) {
	  /* two cards are face-up */
	  
	  if (faceUp[0].html() === faceUp[1].html()) {
	    /* pair found */
	    faceUp.forEach($label => $label.addClass("removed"));
	    faceUp = [];
	  } else {
	    /* not a pair */
	    
	    if (turned === false) {
	      /* return cards back to the face-down state */
	      faceUp.forEach($label => $label.addClass("facedown"));
	      faceUp = [];
	    }
	  }
	}
      };
  
  spruits2.Component.call(this, args);
  spruits2.Container.call(this, this.name);

  /* Create pairs and store them to fields-property. */
  pairList.forEach(card => {
    this.createField(card + "1", Card, { faceValue:card, pairId:"1", attrs:{ label:{ class:"facedown" }}, onClick:playGame });
    this.createField(card + "2", Card, { faceValue:card, pairId:"2", attrs:{ label:{ class:"facedown" }}, onClick:playGame });
  });

  /* shuffleCards returns an array which contains the fieldNames of the cards in random order. 
   * Cards are placed to the board in that order by the Array.map-method.
   */
  $board.append( shuffleCards(pairList.length).map(cardName => this.fields[cardName].$field) );
  this.$field.addClass("findpairs").append($board);
};
PairsImplementation[2].usage = { name:"FindPairs", args:{ fieldName:"Find Pairs, v1.0" }};
pairCssRules[2] = `.spruit-field.findpairs .board {
  background-color: #9ACD32;
  margin: 1em;
  padding:1em;
}`;
pairs.push(new PairsImplementation[2].f({ fieldName:PairsImplementation[2].usage.args.fieldName }));
spruits2.addCssRule(pairCssRules[2]);

//****************************************************************************************************************************************************************************
let shuffleCards = function shuffleCards(pairList, numPairs) {
  let cardId = [ 1, 2 ],
      alreadySet = {},
      boardSize = 2*numPairs,
      board = Array(boardSize).fill(null),
      i;
	
  pairList.forEach(pairName => {
    cardId.forEach(id => {
      for (;;) {
	i = Math.floor(Math.random() * boardSize); // i = integer [0 - (boardSize-1)]
	if (alreadySet["" + i] !== true) {
	  alreadySet["" + i] = true;
	  board[i] = pairName + id;
	  break;
	}
      } // for(;;)
    });
  });
	
  return board;
};
/*
function ShuffleArray(array) {
   var currentIndex = array.length;
   var temporaryValue, randomIndex;
   while (0 !== currentIndex) {
     // Pick a remaining element...
     randomIndex = Math.floor(Math.random() * currentIndex);
     currentIndex -= 1;
     // And swap it with the current element.
     temporaryValue = array[currentIndex];
     array[currentIndex] = array[randomIndex];
     array[randomIndex] = temporaryValue;
   }
}
*/

//****************************************************************************************************************************************************************************
pageName = "Container";
screens[pageName] = createDocPage(pageName, [
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  Application has many fields which are components. They are taken care by the capabilities of Container-component. Therefore, an application does not extend only Component but Container too. This way the application component gets a 
  new method called <code>createField</code> and a new property called <code>fields</code> which stores the created components. The property is object and a component is accessed by its fieldName.`),
      $("<p>").html(`
  Here a memory game called Find Pairs illustrates the usage of the Container-component. In the game, there are pairs of cards which the player tries to find. Shuffled cards are face down on the board and two cards are turned on each 
  round. If a pair was not found cards are returned back to the face-down state. When a pair is found, it is removed from the board. The game ends when all pairs have been found.
     `),
      $("<p>").html("Here is the skeleton of the app:"),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text(PairsImplementation[0].f.toString())
      )
      /*
      $("<p>").append(
	$("<div>").html("Here is Find Pairs-game in the action:"),
	pairs[0].$field
      )
      */
    )
  ),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  Card-component extends Component. It does not need additional components or elements. The component gets 4 arguments. Handling of the <code>fieldName</code> and <code>attrs.label</code> is done by Component but the other two
  are application spesific and they are handled by the code in Card-component.
  <ul style="list-style-type:none"> 
  <li><code style="width: 11em;display: inline-block;">fieldName</code>: the face value and pairId of the card. </li>
  <li><code style="width: 11em;display: inline-block;">faceValue</code>: this is seen in the card. </li>
  <li><code style="width: 11em;display: inline-block;">attrs.label.class</code>: a card is turned by toggling the label's facedown-class. This parameter sets the initial state to face-down.</li>
  <li><code style="width: 11em;display: inline-block;">onClick</code>: When a card is clicked, the game-logic is executed. The handler is provided by the game.</li>
  </ul>
     `),
      $("<p>").html(`
  Appearance of the Card is set by styling the component's label-tag. The first one configures the common and face-up attributes. The second one configures new color attributes of the face-down state. The third rule configures the
  disappearance of the card, when it is removed from the board.
     `),
      $("<code>", { class:"cssrules" }).append(
	$("<pre>").css({ "padding-left":"1em" }).append(cardCssRules)
      ),
      $("<p>").html(`
  The label contains fieldName by default. But in this component it is replaced by card's face-value. In order to separate Card's CSS rules from other spruit-field rules, card-class is added for the $field. Private property <code>
  $label</code> is needed because <code>this</code> in a click-handler points to the clicked html-element and not to the Card-object.
      `),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text(Card.toString())
      ),
      $("<p>").html(`
        The click-handler is simpler than in <b>Find Pairs</b> game. This handler just turns the card.
      `),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text(`$elem.append(new Card({ faceValue:"x", attrs:{ label:{ class:"facedown" }}, onClick:function(e, $label){
	  e.preventDefault();
	  if ($label.hasClass("facedown")) $label.removeClass("facedown");
	  else $label.addClass("facedown");
	} })).$field`)
      ),
      $("<p>").append(
	$("<div>").html("Here is Card-component in the action."),
	(new Card({ fieldName:"x1", faceValue:"x", pairId:"1", attrs:{ label:{ class:"facedown" }}, onClick:function(e, $label){
	  e.preventDefault();
	  if ($label.hasClass("facedown")) $label.removeClass("facedown");
	  else $label.addClass("facedown");
	} })).$field
      )
    )
  ),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(`
  Game-logic is implemented in <code>playGame</code>-method. It is executed, when the player clicks a card.`),
    $("<p>").append(`    
  In the initial state of the game, all cards are in the face-down state. So logically, the first task is to check if
  the clicked card should be changed to the face-up state. Only two cards can be in that state and the state of the card is changed only once. The state is changed by removing the facedown outlook which is created by Card's CSS-class 
  called <code>facedown</code>.`),
    $("<p>").append(`
  The game object has a private property called <code>faceUp</code> which stores the cards in
  the respective state. When this property contains two cards, it is time to check whether or not they form a pair. The pair is removed from the board by changing the color properties of the card via the Card's CSS-class called <code>
  removed</code>. So actually, the cards are still there but they can not be seen. In the "not a pair"-case cards are changed to the face-down state by changing the color properties via the <code>facedown</code>-class.
    `),
    $("<code>", { class:"impl" }).append(
      $("<pre>").css({ "padding-left":"0", "margin-left":"-2.5em" }).text("      " + pairs[1].playGame.toString())
    )),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").html(`
  The board gets its nice yellowgreen color with the following CSS-rule.
    `),
    $("<code>", { class:"cssrules" }).append(
      $("<pre>").css({ "padding-left":"1em" }).append(pairCssRules[1])
    )),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<div>").html("Here is the game with the very bad suffler. Finding pairs is trivial but the game-logic can be tested."),
      pairs[1].$field
    ),
    $("<p>", { style:"font-size:0.8em;" }).append( $("<a>", { href:"javascript:;", style:"color:#999900" }).html("Full Source").on("click", e => {
      let $usage = $("<code>").text('(new ' + PairsImplementation[1].usage.name + '({})).$field'),
	  $impl = PairsImplementation[1].f.toString() + " // FindPairs\n";
      
      handleClickFullSource(e, [
	Card.toString(),
	"spruits2.addCssRule(`" + cardCssRules + "`);",
	
	$impl,
	"spruits2.addCssRule(`" + pairCssRules[1] + "`);",
	'$("body").append($("<div>", { class:"page slideIn"}).append("<h4>Find Pairs, v0.2</h4>", ' + $usage.text() + '));',
      ], PairsImplementation[1].usage.args.fieldName);
    }))
  ),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(`
  Cards' <code>fieldName</code> shuffler lottos a unique board index for each card. It gets the list of the pair names from the game. FieldName of the card contains a pair name and a card Id (1 or 2). <code>shuffleCards</code>-method 
  plays lotto for each pair and places pairName1 and pairName2 to the board-array. Lotto may suggest same index for more than one card but the shuffler notices this with the help of the <code>alreadySet</code>-object which contains the
  cards on the board already. In that situation, another index is drawn until a not-in-use index is gotten. The game gets the array and uses it as key-values to find card-components from the fields-property.
    `),
    $("<code>", { class:"impl" }).append(
      $("<pre>").css({ "padding-left":"1em" }).text(shuffleCards.toString())
    )),
  $("<div>", { class:"field-row dotted last" }).append(
    $("<p>").append(
      $("<div>").html("Here is Find Pairs-game in the action:"),
      pairs[2].$field
    ),
    $("<p>", { style:"font-size:0.8em;" }).append( $("<a>", { href:"javascript:;", style:"color:#999900" }).html("Full Source").on("click", e => {
      let $usage = $("<code>").text('(new ' + PairsImplementation[2].usage.name + '({})).$field'),
	  $impl = PairsImplementation[2].f.toString() + " // FindPairs\n";
      
      handleClickFullSource(e, [
	Card.toString(),
	"spruits2.addCssRule(`" + cardCssRules + "`);",
	
	$impl,
	"spruits2.addCssRule(`" + pairCssRules[2] + "`);",
	'$("body").append($("<div>", { class:"page slideIn"}).append("<h4>Find Pairs, v1.0</h4>", ' + $usage.text() + '));',
      ], PairsImplementation[2].usage.args.fieldName);
    }))
  )
]);

//****************************************************************************************************************************************************************************
spruits2.wc(RadioGroupImplementation[2].f); // RadioGroup-1.0

PairsImplementation[3] = {};
PairsImplementation[3].f = function(args) {
  let $board = $("<div>", { class:"board" }),
      faceUp = [],
      
      shuffleCards = function(pairList) {
	let numPairs = pairList.length,
	    cardId = [ 1, 2 ],
	    alreadySet = {},
	    boardSize = 2*numPairs,
	    board = Array(boardSize).fill(null),
	    i;
	
	pairList.forEach(pairName => {
	  cardId.forEach(id => {
	    for (;;) {
	      i = Math.floor(Math.random() * boardSize); // i = integer [0 - (boardSize-1)]
	      if (alreadySet["" + i] !== true) {
		alreadySet["" + i] = true;
		board[i] = pairName + id;
		break;
	      }
	    } // for(;;)
	  });
	});
	
	return board;
      },

      playGame = function(e, $label) {
	let turned = false;
	
	e.preventDefault();
	
	if (faceUp.length < 2 && $label.hasClass("facedown")) {
	  $label.removeClass("facedown");
	  faceUp.push($label);
	  turned = true;
	}
	
	if (faceUp.length > 1) {
	  /* two cards are face-up */
	  
	  if (faceUp[0].html() === faceUp[1].html()) {
	    /* pair found */
	    faceUp.forEach($label => $label.addClass("removed"));
	    faceUp = [];
	  } else {
	    /* not a pair */
	    
	    if (turned === false) {
	      /* return cards back to the face-down state */
	      faceUp.forEach($label => $label.addClass("facedown"));
	      faceUp = [];
	    }
	  }
	}
      },

      init = function(that) {
	args.screen = {
	  create:function(entity) {
	    entity.pairList = [ "a", "b", "c", "d" ];
      
	    /* Create pairs and store them to fields-property. */
	    entity.pairList.forEach(card => {
	      entity.createField(card + "1", Card, { faceValue:card, pairId:"1", attrs:{ label:{ class:"facedown" }}, onClick:playGame });
	      entity.createField(card + "2", Card, { faceValue:card, pairId:"2", attrs:{ label:{ class:"facedown" }}, onClick:playGame });
	    });
	
	    /* shuffleCards returns an array which contains the fieldNames of the cards in random order. 
	     * Cards are placed to the board in that order by the Array.map-method.
	     */
	    $board.append( shuffleCards(entity.pairList).map(cardName => entity.fields[cardName].$field) );
	    entity.$field.addClass("findpairs").append($board);
	  },
	};
  
	spruits2.Entity.call(that, args);
	that.$field.addClass("findpairs");
	that.load();
      };

  init(this);
};
pairCssRules[3] = `.spruit-field.findpairs .board {
  background-color: #9ACD32;
  margin: 1em;
  padding:1em;
}`;
pairs.push(new PairsImplementation[3].f({ fieldName:"Find Pairs, v1.1" }));
spruits2.addCssRule(pairCssRules[3]);

//****************************************************************************************************************************************************************************
PairsImplementation[4] = {};
PairsImplementation[4].skeleton = function FindPairs(args) {
  let controller, store, state, States;

  States = { init:1, play:2, gameover:3 };

  args.screen = screens["FindPairs"];
  
  controller = function() {
    if (state === undefined) store.stateToRender = States.init;
    else if (state === States.init) store.stateToRender = States.play;
    else if (state === States.play) store.stateToRender = States.gameover;
    else if (state === States.gameover) store.stateToRender = States.init;
    else {
      console.log("ERR:render:invalid state, state=" + state);
      return;
    }
    state = store.stateToRender;
    this.refresh(store);
  }.bind(this);

  store = { controller:controller, States:States };
  spruits.Entity.call(this, args);
  this.load(store);
};
PairsImplementation[4].screens = {
  "FindPairs":`{
    create:function(entity, store) {
      const { controller } = store;
      let $board = $("<div>", { class:"board" });
      
      entity.$field.addClass("findpairs-4").append($board);
      store.$board = $board;
      controller();
    },
    update:function(entity, store) {
      const { States, stateToRender, $board } = store;

      const screenName = spruits.getKeyByValue(States, stateToRender);
      if (screenName === undefined) {
	console.log("ERR:invalidState,stateToRender=" + stateToRender + ", States=" + JSON.stringify(States));
	return;
      }

      $board.empty();
      entity.createField(screenName, screens[screenName], {insertLabel:false}, store);
      $board.append(entity.fields[screenName].$field);
    }
  }`, // FindPairs
};
PairsImplementation[4].f = function FindPairs(args) {
  let game,
      $field,
      States = { init:1, play:2, gameover:3 },
      ScreenEntities = {},
      state,
      render,
      Game;

  Game = function Game(args) {
    let
    pairList = Array(args.numOfPairs).fill(null).map((char,i) => String.fromCharCode("a".charCodeAt(0) + i)),
    faceUp = [],
    removed = 0,
    
    shuffleCards = function() {
      let numPairs = pairList.length,
	  cardId = [ 1, 2 ],
	  alreadySet = {},
	  boardSize = 2*numPairs,
	  board = Array(boardSize).fill(null),
	  i;
      
      pairList.forEach(pairName => {
	cardId.forEach(id => {
	  for (;;) {
	    i = Math.floor(Math.random() * boardSize); // i = integer [0 - (boardSize-1)]
	    if (alreadySet["" + i] !== true) {
	      alreadySet["" + i] = true;
	      board[i] = pairName + id;
	      break;
	    }
	  } // for(;;)
	});
      });
      
      return board;
    }, // shuffleCards

    play = function(e, $label) {
      let turned = false;
      
      e.preventDefault();
      
      if (faceUp.length < 2 && $label.hasClass("facedown")) {
	$label.removeClass("facedown");
	faceUp.push($label);
	turned = true;
      }
      
      if (faceUp.length > 1) {
	/* two cards are face-up */
	
	if (faceUp[0].html() === faceUp[1].html()) {
	  /* pair found */
	  faceUp.forEach($label => $label.addClass("removed"));
	  faceUp = [];
	  removed++;
	  if (removed === pairList.length) render(States.gameover);
	} else {
	  /* not a pair */
	  
	  if (turned === false) {
	    /* return cards back to the face-down state */
	    faceUp.forEach($label => $label.addClass("facedown"));
	    faceUp = [];
	  }
	}
      }
    } // play

    this.shuffleCards = shuffleCards;
    this.play = play;
  }; // Game
  
  ScreenEntities["init"] = function Init(args={}, store={}) {
    args.screen = {
      create:function(entity, store) {
	const {controller} = store;
	let numPairs = { "Easy":4, "Medium":6, "Hard":8 },
	    level = new spruits2.RadioGroup({ fieldName:"Select level", buttonNames:Object.keys(numPairs) }),
	    
	    handleClickStart = function(e) {
	      let size = numPairs[ level.get("val") ];
	      e.preventDefault();
	
	      if (size) {
		store.gameNumPairs = size;
		controller();
	      }
	    };
	
	entity.$field.append(level.$field, $("<button>").html("Play").on("click", handleClickStart));
	entity.$label.css({ display:"none" });
      }
    };
    
    spruits2.Entity.call(this, args);
    this.load(store);
  }; // ScreenEntity.init
  
  ScreenEntities["play"] = function(args) {
    args.screen = {
      create:function(entity) {
	/* shuffleCards returns an array which contains the fieldNames of the cards in a random order. 
	 * Cards are created, stored to fields-property and placed to the board in the random order by the Array.map-method.
	 */
	entity.$field.append( game.shuffleCards().map(cardName => {
	  entity.createField(cardName, Card, { faceValue:cardName.slice(0, -1), attrs:{ label:{ class:"facedown" }}, onClick:game.play });
	  return entity.fields[cardName].$field;
	}));
      }}; // create, screen
	  
    spruits2.Entity.call(this, args);
    this.$label.css({ display:"none" });
    this.load();
  }; // ScreenEntity.play

  ScreenEntities["gameover"] = function(args) {
    args.screen = {
      create:function(entity) {
	let handleClickReplay = function(e, entity) {
	  e.preventDefault();
	  render(States.init);
	};
	
	entity.$field.append("Game over. ",  $("<button>").html("Replay").on("click", e => handleClickReplay(e, this)));
	entity.$label.css({ display:"none" });
      },
    };

    spruits2.Entity.call(this, args);
    this.load();
  };

  render = function(newState) {
    let $board = this.$field.children(".board"),
	
	renderScreen = function(screenName) {
	  this.fields[screenName] = undefined;
	  this.createField(screenName, ScreenEntities[screenName], { insertLabel:false });
	  $board.append(this.fields[screenName].$field);
	}.bind(this);

    if ($board.length) $board.remove();
    $board = $("<div>", { class:"board" });
    this.$field.append($board);
	
    switch (newState) {
    case States.init:
      renderScreen("init");
      break;
	  
    case States.play:
      renderScreen("play");
      break;

    case States.gameover:
      renderScreen("gameover");
      break;

    default:
      $board.html("ERR:render:invalidState,this.name=" + this.name + ",newState=" + newState);
      newState = state;
      break;
    }
    state = newState;
  }.bind(this);

  spruits2.Component.call(this, args);
  spruits2.Container.call(this, this.name);
  this.$field.addClass("findpairs-4");
  $field = this.$field;
  render(States.init);

  // XXX this for documentary purpose only
  this.ScreenEntities = ScreenEntities;
  this.Game = Game;
};
PairsImplementation[4].usage = { name:"FindPairs", args:{ fieldName:"Find Pairs, v1.2" }};

pairCssRules[4] = `.spruit-field.findpairs-4 .board {
  background-color: #9ACD32;
  margin: 1em;
  padding:1em;
}
.spruit-field.findpairs-4 .board button {
  background: #ffff00;
  color: #333300;
}`;

pairs.push(new PairsImplementation[4].f({ fieldName:PairsImplementation[4].usage.args.fieldName }));
spruits2.addCssRule(pairCssRules[4]);

//****************************************************************************************************************************************************************************
pageName = "Entity";
screens[pageName] = createDocPage(pageName, [
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  In order to better separete the application logic from its view, the framework introduces an enhanced container called Entity. The idea is that logically related components are grouped into an Entity-component. It is binded to the 
  application logic via the application's store-object and controller-method. The store is for Two-Way communication; the entity gets data from the application logic, may update the data and the controller takes an action which is 
  needed based on the update. Application's components may work in sequence and are not needed at the same time. So often, it is convenient that there are many Entities which together compose the view of the application`),
      $("<p>").html(`
  Entity gets its components in a property called <code>screen</code>. It is an object, but it does not contain components as properties directly. Instead, it has two methods: <code>create</code> and <code>update</code>. The first one 
  is called when the entity is needed in the application's view and the latter one is called when the application state has changed so that one or more of the entity's components have to be updated. Both methods get the entity and the
  store as arguments. However, you do not call these methods directly but via helper methods <code>load</code> and <code>refresh</code>, respectively. This way you don't have to check if the required methods exist because the helpers
  do it for you. Since this forms a whole application architect it is best to start the experimentation in the hello world style.
     `),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text(`function HelloWorld() {
  let controller, store, state, States = {}, screen;

  screen = {
    create:function(entity, store) {
      entity.$field.append("Hello World");
      entity.$label.attr({style:"display:none"});
    },
    update:function(entity, store) {
    }
  };

  controller = function(){};
  store = {controller:controller};
  spruits.Entity.call(this, { screen:screen });
  this.load(store);
}

$("body").append((new HelloWorld({})).$field);`)
      ),
      $("<p>").html(`
  This example does not do much but atleast it contains the above mentioned enhancements so we can use this as the basis, when the Find Pairs game is developed to contain more features and we'll see how the architecture serves the 
  implementation of the application.
      `)
    )),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  So far Find Pairs-game has only one screen. This section adds two more screens. In the first one the player chooses the level of the game. Another new screen is for showing the "game over" and offering a replay possibility. So there 
  will be three screens which are called "init", "play" and "gameover".`),
      $("<p>").html(`
  This is implemented so that all three screens get their own Entity. The application logic, or methods <code>shuffleCards</code> and <code>play</code>, is separated to its own class called Game. View control is done by the FindPairs 
  class via its controller-method and screen-object. The state of the application consists of these three screens so the States-property is updated accordingly. 
     `),
      $("<p>").html("Here is the skeleton of the refactored Find Pairs-implementation."),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text(PairsImplementation[4].skeleton.toString())
      ),
      $("<p>").html(`
  In the screen-object of FindPairs-class the same board container is created as in the one-screen version of the application (this happens when the load-method is called). When the create-method has done its job, it calls the 
  controller-method which updates the current state and calls the update-method of its screen. The current state is needed in the update-method too because it has to setup the board to contain the relevant entity.
      `),
      $("<p>").html("Here is the implementation of the FindPairs-screen."),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text(PairsImplementation[4].screens["FindPairs"])
      ))),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  In the Init-state, the level of the game selection is implemented by "Select Level"-field which is type of RadioGroup-component. Player sees three radio-buttons for Easy, Medium and Hard. The screen has a hard coded value for the 
  size of the pairList in each level. It is given for the Game-object which is instantiated when the player has made the choice and presses the play-button element. After that, the game's state is changed to "play". The Game-object is
  stored to the application's <code>game</code>-property.
      `),      
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text("  " + pairs[4].ScreenEntities.init.toString())
      ))),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  Play-state does the same as the single-screen version of the game: cards are suffled and the associated Card-components are created and set to the board. Game-logic is called whenever the player clicks a card. The logic decides when 
  this state has been done and updates the application state accordingly.
      `),      
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text("  " + pairs[4].ScreenEntities.play.toString())
      ))),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  In the Gameover-state, there is a button-element which changes state to "init", when the button is clicked.
      `),      
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text("  " + pairs[4].ScreenEntities.gameover.toString())
      ))),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  Game-logic is now in Game-class. When the game-object is created in the "init"-state, the number of the pairs is given in the arguments. Property <code>pairList</code> is initialized according that number. Game is able to play with 
  any number of pairs. It is upto the "init"-state to decide the number. ShuffleCards-method providers an array of the cards in a random order. It works in the same way as in the single-screen version of the game. PlayGame-method has 
  been renamed to <code>play</code>. It has been enhanced by the check for the end of the game. This is done with the help of the <code>removed</code>-property which counts the pairs found. When all cards have been removed from the 
  board, the game's state is updated to "gameover".
      `),      
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text("  " + pairs[4].Game.toString())
      ))),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").append(
	$("<div>").html("Here is refactored Find Pairs-game in the action:"),
	pairs[4].$field
      )),
    $("<p>", { style:"font-size:0.8em;" }).append( $("<a>", { href:"javascript:;", style:"color:#999900" }).html("Full Source").on("click", e => {
      let $usage = $("<code>").text('(new ' + PairsImplementation[4].usage.name + '({})).$field'),
	  rg = RadioGroupImplementation[2].f.toString() + " // RadioGroup\n",
	  $impl = PairsImplementation[4].f.toString() + " // FindPairs\n";
      
      handleClickFullSource(e, [
	rg,
	"spruits2.addCssRule(`" + cssRules[1] + "`);",
	"spruits2.wc(RadioGroup);",

	Card.toString(),
	"spruits2.addCssRule(`" + cardCssRules + "`);",
	
	$impl,
	"spruits2.addCssRule(`" + pairCssRules[4] + "`);",
	'$("body").append($("<div>", { class:"page slideIn"}).append("<h4>Find Pairs Demo</h4>", ' + $usage.text() + '));',
      ], PairsImplementation[4].usage.args.fieldName);
    }))
  )
]);

//****************************************************************************************************************************************************************************
// PageManager

let SlideshowImplementation = [], slideshow=[], slideshowCss = [];
SlideshowImplementation[0] = {};
SlideshowImplementation[0].f = function Slideshow(args) {
  args.screens = {};
  args.menubar = [];
  args.dropdown = {};
  spruits2.PageManager.call(this, args);
};
slideshow[0] = new SlideshowImplementation[0].f({});

//****************************************************************************************************************************************************************************
SlideshowImplementation[1] = {};
SlideshowImplementation[1].f = function PageManagerAsField(args) {
  let screens = { "Component":{ create:(entity,store) =>{} },
		  "Container":{ create:(entity,store) =>{} },
		  "Entity":{ create:(entity,store) =>{} },
		  "PageManager":{ create:(entity,store) => {
		    /* This screen will contain a PageManager as a field. */
		  } } };
  
  $("body").append((new spruits2.PageManager({ screens:screens })).$field);
};

slideshowCss[1] = `.spruit-field.slideshow-0 {
  display: block;
  width: 80%;
  margin-left: 10%;
  background: #666600;
  position: relative;
  height:20em;
  margin-top:0.5em;
}
.spruit-field.slideshow-0 .page,
.spruit-field.slideshow-0 .homepage,
.spruit-field.slideshow-0 .pageboxes {
  position: absolute;
  overflow-y: hidden;
}`;
spruits2.addCssRule(slideshowCss[1]);

slideshow[1] = new SlideshowImplementation[1].f({ fieldName:"Slideshow", insertLabel:false });
slideshow[1].$field.children(".spruits-crud").addClass("hide");

//****************************************************************************************************************************************************************************
SlideshowImplementation[2] = {};
SlideshowImplementation[2].f = function Slideshow(args) {
  let
  slideList = [ "Slide1", "Slide2", "Slide3" ],
  
  Pager = function Pager(args) {
    args.screens = {};
    slideList.forEach(slideName => {
      args.screens[slideName] = { create:function(entity) {
	entity.$field.append( $("<img>", { alt:slideName, src:slideName + ".JPG", width:"100%" }) );
      } };
    });

    args.menubar = [ "File" ];

    args.dropdown = {};
    args.dropdown["File"] = slideList.slice();

    spruits2.PageManager.call(this, args);
    this.$field.addClass("slideshow hide");
    //this.$field.children(".spruits-crud").addClass("hide");

    // create slides
    this.$field.find(".myhome").trigger("click");
    this.$field.find("#Slide1").trigger("click");
    this.$field.find("#Slide3").trigger("click");
    this.$field.find("#Slide2").trigger("click");
    this.$field.find(".myhome").trigger("click");
    
    $(window).on("resize", () => this.setHeight());

    this.setHeight = function setHeight(propName, val, func) {
      let height, h;
      
      h = (this.$field.width() * 0.704) + "px";
      height = val ? val : h;
      this.$field.animate({ height: val ? val : h }, func);

      return height;
    };
  },

  showOn,
  
  handleSlideshow = function handleSlideshow(counter) {
    pager.$field.find(".fa-arrow-circle-left").trigger("click");
    counter++;
    if (counter < slideList.length) setTimeout(handleSlideshow, 5000, counter);
    else showOn = false;
  },
  
  handleClickPlay = function handleClickPlay(e) {
    let h;
    
    e.preventDefault();
    pager.$field.removeClass("hide");
    h = pager.setHeight("animate", undefined, () => {

      if (showOn !== true) {
	pager.$field[0].scrollIntoView({behavior: "smooth"});
	setTimeout(handleSlideshow, 5000, 0);
	showOn = true;
      }
    });
  },
  
  handleClickPause = (e) => {
    e.preventDefault();
  },

  handleClickStop = (e) => {
    e.preventDefault();
    pager.setHeight("animate", "0px", () => {
      pager.$field.addClass("hide").css({ display:"" });
      // pager.$field.attr("style", "");
    });
  },

  pager,
  
  init = function fieldConstructor(that) {
    pager = new Pager({ fieldName:"Slideshow", insertLabel:false });

    spruits2.Component.call(that, { fieldName:args.fieldName });
    that.$label.append($("<i>", { class:"fa fa-play",  style:"margin-left:0.5em" }).on("click", handleClickPlay),
		       $("<i>", { class:"fa fa-pause", style:"margin-left:0.5em" }).on("click", handleClickPause),
		       $("<i>", { class:"fa fa-stop",  style:"margin-left:0.5em" }).on("click", handleClickStop));
    that.$field.append(pager.$field).addClass("slideshow-app");
  };
  
  init(this);

  // These are for the doc only
  this.pager = pager;
  this.init = init;
  this.handleSlideshow = handleSlideshow;
  this.handleClickPlay = handleClickPlay;
}; // Slideshow
SlideshowImplementation[2].usage = { name:"Slideshow", args:{ fieldName:"Trip to Stockholm" }};

slideshow[2] = new SlideshowImplementation[2].f({ fieldName:"Trip to Stockholm" });
slideshowCss[2] = {};
slideshowCss[2]["formulatePager"] = `.spruit-field.slideshow {
  display: block;
  width: 80%;
  margin-left: 10%;
  background: lightcyan;
  position: relative;
  margin-top:0.5em;
}
.spruit-field.slideshow .page,
.spruit-field.slideshow .homepage,
.spruit-field.slideshow .pageboxes {
  position: absolute;
  background: lightcyan;
  overflow-y: hidden;
}`;
spruits2.addCssRule(slideshowCss[2]["formulatePager"]);

slideshowCss[2]["screenHides"] = `.slideshow .spruit-screen > label {
  display: none;
}
.slideshow .page.slideOut.hide,
.slideshow .page.slideOutToLeft.hide {
  display: none;
}`;
spruits2.addCssRule(slideshowCss[2]["screenHides"]);

// XXX this is not needed, when DBPageManager-component has been implemented
spruits2.addCssRule(`
.spruits-crud.hide.fadeIn {
  display: none;
}`);

slideshowCss[2]["buttonPanel"] = `.spruit-field.slideshow-app {
  margin-bottom: 1em;
  display: block;
}
.spruit-field.slideshow-app > label {
  width:16em;
}
.spruit-field.slideshow-app .fa-play, 
.spruit-field.slideshow-app .fa-pause, 
.spruit-field.slideshow-app .fa-stop {
  padding: 5px;
  border-top: 1px solid #bbbb00;
  border-right: 2px solid #bbbb00;
  border-bottom: 1px solid #bbbb00;
  border-radius: 4px;
  background: var(--backgroundColor);
  color: #999900;
  padding-left: 8px;
}
.spruit-field.slideshow.hide {
  display: none;
}`;
spruits2.addCssRule(slideshowCss[2]["buttonPanel"]);

//****************************************************************************************************************************************************************************
pageName = "PageManager";
let prettyPrintNopageSlideshow = function(pmHtml) {
  pmHtml = pmHtml
    .replace('<label></label>',                                                                        '\n  <label></label>\n\n  ')
    .replace('><span class="spruit-field">',                                                           '>\n    <span class="spruit-field">\n      ')
    .replace('<ul class="spruits-menubar"></ul></span></div>',                                         '\n      <ul class="spruits-menubar"></ul></span></div>\n\n  ')
    .replace('<li class="navi-button"><i class="fa fa-home myhome"></i></li>',                         '\n    <li class="navi-button"><i class="fa fa-home myhome"></i></li>\n    ')
    .replace('<li class="navi-button"><i class="fa fa-arrow-circle-right arrow-swipe"></i></li></ul>', '\n    <li class="navi-button"><i class="fa fa-arrow-circle-right arrow-swipe"></i></li></ul>');
  return pmHtml.slice(0, pmHtml.indexOf('<span class="spruits-modal"')) + "</span>"; // remove crud, notification, calendar and timepicker
};
screens[pageName] = createDocPage(pageName, [
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  PageManager has been designed to present paged content. It gets the content as screens like the Find Pairs-game in the Entity-chapter. Each screen is packed into Entity-component by the manager so developer does not need to code 
  Entity by himself but just a plain object like the Find Pairs-screen. Additional functionality, for example a menubar, can be injected. But lets start in the hello world style and use the default injection which just creates the
  screens.
      `),
      $("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text(`const helloWorlds = {
  "Spain":{
    create:function(entity, store) {
      entity.$field.append("Hola Mundo");
    }
  },
  "Germany":{
    create:function(entity, store) {
      entity.$field.append("Hallo Welt");
    }
  },
  "France":{
    create:function(entity, store) {
      entity.$field.append("Bonjour Monde");
    }
  }
};
pm = new spruits.PageManager({ screens:helloWorlds });`) ),
      $("<p>").html(`
  If you try it you should see three browsable pages.
      `),
      $("<p>").html(`
  Hooray.
      `)
    )
  ),
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  PageManager has been styled to cover the whole screen by default. The field spesific CSS formulates the field and changes the positioning to be relative to the field and not to the screen.
      `),
      $("<code>", { class:"cssrules" }).append(
	$("<pre>").css({ "padding-left":"1em" }).append(slideshowCss[1])
      ),
      $("<p>").html("Here is the skeleton of the app's implementation."),
      $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text(SlideshowImplementation[1].f.toString())
      ),
      $("<p>").html("Here is the slideshow v0.1 in the action. Navigate to Homepage and create slides. Then manually walktrough the slideshow."),
      slideshow[1].$field,
      $("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text('menubar = [ "Slides" ];') ),
      $("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text('dropdown = { "Slides": [ "Slide1", "Slide2", "Slide3" ] };') ),
      $("<p>").html(`
  Next step is to create the screens of the entities. All screens contain one image. This is done for all slideNames in the Slides-dropdown. Note that only width is set for the images. Images' height will be scaled a:
      `),
      $("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text(
	'screens[slideName] = {\n  create:function(entity) {\n    entity.$field.append( $("<img>", { alt:slideName, src:slideName + ".JPG", width:"100%" }) );\n  }\n};'
      )),
      $("<p>").html(`
  The example PageManager-field is called Slideshow. It will contain three images. First step is to create a menu which is able to trigger creation of the pages and entities which contain the slides.  
     `)
    )
  ),
  $("<div>", { class:"field-row dotted last" }).append(
      $("<p>").html(`
  Field's logic is added around PageManager. First the slides are created programmatically.
      `),
    $("<code>").append(
      $("<pre>").css({ "padding-left":"1em" }).text([
	'this.$field.find(".myhome").trigger("click");',
	'this.$field.find("#Slide1").trigger("click");',
	'this.$field.find("#Slide3").trigger("click");',
	'this.$field.find("#Slide2").trigger("click");',
	'this.$field.find(".myhome").trigger("click");'].reduce((all, line) => { return all + line + "\n"; }, ""))
    ),
    $("<p>").html(`
  When the size of the screen changes, i.e. the device is rotated or the browser window is resized, the image is scaled automatically but the height of the field must be set by the application. The images have been chosen carefully so 
  the logic does not have to be complex. Carefully chosen means that they are same size and all are landscape oriented. Simple height adjustment-logic catches the resize-event and re-sets the height according the new width of the screen
  and precalculated size-ratio.
    `),
    $("<code>", { class:"impl" }).append(
	$("<pre>").css({ "padding-left":"1em" }).text('$(window).on("resize", () => this.setHeight());\n')
    ),
    $("<code>", { class:"impl" }).append(
      $("<pre>").css({ "padding-left":"0", "margin-left":"-1.5em" }).text("    " + slideshow[2].pager.setHeight.toString())
    ),
    $("<p>").html(`
  Field's implementation is refactored so that in the initial state user sees the field name and Play, Pause and Stop-buttons which are used to control the slideshow. Therefore, the field extends Component and PageManager is its
  property. In the initial PageManager is hidden.
    `),
    $("<code>", { class:"impl" }).append(
      $("<pre>").css({ "padding-left":"0" }).text("  " + slideshow[2].init.toString())
    ),
    $("<p>").html(`
  When a user clicks the Play-button, the field's height is set first, then PageManager is scrolled smoothly to the screen. At this point, the user sees the first slide. The click-handler starts a timer for 5-secs. When the timer
  expires the callback function <code>handleSlideshow</code> takes the control. It changes the slide by triggering a click to the page-navigation button. The timer is restarted until the user has seen all slides.
    `),
    $("<code>", { class:"impl" }).append(
      $("<pre>").css({ "padding-left":"0" }).text("  " + slideshow[2].handleSlideshow.toString()),
      $("<pre>").css({ "padding-left":"0" }).text("  " + slideshow[2].handleClickPlay.toString())
    ),
    $("<p>").html(`
  If the slideshow is performed manually in the above skeleton PageManager, it can be seen that the slide name and the previous slide are visible. These are hidden via CSS rules.
     `),
      $("<code>", { class:"cssrules" }).append(
	$("<pre>").css({ "padding-left":"1em" }).append(slideshowCss[2]["screenHides"])
      ),
    $("<p>").html(`
  The field initial state and the button-panel get their outlook from the CSS rules. The last rule makes sure that PageManager is unvisible when the show is closed.
     `),
      $("<code>", { class:"cssrules" }).append(
	$("<pre>").css({ "padding-left":"1em" }).append(slideshowCss[2]["buttonPanel"])
      ),
    $("<p>").html("Here is the slideshow v1.0 in the action."),
    slideshow[2].$field.css({ "padding-left":"1em" }),
    $("<p>", { style:"font-size:0.8em;" }).append( $("<a>", { href:"javascript:;", style:"color:#999900" }).html("Full Source").on("click", e => {
      let $usage = $("<code>").text('(new ' + SlideshowImplementation[2].usage.name + '({})).$field'),
	  $impl = SlideshowImplementation[2].f.toString() + " // Slideshow\n";
      // $cssrules = $(e.target).parent().prev().prev().children(".cssrules").children("pre");
      
      handleClickFullSource(e, [
	$impl,
	"spruits2.addCssRule(`" + Object.values(slideshowCss[2]).reduce((all,rule) => { return all + rule; }, "") + "`);",
	
	'// XXX this is not needed, when DBPageManager-component has been implemented',
        'spruits2.addCssRule(`.spruits-crud.hide.fadeIn { display: none; }`);',
	
	'$("body").append($("<div>", { class:"page slideIn"}).append("<h4>Slideshow Demo</h4>", ' + $usage.text() + '));',
      ], SlideshowImplementation[2].usage.args.fieldName);
    }))
  )
]);

//****************************************************************************************************************************************************************************
pm = spruits2.init({ screens:screens, menubar:menubar, dropdown:dropdown });
pm.$field.addClass("spruitsdoc");
$("body").append(pm.$field);

$(".spruitsdoc").children(".homepage").children(":first")
  .removeClass("spruit-field")
  .addClass("spruit-screen")
  .children("label").html("Table of Contents");
$(".spruitsdoc").children(".homepage").children(":first").children(".spruits-menubar").addClass("hide");

$("#Introduction").trigger("click");
$("#Screen JS".replace(/ /g, "")).trigger("click");
$("#Component".replace(/ /g, "")).trigger("click");
$("#Container".replace(/ /g, "")).trigger("click");
$("#Entity".replace(/ /g, "")).trigger("click");
$("#PageManager".replace(/ /g, "")).trigger("click");

$(".spruitsdoc").children(".pageboxes").children(".navi-button").children(".fa-arrow-circle-right").trigger("click");

      /*
      switch (propName) {
      case "height":
	let w = this.$field.width();
	height = w * 0.704;
	this.$field.height(w * 0.704);
	break;
      case "animate":
	let h = (this.$field.width() * 0.704) + "px";
	height = val ? val : h;
	this.$field.animate({ height: val ? val : h }, func);
	break;
      }
      */
