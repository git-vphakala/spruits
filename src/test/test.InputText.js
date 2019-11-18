const InputText = spruits2.InputText;

const its = [];

its.push(
  new InputText({ fieldName:"InputText 1", attrs:{ input:[{ size:"50", maxlength:"50" }, { size:"50", maxlength:"50" }] } }),
  new InputText({ fieldName:"InputText 2", attrs:{ input:{ size:"10", maxlength:"10" } } }),
  new InputText({ fieldName:"InputText 3", size:"5" })
);

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>InputText</h4>", its.map(comp => $("<div>").append(comp.$field))
);
