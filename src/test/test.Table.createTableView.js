//****************************************************************************************************************************************************************************
// createTableView
const twsVals = [
  ["11","222","33333"],
  ["aa","bbb","ccccc"],
  ["d1","d22","d3333"] 
];
const twsSrc = createComponentTable([ { type:Component, args:{} }, { type:Component, args:{} }, { type:Component, args:{} } ], 3, new Container());

twsVals.map((row, rowI) => row.map((val, colI) => { twsSrc[rowI][colI].$field = val; }));
//console.log(jstableToString(twsSrc));

const rowTitle = [ "rowtitle1", "rowtitle22", "rowtitle333" ];
const colTitle = [ "coltitle 1", "coltitle 22", "coltitle 333" ];
const tws = [
//  fieldName                   rowNum  colTitle cellNum rowTitle
  [ "Column Title, Row Title",  false,  true,    false,  rowTitle,  colTitle ],
  [ "Row Title",                false,  false,   false,  rowTitle,  undefined ],
  [ "Column Title",             false,  true,    false,  undefined, colTitle ],
  [ "Column Title, Row Number", true,   true,    false,  undefined, colTitle ],
  [ "Row Number",               true,   false,   false,  undefined, colTitle ],
  [ "Just table data",          false,  false,   false,  undefined, colTitle ],
  [ "Cell Number",              false,  false,   true,   undefined, colTitle ],
//  0                           1       2        3       4          5
];
const twsComponents = tws.map(val => {
  let
    i = 0,
    table = new Component({ fieldName:val[i++] });

  //              src     dest          rowNum    colTitle  cellNum   rowTitle, colTitles
  createTableview(twsSrc, table.$field, val[i++], val[i++], val[i++], val[i++], val[i++]);

  return table;
});

$("body").append(
"<h4>createTableView</h4>",
$("<ol>").append( twsComponents.map(comp => $("<li>").append(comp.$field)) )
);
