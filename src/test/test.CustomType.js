const Component = spruits2.Component;
const Container = spruits2.Container;
const CustomType = spruits2.CustomType;
const DigitString = spruits2.DigitString;
const AlphaNumericString = spruits2.AlphaNumericString;
const TABLE = spruits2.TABLE;
const TH = spruits2.TH;
const TR = spruits2.TR;
const TD = spruits2.TD;
const DEFAULT_FIELD_CLASS = spruits2.DEFAULT_FIELD_CLASS;
const isString = spruits2.isString;
const mediaQuery = spruits2.mediaQuery;

const testcases = [];

//****************************************************************************************************************************************************************************
const Testcase = function(ct, $fields) {
  Component.call(this, { fieldName:ct.name });

  if ($fields) {
    ct.fields["field 1"].$field.append($fields["field 1"]);
    ct.fields["field 2"].$field.append($fields["field 2"]);
  }
  if (ct.$field.children().length) {
    if (!ct.$field.children("label").length) ct.$field.prepend("<span>");
    $("<p>This is some text between lines</p>").insertAfter(ct.$field.children(":nth-child(" + (2) + ")"));
  } else {
    ct.fields["field 1"].$field.css("padding-right", "1em");
    ct.$field.append(
      $("<label>").html(ct.name).on("click", function(){ $(this).next().toggleClass("hide"); return false; }),
      $("<div>", { class:"screen-row hide", style:"padding:1em 0" }).append( Object.values(ct.fields).map(comp => { comp.$field.children("label").css({ "display":"inline-block", "padding-right":"0.5em" }); return comp.$field; }))
    );
  }
  this.$field = $("<div>").append(ct.$field, "<hr/>");
};

//****************************************************************************************************************************************************************************
testcases.push(new Testcase(
  new CustomType({ fieldName:"CustomType 1", fields:{ "field 1":{ type:Component, args:{} }, "field 2":{ type:Component, args:{} } } }), { "field 1":"conan", "field 2":"rocky" }
));
testcases.push(new Testcase(
  new CustomType({ fieldName:"CustomType 2", fields:{ "field 1":{ type:Component, args:{} }, "field 2":{ type:Component, args:{} } }, insertLabel:false }), { "field 1":"conan", "field 2":"rocky" }
));
testcases.push(new Testcase(
  new CustomType({ fieldName:"CustomType 3", fields:{ "field 1":{ type:Component, args:{} }, "field 2":{ type:Component, args:{} } }, insertLabel:false, callback:()=>{} }), { "field 1":"conan", "field 2":"rocky" }
));

//****************************************************************************************************************************************************************************
function ResizeAgent(args) {
  let
  agent, currentWidth,
  handleResizeEvent, addComponent;

  handleResizeEvent = function() {
    let newWidth = mediaQuery();

    if (newWidth !== currentWidth) {
      console.log("ResizeAgent, newWidth=" + newWidth);
      Object.values(agent.fields).forEach(comp => comp.resize(comp, newWidth));
      currentWidth = newWidth;
    }
  };
  
  CustomType.call(this, { fieldName:args.fieldName, fields:{} });

  currentWidth = mediaQuery();
  console.log("ResizeAgent, currentWidth=" + currentWidth);
  
  $(window).on("resize", handleResizeEvent);

  addComponent = function(comp) {
    this.fields["" + Object.values(agent.fields).length] = comp;
  };
  agent = this;
  
  this.addComponent = addComponent;
}

//****************************************************************************************************************************************************************************
function createComponentTable(colTypes, numRows, container, view) {
    return Array(numRows).fill(null).map((row, rowI) => colTypes.map((col, colI) => { 
      let itemName;
      // col.args.insertLabel = (col.args.insertLabel === undefined) ? false : col.args.insertLabel;
      // col.args.fieldClass = (col.args.fieldClass === undefined) ? "" : col.args.fieldClass;
      itemName = rowI + "-" + ((col.title !== undefined) && (col.title.length)) ? col.title : "" + colI;
      if (view === undefined) {
        container.createField(itemName, col.type, col.args);
        return container.fields[itemName];
      } else {
        return new col.type({ fieldName:itemName, view:container });
      }
}))}
//****************************************************************************************************************************************************************************
const ResponsiveTable = function(args) {
  let fields = {}, fieldName = args.fieldName, colTypes = args.colTypes,
      table, rowtitle, attrs = args.attrs, numRows = args.numRows, colTitle = args.colTitle, rowNum = args.rowNum, insertLabel = true, cellNum = args.cellNum, currentWidth,
      resizeAgent = args.resizeAgent,
      createView, createTableview, createCustomTypeView, resize;

  createTableview = function (srcArg, $dest, rowNum, colTitle, cellNum, rowTitle, colTitles, colTypes) {
    const $table = $(TABLE);
    let ct = 0, src;
    
    src = colTitle ? [colTitles].concat(srcArg) : srcArg.slice(); // colTitles-array is added as the first line

    if (rowNum === true) {
      $table.addClass("spruit-table-" + (colTitle === true ? "rownum" : "rownum-nocoltitle"));
    } else if (cellNum === true) {
      $table.addClass("spruit-table-cellnum");
    }

    $table.append( src.map((row, i) => { 
      const $tr = $(TR);

      if (colTitle === true && i === 0) {
	ct = 1;
	if (rowTitle !== undefined) $tr.append( $(TH) );
	return $tr.append( row.map((val,i) => $(TH).html(val)));
      } else {
	if (rowTitle !== undefined) $tr.append( $(TD, { class:"spruit-rowtitle" }).html(rowTitle[i - ct]) );
	return $tr.append( row.map((val, colI) => {
	  if (colTypes[colI].args.insertLabel !== true) val.$label.html("");
	  return $(TD).append(val.$field.attr("class", (colTypes[colI].args.fieldClass === undefined) ? "" : colTypes[colI].args.fieldClass));
	}) ); 
      }} )); // else, =>, src.map, $table.append

    $dest.append($table);
  }; // createTableview
  
  createCustomTypeView = function(srcArg, $dest, $label, rowNum, colTitle, cellNum, rowTitle, colTitles) {
    // let rowtitle, insertLabel = true;
    
    if (attrs !== undefined && attrs.rowtitle !== undefined) {
      rowtitle = rowNum ? attrs.rowtitle.map((title, i) => { return ("" + (i+1) + " " + title); }) : attrs.rowtitle;
    } else {
      rowtitle = Array(numRows).fill(null).map((val, i) => { return ("" + (i+1)); });
      if (!rowNum) insertLabel = false;
    }
    srcArg.forEach((row, i) => {
      let cellCounter = "";
      const rowComp = new Component({ fieldName:rowtitle[i], insertLabel:insertLabel, $field:$("<div>", { class:"field-row" }) });
      
      rowComp.$field.append(row.map((comp, colI) => {
	comp.$label.html((cellNum ? (i*row.length + (colI+1)) + " " : "") + (colTitle ? comp.name : ""));
	comp.$field.addClass(DEFAULT_FIELD_CLASS);
	return comp.$field;
      }));
      $dest.append(rowComp.$field);
      rowComp.$label.nextAll().addClass("hide");
      if (insertLabel === false) rowComp.$label.html("&gt;&gt;");
      rowComp.$label.attr("class", "rowtitle").on("click", () => {
	if (insertLabel === false) rowComp.$label.html( ((rowComp.$label.html() === "&gt;&gt;") ? "&lt;&lt;" : "&gt;&gt;") );
	rowComp.$label.nextAll().toggleClass("hide");
	return false;
      });    
    });
    
    $label.nextAll().addClass("spruits-container padding");
  };

  createView = function(currentWidth, srcArg, $dest, $label, rowNum, colTitle, cellNum, rowTitle, colTitles, colTypes) {
    currentWidth ? createTableview(srcArg, $dest, rowNum, colTitle, cellNum, rowTitle, colTitles, colTypes) : createCustomTypeView(srcArg, $dest, $label, rowNum, colTitle, cellNum, rowTitle, colTitles);
  };
  
  CustomType.call(this,{ fieldName:fieldName, fields:{} });
  currentWidth = mediaQuery();
  table = createComponentTable(colTypes, numRows, this /* container */);

  createView(currentWidth, table, this.$field, this.$label, rowNum, colTitle, cellNum, (attrs !== undefined) ? attrs.rowtitle : undefined, colTypes.map(val => val.title), colTypes.slice());
  /*  Object.values(this.fields).forEach(comp => { comp.$label.siblings(":last").addClass("dotted last"); }); XXX */

  if (resizeAgent) resizeAgent.addComponent(this);

  resize = function(comp, newWidth) {
    console.log("resize, comp.name=" + comp.name);
    comp.$label.nextAll().detach();
    createView(newWidth, table, this.$field, this.$label, rowNum, colTitle, cellNum, (attrs !== undefined) ? attrs.rowtitle : undefined, colTypes.map(val => val.title), colTypes.slice());
  };

  this.resize = resize;
};

function Testcase2(rtbl) {
  Component.call(this, { fieldName:"testcase2", insertLabel:false });
  this.$field.append(rtbl.$field, "<p><hr/></p>");
}

//****************************************************************************************************************************************************************************
testcases.push({ $field:"<h5>Responsive Table</h5>" });
const colTypes = [
  { title:"Col 1", type:DigitString, args:{ size:"5" } },
  { title:"Col 2", type:AlphaNumericString, args:{ size:"10" } }
];
const rowtitle = [ "Aaaaaaaaa AA", "Bbbb bbbbbbbbb BB", "Ccccccccccccccccccccc" ];
const resizeAgent = new ResizeAgent({ fieldName:"resizeAgent" });

testcases.push(new Testcase2(
  new ResponsiveTable({ fieldName:"Column Title, Row Title",          numRows:3, colTitle:true,              attrs:{ rowtitle:rowtitle.slice() }, colTypes:colTypes.slice(),               resizeAgent:resizeAgent })
));
testcases.push(new Testcase2(
  new ResponsiveTable({ fieldName:"Row Title",                        numRows:3,                             attrs:{ rowtitle:rowtitle.slice() }, colTypes:colTypes.slice(),               resizeAgent:resizeAgent })
));
testcases.push(new Testcase2(
  new ResponsiveTable({ fieldName:"Column Title",                     numRows:3, colTitle:true,                                                   colTypes:colTypes.slice(),               resizeAgent:resizeAgent })
));
testcases.push(new Testcase2(
  new ResponsiveTable({ fieldName:"Column Title, Row Number",         numRows:3, colTitle:true, rowNum:true,                                      colTypes:colTypes.slice(),               resizeAgent:resizeAgent })
));
testcases.push(new Testcase2(
  new ResponsiveTable({ fieldName:"Row Number",                       numRows:3,                rowNum:true,                                      colTypes:colTypes.slice(),               resizeAgent:resizeAgent })
));
testcases.push(new Testcase2(
  new ResponsiveTable({ fieldName:"Just table data",                  numRows:3,                                                                  colTypes:colTypes.slice(),               resizeAgent:resizeAgent })
));
testcases.push(new Testcase2(
  new ResponsiveTable({ fieldName:"Cell Number",                      numRows:3,                                                                  colTypes:colTypes.slice(), cellNum:true, resizeAgent:resizeAgent })
));
testcases.push(new Testcase2(
  new ResponsiveTable({ fieldName:"Column Title, Row Title & Number", numRows:3, colTitle:true, rowNum:true, attrs:{ rowtitle:rowtitle.slice() }, colTypes:colTypes.slice(),               resizeAgent:resizeAgent })
));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>CustomType</h4>", testcases.map(testcase => testcase.$field)
);
