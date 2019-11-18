//****************************************************************************************************************************************************************************
// init
function init() {
  Component.call(this, args);
  Container.call(this, this.name);
  
  if (view !== undefined) {
    numRows = view.fields[this.name].get("numRows");
    colTypes = view.fields[this.name].get("colTypes");
    container = view.fields[this.name].get("container");
  } else {
    container = this; // new Container();
  }

  table = createComponentTable(colTypes, numRows, container, view);
  currentWidth = mediaQuery();
  if (view === undefined) {
    if (currentWidth && attrs !== undefined && attrs.table !== undefined && attrs.table.position !== undefined && attrs.table.position.create === true) {
      createPositionView(table, this.$field, attrs, colTypes.slice());
    } else {
      createView(currentWidth, table, this.$field, this.$label, rowNum, colTitle, cellNum, (attrs !== undefined) ? attrs.rowtitle : undefined, colTypes.map(val => val.title), colTypes.slice(), forceTableview);
    }
    if (responsive) resizeAgent.addComponent(this);
  }
}

//****************************************************************************************************************************************************************************
function createComponentTable(colTypes, numRows, container, view) {
    return Array(numRows).fill(null).map((row, rowI) => colTypes.map((col, colI) => { 
      let itemName, colName, colArgsUniq;
      
      colName = ((col.title !== undefined) && (col.title.length)) ? col.title : ("" + colI);
      itemName = rowI + "-" + colName;
      if (view === undefined) {
	colArgsUniq = Object.assign({}, col.args);
        container.createField(itemName, col.type, colArgsUniq);
        return container.fields[itemName];
      } else {
        return new col.type({ fieldName:itemName, view:container });
      }
}))}

//****************************************************************************************************************************************************************************
function createTableview(srcArg, $dest, rowNum, colTitle, cellNum, rowTitle, colTitles, colTypes) {
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

//****************************************************************************************************************************************************************************
function createCustomTypeView(srcArg, $dest, $label, rowNum, colTitle, cellNum, rowTitle, colTitles) {
  let rowtitle, insertLabel = true;

  if (attrs !== undefined && attrs.rowtitle !== undefined) {
    rowtitle = rowNum ? attrs.rowtitle.map((title, i) => { return ("" + (i+1) + " " + title); }) : attrs.rowtitle;
  } else {
    rowtitle = Array(numRows).fill(null).map((val, i) => { return ("" + (i+1)); });
    if (!rowNum) insertLabel = false;
  }
  srcArg.forEach((row, i) => {
    let cellCounter = "";
    const rowComp = new Component({ fieldName:rowtitle[i], insertLabel:insertLabel, $field:$("<div>", (attrs && attrs.$row) ? attrs.$row : {class:"field-row"}) });
    
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

  $label.siblings(":last").addClass("last");
  $label.nextAll().addClass("spruits-container padding");
};

//****************************************************************************************************************************************************************************
function createView(currentWidth, srcArg, $dest, $label, rowNum, colTitle, cellNum, rowTitle, colTitles, colTypes, forceTableview) {
  (currentWidth || forceTableview) ? createTableview(srcArg, $dest, rowNum, colTitle, cellNum, rowTitle, colTitles, colTypes) : createCustomTypeView(srcArg, $dest, $label, rowNum, colTitle, cellNum, rowTitle, colTitles);
};

//****************************************************************************************************************************************************************************

// src:[ row, row, ... ], row:[ component, component, ... ]
// $dest
// attrs:{ table:{ position:{ create:boolean, table, coltitle, tr, td }}}, 
//   table:{}, coltitle:{ posi:[ [ "col-style", "col-style", ... ], [], ... ], titles:[ "", "", ... ]}
function createPositionView(src, $dest, attrs, colTypes) {
    let 
      positionAttr = attrs.table.position, 
      $table = $(DIV).attr(positionAttr.table ? positionAttr.table : {});

    if (positionAttr.coltitle !== undefined) {
      positionAttr.coltitle.posi.forEach((posi, posiI) => positionAttr.coltitle.titles.forEach((title, titleI) => $table.append($(DIV).html(title).attr({ "style": "position:absolute;" + posi[titleI] })) ));
    }

    $table.append( src.map((row, rowI) => {
      return $(SPAN)
        .attr(isString(positionAttr.tr[rowI]) ? { "style": "position:relative;" + positionAttr.tr[rowI] } : positionAttr.tr[rowI])
        .append(attrs.rowtitle !== undefined ? $(DIV).html(attrs.rowtitle[rowI]).attr({ "style":"position:absolute;" + positionAttr.rowtitle[rowI] }) : [])
        .append(row.map((comp, i) => { 
          let $td = $(DIV);
          if ( positionAttr.td !== undefined) {
            // isString(positionAttr.td[i]) ? comp.$field.attr({ "style":"position:absolute;" + positionAttr.td[i] }) : comp.$field.attr(positionAttr.td[i]);
            $td.attr( isString(positionAttr.td[i]) ? { "style":"position:absolute;" + positionAttr.td[i] } : positionAttr.td[i] );
          }
	  if (colTypes[i].args.insertLabel !== true) comp.$label.html("");
          return $td.append(comp.$field.attr("class", (colTypes[i].args.fieldClass === undefined) ? "" : colTypes[i].args.fieldClass));
      }));
    }));

    $dest.append($table);
};  // createPositionView

//****************************************************************************************************************************************************************************
function getVal(propName) {
  switch(propName) {
  default:
    return table.map(row => {
      let val=[];
      row.forEach((comp, i) => { if (colTypes[i].ignore !== true) val.push(comp.get("val")); });
      return val;
    });
    // return table.map(row => row.map(comp => comp.get("val")));
    break;
  case "empty":
    return table.map(row => {
      let val=[];
      row.forEach((comp, i) => { if (colTypes[i].ignore !== true) val.push(comp.get("empty")); });
      return val;
    });
    // return table.map(row => row.map(col => col.get("empty")));
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

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
  if (val === undefined) {
    val = propName;
    propName = "val"; // table.forEach((row, rowI) => row.forEach((col, colI) => col.set("val", propName[rowI][colI])));
  }

  switch(propName) {
  case "val":
    // table.forEach((row, rowI) => row.forEach((col, colI) => col.set("val", val[rowI][colI])));
    for (let rowI=0; rowI<table.length; rowI++) {
      let row = table[rowI];
      for (let colI=0, valI=0; colI<row.length; colI++) {
	if (colTypes[colI].ignore !== true) {
	  row[colI].set("val", val[rowI][valI]);
	  valI++;
	}
      }
    }
    break;
  case "testcaseTemplate":
    template = val.template;
    templateProcessor = val.templateProcessor;     
    break;
  } // switch (propName)
}; // setVal

//****************************************************************************************************************************************************************************
function empty() {
  table.forEach(row => row.forEach((comp, colI) => { if (colTypes[colI].ignore !== true) comp.empty() }));
}; // empty

//****************************************************************************************************************************************************************************
function validate() {
  let
  compValid, valid = { valid:true };

  table.forEach((row, rowI) => row.forEach((comp, colI) => {
    if (colTypes[colI].ignore !== true) {
      compValid = comp.get("valid");
      if (compValid.valid === false) {
	valid.valid = false;
	if (valid.invalid === undefined) {
          valid.invalid = [];
	}
	valid.invalid.push({ rowI:rowI, colI:colI, value:compValid.invalid });
      }
    }
  }));
  return valid;
}; // validate

//****************************************************************************************************************************************************************************
function resize(comp, newWidth) {
  console.log("resize, comp.name=" + comp.name);
  comp.$label.nextAll().detach();
  if (attrs && isFunction(attrs.span)) this.$field.attr(attrs.span());
  if (newWidth && attrs !== undefined && attrs.table !== undefined && attrs.table.position !== undefined && attrs.table.position.create === true) {
    createPositionView(table, this.$field, attrs, colTypes.slice());
  } else {
    createView(newWidth, table, this.$field, this.$label, rowNum, colTitle, cellNum, (attrs !== undefined) ? attrs.rowtitle : undefined, colTypes.map(val => val.title), colTypes.slice(), forceTableview);
  }
};

//****************************************************************************************************************************************************************************
function setInvalidColor(propName, val) { // val = [{"rowI":0,"colI":0,"value":"q-w"}]
  val.forEach(cell => table[cell.rowI][cell.colI].set("invalid-color", cell.value))
}

//****************************************************************************************************************************************************************************
function resetInvalidColor(propName, val) {
  Object.values(container.fields).forEach(comp => comp.set("reset-invalid-color"))
}

//****************************************************************************************************************************************************************************
exports.className = "Table";
exports.args =      [ "colTitle", "rowNum", "numRows", "cellNum", "colTypes", "attrs", "responsive", "resizeAgent", "forceTableview", "view" ];
exports.props =     [ "table", "container", "currentWidth" ],
exports.methods =   { "createComponentTable":createComponentTable, "createTableview":createTableview, "createCustomTypeView":createCustomTypeView, "createView":createView, "createPositionView":createPositionView }
exports.init =      init;
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate, "resize":resize, setInvalidColor:setInvalidColor, resetInvalidColor:resetInvalidColor, 
};
