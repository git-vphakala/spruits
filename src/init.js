// this copied from ./src to ../components
init = function(args) {
  let pm, tm, screens = args.screens, menubar = args.menubar, dropdown = args.dropdown;

  pm = new PageManager({ fieldName:"PageManager", insertLabel:false, screens:screens, menubar:menubar, dropdown:dropdown });
  tm = new TouchManager({ fieldName:"TouchManager" });

  return pm;
};
