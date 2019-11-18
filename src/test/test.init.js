const Component = spruits2.Component;
const Calendar = spruits2.Calendar;
const TimePicker = spruits2.TimePicker;
const InputDateAndTime = spruits2.InputDateAndTime;
const Menu = spruits2.Menu;
const Entity = spruits2.Entity;
const init = spruits2.init;

const testcases = [];

//****************************************************************************************************************************************************************************
const Testcase = function(pm) {
  Component.call(this, { fieldName:pm.name, insertLabel:false });

  this.$field = pm.$field;
};

const screens = {};
const menubar = [ "File" ];
const dropdown = {
  "File":[ { text:"New window", dropdown:true }, "Properties" ],

  "New window":[ { text:"Subscription Data Menu", dropdown:true }, { text:"MG Owned Data Menu", dropdown:true }, { text:"TP Owned Data Menu", dropdown:true } ],
  "Subscription Data Menu":[ "Subscription", "Account", "Sub Account", "Best Friend List", "Family Friend List", "Automatic Hybrid Account", "Prefixed Hybrid Account", "Account Reservation", "Subscriber Based Screening",
			     "Group" ],
  "MG Owned Data Menu":[ { text:"MG Provider Menu 1", dropdown:true }, { text:"MG Provider Menu 2", dropdown:true }, { text:"MG System Menu", dropdown:true } ],
  
  "MG Provider Menu 1":[ { text:"Service Provider Menu", dropdown:true }, "Announcement Map", "Special Day", "Switch Location", "Notification", "Subscription Type Product",
			 { text:"Product Menu", dropdown:true }, { text:"Tariff Menu", dropdown:true }, "Size Class", "USSD Service", "Price", "Subscription Type Service" ],
  "Service Provider Menu":[ "Service Provider", "Location Ranges", "Prefix List" ],
  "Product Menu":[ "Product", "Product Partitions", "Product Not Allowed Best Friend", "Product Not Allowed Family Friend", "Recharge Bonus", "Accumulator Configuration",
		   "Product Partition Detail", "Product Partitions Group", "Debit Class" ],
  "Tariff Menu":[ "Tariff", "Tariff Rate Module" ],
  
  "MG Provider Menu 2":[ { text:"Range Menu", dropdown:true }, "Rate", "Rate Profile", "Partition Usage List", "Screened Number", "Special Number", "Short Code Translation",
			 "Flow Based Charging", "Redirect Profile", "Network Address", "Charge", "Charge Map" ],
  "Range Menu":[ "Range", "Range Set" ],
  
  "MG System Menu": [ "Feature", "Global Parameters", "Popup Parameter", "Parallel Number Support", "Network Security", "Subscriber Range", "Time Zone", "Acceptable Cards",
		      "External Source", "External Source Authorization", "Bearer Capability", "Calling Card Access Number", "Calling Card Prefix Exception",
		      "Calling Card Prefix Translation", "Diameter Service Context", "Number Normalization Rule", "RAT Map" ],
  "TP Owned Data Menu":[ "Application Parameters", { text:"Voice Interaction Logic Maintenance Menu", dropdown:true }, "Global", "Originating Switch", "SRP", "GT Routing", "Overload", "Database Configuration",
			 "MSISDN/Destination Addr Range SMSC", "SMSC Address", "SCP Routing", "Number Prefix", "Call Treatment", "Local Parameters", "HLR Subscriber Ranges",
			 { text:"Diameter API Menu", dropdown:true }, "Flow", "Scheduled Notification", "Recharge Reversal" ],
  "Voice Interaction Logic Maintenance Menu":[ "Batch", "Bundle Type Profile", "IVR Logic Parameters", "IVR Digits" ],
  "Diameter API Menu":[ "Diameter Configuration", "Diameter API Session", "Diameter Peer" ],
};
/*const init = function(args) {
  let pm, tm, screens = args.screens, menubar = args.menubar, dropdown = args.dropdown;

  pm = new PageManager({ fieldName:"PageManager", insertLabel:false, screens:screens, menubar:menubar, dropdown:dropdown });
  tm = new TouchManager({ fieldName:"TouchManager" });

  return pm;
};*/

testcases.push(new Testcase( init({ screens:screens, menubar:menubar, dropdown:dropdown }) ));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>init</h4>", testcases.map(testcase => testcase.$field)
);
