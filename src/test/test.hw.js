let hw = new spruits2.Component({ fieldName:"Hello World" });
$("body").append(hw.$field);

$("body").append($("<div>", { style:"background:#ffff00;height:1em;" }));

let hwe = new spruits2.Component({ fieldName:"Hello World", attrs:{ label:{ style:"color:red;font-weight:bold;" }} });
$("body").append(hwe.$field);

$("body").append($("<div>", { style:"background:#fffd11;height:0.5em;" }));

$("#spruits-app-styles").append(`.spruit-field .hw-label { color:blue; font-weight:bold; }`);
$("body").append((new spruits2.Component({ fieldName:"Hello World", attrs:{ label:{ class:"hw-label" }} })).$field);
