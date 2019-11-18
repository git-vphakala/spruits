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
const pwsVals = [
  ["11","222"],
  ["aa","bbb"]
];
const pwsSrc = createComponentTable([ { type:Component, args:{} }, { type:Component, args:{} } ], 2, new Container());
pwsVals.map((row, rowI) => row.map((val, colI) => { pwsSrc[rowI][colI].$field = val; }));

const pws = [
  { fieldName:"pw Column Title, Row Title",  attrs:{ span:getTablePwAttrsSpan("6em") }, posi:[true,  undefined, [ "1em", "3em" ], [ "8em", "20em" ], [ { left:"8em", top:"1em" }, { left:"20em", top:"1em" } ]] },
  { fieldName:"pw Row Title",                attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[true,  undefined, [ "0em", "2em" ], [ "8em", "20em" ], undefined] },
  { fieldName:"pw Column Title",             attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[false, undefined, [ "0em", "2em" ], [ "8em", "20em" ], [ { left:"8em", top:"0em" }, { left:"20em", top:"0em" } ]] },
  { fieldName:"pw Column Title, Row Number", attrs:{ span:getTablePwAttrsSpan("6em") }, posi:[false, 1,         [ { top:"1em" }, { top:"3em" } ], [ "7em", "20em" ], [ { left:"8em", top:"1em" }, { left:"20em", top:"1em" } ]] },
  { fieldName:"pw Row Number",               attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[false, 1,         [ { top:"0em" }, { top:"2em" } ], [ "7em", "20em" ], undefined] },
  { fieldName:"pw Just Table Data",          attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[false, undefined, [ "0em", "2em" ], [ "8em", "20em" ], undefined] },
  { fieldName:"pw Cell Number",              attrs:{ span:getTablePwAttrsSpan("5em") }, posi:[false, 2,         [ "0em", "2em" ], [ "5.5em", "17.5em" ], undefined] },
];
let pwsComponents = pws.map(arg => { 
  let comp = new Component(arg), i = 0;
  let pwsAttrs = getTablePwAttrs(undefined, arg.posi[i++], arg.posi[i++], arg.posi[i++], arg.posi[i++], arg.posi[i++]);
  let pwsTitles = { rowTitles: pwsAttrs.rowtitle                ? pwsAttrs.rowtitle.slice()                       : undefined, 
                    colTitles: pwsAttrs.table.position.coltitle ? pwsAttrs.table.position.coltitle.titles.slice() : undefined };
  //if (pwsAttrs.table.position.coltitle) pwsAttrs.table.position.coltitle.titles = undefined;

  createPositionView( pwsSrc, comp.$field, 
    pwsAttrs, 
    pwsTitles);
  return comp;
});

//****************************************************************************************************************************************************************************
$("body").append(
  "<hr/>", "<h4>createPositionView</h4>",  $("<ol>").append( pwsComponents.map(comp => $("<li>").append(comp.$field)) )
);
