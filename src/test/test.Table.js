//****************************************************************************************************************************************************************************
const isString =    spruits2.isString;
const Component =   spruits2.Component;
const Container =   spruits2.Container;
const DigitString = spruits2.DigitString;
const InputDate =   spruits2.InputDate;
const Table =       spruits2.Table;
const Calendar =    spruits2.Calendar;
const ResizeAgent = spruits2.ResizeAgent;

const testcases = [];

//****************************************************************************************************************************************************************************
const cal = new Calendar({ fieldName:"Calendar", $modalcontainer:$("body") });
const ra  = new ResizeAgent({ fieldName:"resizeAgent" });

//****************************************************************************************************************************************************************************
// Table, Table View
const tableTws = [
  { fieldName:"Column Title, Row Title",  numRows:2, colTitle:true,  attrs:{ rowtitle:[ "rowtitle1", "rowtitle22" ] }, colTypes:[ { type:InputDate, args:{cal:cal}, title:"Input Date", } ]},
  { fieldName:"Row Title",                numRows:2,                 attrs:{ rowtitle:[ "rowtitle1", "rowtitle22" ] }, colTypes:[ { type:InputDate, args:{cal:cal}, } ]},
  { fieldName:"Column Title",             numRows:2, colTitle:true,                                                    colTypes:[ { type:InputDate, args:{cal:cal}, title:"Input Date", } ]},
  { fieldName:"Column Title, Row Number", numRows:2, colTitle:true,  rowNum:true,                                      colTypes:[ { type:InputDate, args:{cal:cal}, title:"Input Date", } ]},
  { fieldName:"Row Number",               numRows:2,                 rowNum:true,                                      colTypes:[ { type:InputDate, args:{cal:cal} } ]},
  { fieldName:"Just table data",          numRows:2,                                                                   colTypes:[ { type:InputDate, args:{cal:cal} } ]},
  { fieldName:"Cell Number",              numRows:2,                 cellNum:true,                                     colTypes:[ { type:InputDate, args:{cal:cal} }, { type:InputDate, args:{cal:cal} } ]},
  { fieldName:"Column Title, Row Title & Number", numRows:2, colTitle:true, rowNum:true, attrs:{ rowtitle:[ "rowtitle1", "rowtitle22" ] }, colTypes:[ { type:InputDate, args:{cal:cal}, title:"Input Date", } ]},
];
const tableTwsComponents = tableTws.map(val => { 
  return new Table({ fieldName:val.fieldName, numRows:2, colTitle:val.colTitle, attrs:val.attrs, rowNum:val.rowNum, cellNum:val.cellNum, colTypes:val.colTypes });
});
//****************************************************************************************************************************************************************************

const getTablePwAttrsSpan = function(h) { return({ style:("position:relative;display:block;height:" + h + ";") }); }
const tablePwRowTitles =    [ "rowtitle1", "rowtitle22" ];
const getTablePwTable =     function(arg) { const n=[ undefined, "row", "cell" ]; return (arg ? { class:"spruit-table-" + n[arg] + "num" } : undefined); }
const getTablePwTr =        function(tops) { return tops.map(val => isString(val) ? ("top:" + val + ";") : ({  "class":"spruit-rownum-counter", "style":"position:relative;top:" + val.top + ";" })); }
const getTablePwTd =        function(lefts) { return lefts.map(val => { return {"class":"ws-nowrap spruit-cellnum-counter", "style":"position:absolute;left:" + val + ";"} }); }
const getTablePwColtitle =  function(posiAttrs) { 
  return ({ 
    titles:[ "col title 1", "col title 2" ], 
    posi:[ posiAttrs.map(val => ("display:inline-block;width:5em;left:" + val.left + ";top:" + val.top + ";")) ],
  }); 
}
const tablePwPositionRowtitle = [ "left:3em;", "left:3em;" ];
const tablePwColtypes =     [
  { type:InputDate, args:{cal:cal}, title:"Input Date 1", },
  { type:InputDate, args:{cal:cal}, title:"Input Date 2", }
];
const getTablePwAttrs = function(spanArg, rowtitleArg, tableArg, trArg, tdArg, coltitleArg) {
  return {
    span:spanArg ? getTablePwAttrsSpan(spanArg) : undefined,
    rowtitle:rowtitleArg ? tablePwRowTitles : undefined,
    table:{
      position:{
        create:   true,
        table:    getTablePwTable(tableArg),
        tr:       getTablePwTr(trArg),
        td:       getTablePwTd(tdArg),
        coltitle: coltitleArg !== undefined ? getTablePwColtitle(coltitleArg) : undefined, 
        rowtitle: tablePwPositionRowtitle,
  }}}; // position, table, return
}

//****************************************************************************************************************************************************************************
// createPositionView
const pws = [
  { fieldName:"pw Column Title, Row Title",  attrs:{ span:getTablePwAttrsSpan("6em") }, posi:[true,  undefined, [ "1em", "3em" ], [ "8em", "20em" ], [ { left:"8em", top:"1em" }, { left:"20em", top:"1em" } ]] },
  { fieldName:"pw Row Title",                attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[true,  undefined, [ "0em", "2em" ], [ "8em", "20em" ], undefined] },
  { fieldName:"pw Column Title",             attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[false, undefined, [ "0em", "2em" ], [ "8em", "20em" ], [ { left:"8em", top:"0em" }, { left:"20em", top:"0em" } ]] },
  { fieldName:"pw Column Title, Row Number", attrs:{ span:getTablePwAttrsSpan("6em") }, posi:[false, 1,         [ { top:"1em" }, { top:"3em" } ], [ "7em", "20em" ], [ { left:"8em", top:"1em" }, { left:"20em", top:"1em" } ]] },
  { fieldName:"pw Row Number",               attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[false, 1,         [ { top:"0em" }, { top:"2em" } ], [ "7em", "20em" ], undefined] },
  { fieldName:"pw Just Table Data",          attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[false, undefined, [ "0em", "2em" ], [ "8em", "20em" ], undefined] },
  { fieldName:"pw Cell Number",              attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[false, 2,         [ "0em", "2em" ], [ "5.5em", "17.5em" ], undefined] },
];

//****************************************************************************************************************************************************************************
// Table, Position View
const tablePws = [
  { fieldName:pws[0].fieldName.slice(3), span:"6em", posi:pws[0].posi },
  { fieldName:pws[1].fieldName.slice(3), span:"5em", posi:pws[1].posi },
  { fieldName:pws[2].fieldName.slice(3), span:"5em", posi:pws[2].posi },
  { fieldName:pws[3].fieldName.slice(3), span:"6em", posi:pws[3].posi },
  { fieldName:pws[4].fieldName.slice(3), span:"5em", posi:pws[4].posi },
  { fieldName:pws[5].fieldName.slice(3), span:"5em", posi:pws[5].posi },
  { fieldName:pws[6].fieldName.slice(3), span:"5em", posi:pws[6].posi },
];
let tablePwsComponents = tablePws.map(arg => { 
  let i = 0;
  return new Table({ fieldName:arg.fieldName, numRows:2, colTypes:tablePwColtypes, attrs:getTablePwAttrs(arg.span, arg.posi[i++], arg.posi[i++], arg.posi[i++], arg.posi[i++], arg.posi[i++]) });
});

//****************************************************************************************************************************************************************************
// View
const fields = [
  [ "Number Masks", Table, { numRows:3, colTypes:[ { type:DigitString, args:{ size:"15" } } ] } ],
  [ "Service ID", DigitString, { size:"5", attrs:{ label:{ style:"padding-bottom:0.5em;" } } } ],
  [ "Valid Until", InputDate, { cal:cal } ],
];
const tabs = [ "1", "2", "3", "4", "5" ];

const view = new Container();
fields.forEach(field => view.createField(field[0], field[1], field[2]));
const viewComponents = Object.values(view.fields);

function handleTabButtonClick(event, $tabName, container) { 
  let current = $tabName.html(), srv;

  event.preventDefault();
  if (current === container.name) return;

  if (current.length) {
    // Store the view to the current service.        
    srv = services.find((srv) => { return (srv.container.name === current) });
    srv !== undefined ? srv.val = viewComponents.map(comp => { return comp.get("val"); }) : console.log("srv undefined");
  }

  $tabName.html(container.name); // Set the clicked as current and set the view to show the current.
  srv = services.find(srv => srv.container.name === container.name);
  viewComponents.map((comp, i) => ((srv !== undefined) && (srv.val !== undefined)) ? comp.set("val", srv.val[i]) : comp.set("empty"));
}

const services = tabs.map(name => { 
  let 
    container = new Container(name), // { name:name }), 
    $button   = $("<button>").html(name).on("click", (e) => handleTabButtonClick(e, $serviceName, container));

  fields.map(field => container.createField(field[0], field[1], { view:view } ));
  return { container:container, button:$button, val:undefined };
});

const $serviceName = $("<span>").html("");
const $legend =      $("<legend>").append( "Service ", $serviceName);
const $fieldset =    $("<fieldset>").append( $legend, "This is the view of the services.", $("<div>").css({display:"flex"}).append(Object.values(view.fields).map(comp => comp.$field)) );
const $buttons =     services.map(srv => srv.button);

let service = new Component({ fieldName:"Services" });
service.$field.append( $("<div>").css("padding-top","0.5em").append($buttons), $fieldset );
services[0].button.trigger("click");

//****************************************************************************************************************************************************************************
// Responsive Table
testcases.push({ $field:"<h5>Responsive Table</h5>" });

const responsiveColTypes = [
  { title:"Col 1", type:DigitString, args:{ size:"5" } },
  { title:"Col 2", type:InputDate, args:{ cal:cal }, ignore:true },
  { title:"Col 3", type:InputDate, args:{ cal:cal } }
];
const responsiveRowtitle = [ "Aaaaaaaaa AA", "Bbbb bbbbbbbbb BB", "Ccccccccccccccccccccc" ];

function Testcase3(rtbl) {
  let $val = $("<div>"),
      $getVal = $("<button>").html("get.val").on("click", e => {
	let $table = $("<table>");
	e.preventDefault();
	$val.html("");
	$val.append( $table );
	$table.append(rtbl.get("val").map(row => { return $("<tr>").append(row.map(col => { return $("<td>").html(col); })); }));
	$set.val(JSON.stringify(rtbl.get("val")));
      }),
      $getEmpty = $("<button>", { style:"margin-left:1em" }).html("get.empty").on("click", e => {
	$set.val(JSON.stringify(rtbl.get("empty")));
      }),
      $empty = $("<button>", { style:"margin-left:1em" }).html("empty").on("click", e => {
	rtbl.empty();
      }),
      $validate = $("<button>", { style:"margin-left:1em" }).html("validate").on("click", e => {
	$set.val(JSON.stringify(rtbl.validate()));
      }),
      $set = $("<textarea>", { cols:"60" }),
      $setVal = $("<button>", { style:"margin-left:1em" }).html("set.val").on("click", e => {
	e.preventDefault();
	rtbl.set("val", JSON.parse($set.val()));
      });
  Component.call(this, { fieldName:"testcase3", insertLabel:false });
  this.$field.append("<p><hr/></p>", rtbl.$field, $("<div>").append($val), $("<div>").append($getVal, $getEmpty, $empty, $validate), $("<div>").css({ "margin-top":"1em" }).append($set, $setVal));
}

testcases.push(new Testcase3(
  new Table({ fieldName:"Column Title, Row Title",          numRows:3, colTitle:true,              attrs:{ rowtitle:responsiveRowtitle.slice() }, colTypes:responsiveColTypes.slice(),               responsive:true, resizeAgent:ra })
), new Testcase3(
  new Table({ fieldName:"Row Title",                        numRows:3,                             attrs:{ rowtitle:responsiveRowtitle.slice() }, colTypes:responsiveColTypes.slice(),               responsive:true, resizeAgent:ra })
), new Testcase3(
  new Table({ fieldName:"Column Title",                     numRows:3, colTitle:true,                                                             colTypes:responsiveColTypes.slice(),               responsive:true, resizeAgent:ra })
), new Testcase3(
  new Table({ fieldName:"Column Title, Row Number",         numRows:3, colTitle:true, rowNum:true,                                                colTypes:responsiveColTypes.slice(),               responsive:true, resizeAgent:ra })
), new Testcase3(
  new Table({ fieldName:"Row Number",                       numRows:3,                rowNum:true,                                                colTypes:responsiveColTypes.slice(),               responsive:true, resizeAgent:ra })
), new Testcase3(
  new Table({ fieldName:"Just table data",                  numRows:3,                                                                            colTypes:responsiveColTypes.slice(),               responsive:true, resizeAgent:ra })
), new Testcase3(
  new Table({ fieldName:"Cell Number",                      numRows:3,                                                                            colTypes:responsiveColTypes.slice(), cellNum:true, responsive:true, resizeAgent:ra })
), new Testcase3(
  new Table({ fieldName:"Column Title, Row Title & Number", numRows:3, colTitle:true, rowNum:true, attrs:{ rowtitle:responsiveRowtitle.slice() }, colTypes:responsiveColTypes.slice(),               responsive:true, resizeAgent:ra })
));

//****************************************************************************************************************************************************************************
let GamesTable = function(args) {
  let Pen, Cancel, gamesTable;

  Pen = function Pen(args) {
    let $pen = $("<i>", { class:"fa fa-pencil" });
    
    spruits2.Component.call(this, args);
    this.$field.append($pen.on("click", e => {
      let rowI = args.fieldName.split("-")[0], origVal;

      e.preventDefault();

      if ($pen.hasClass("fa-pencil")) {
	origVal = gamesTable.fields[rowI + "-players"].get("val");
	gamesTable.fields[rowI + "-5"].set("origVal", origVal);
	
	gamesTable.fields[rowI + "-players"].$input
	  .prop("disabled", false)
	  .addClass("editable");
	gamesTable.fields[rowI + "-5"].$field.removeClass("hidden");
	gamesTable.fields[rowI + "-4"].get("$pen").removeClass("fa-pencil").addClass("fa-check");
      } else { // fa-check
	gamesTable.fields[rowI + "-players"].$input
	  .prop("disabled", true)
	  .removeClass("editable");
	gamesTable.fields[rowI + "-4"].get("$pen").removeClass("fa-check").addClass("fa-pencil");
	gamesTable.fields[rowI + "-5"].$field.addClass("hidden");
      }
    }));
    this.$label.css({ display:"none" });

    this.getVal = function(propName) {
      return $pen;
    };
    this.setVal = function(propName, val) {
      let rowI = args.fieldName.split("-")[0];
      if (val === undefined) {
	val = propName;
	propName = "val";
      }
      gamesTable.fields[rowI + "-players"].$input.val(val);
    };
  };

  Cancel = function(args) {
    let origVal;
    
    spruits2.Component.call(this, args);
    this.$field.append($("<i>", { class:"fa fa-ban" }).on("click", e => {
      let rowI = args.fieldName.split("-")[0];

      e.preventDefault();
      
      gamesTable.fields[rowI + "-players"].$input
	.prop("disabled", true)
	.removeClass("editable");
      gamesTable.fields[rowI + "-5"].$field.addClass("hidden");    
      gamesTable.fields[rowI + "-4"].get("$pen").removeClass("fa-check").addClass("fa-pencil");
      gamesTable.fields[rowI + "-4"].set("val", origVal);
    }));
    this.$label.css({ display:"none" });

    this.setVal = function setVal(propName, val) {
      origVal = val;
    };
  };

  //gamesTable = new spruits2.Table(
  spruits2.Table.call(this, {
    fieldName:"Games", fieldClass:"spruit-field games", numRows:3, colTitle:true, colTypes: [
      { type:spruits2.DigitString,        args:{ attrs:{ input:{ size:"3" }},  props:{ input:{ disabled:true }} }, title:"Id" },
      { type:spruits2.AlphaNumericString, args:{ attrs:{ input:{ size:"20" }}, props:{ input:{ disabled:true }}, matchRegExp:/[^a-z0-9A-Z,]/ }, title:"players" },
      { type:spruits2.DigitString,        args:{ attrs:{ input:{ size:"1" }},  props:{ input:{ disabled:true }} }, title:"#pairs" },
      { type:spruits2.AlphaNumericString, args:{ attrs:{ input:{ size:"7" }},  props:{ input:{ disabled:true }} }, title:"state" },
      { type:Pen,                         args:{ fieldClass:"edit"}, ignore:true },
      { type:Cancel,                      args:{ fieldClass:"cancel hidden"}, ignore:true }
    ],
    responsive:true, resizeAgent:ra
  });
  gamesTable = this;
}; // GamesTable

spruits2.addCssRule(`
.spruit-field.games .edit .fa-pencil, .spruit-field.games .edit .fa-check, .spruit-field.games .cancel .fa-ban {
  padding: 5px;
  border-top: 1px solid #bbbb00;
  border-right: 2px solid #bbbb00;
  border-bottom: 1px solid #bbbb00;
  border-radius: 50%;
  background: var(--backgroundColor);
  color:#333300;
  margin-left:1em;
}
.spruit-field.cancel.hidden .fa-ban {
  display:none;
}
.spruit-field.games input.editable {
  border-bottom:1px solid #000000;
}`);

testcases.push(new Testcase3(new GamesTable()));

//****************************************************************************************************************************************************************************
$("body").append($("<div>", { class:"page slideIn" }).append(
  "<hr/>", "<h4>Table, Table View</h4>",   $("<ol>").append( tableTwsComponents.map(comp => $("<li>").append(comp.$field)) ),
  "<hr/>", "<h4>Table, Position View</h4>",$("<ol>").append( tablePwsComponents.map(comp => $("<li>").append(comp.$field)) ),
  "<hr/>", "<h4>View</h4>", service.$field,
  testcases.map(testcase => testcase.$field)
));

