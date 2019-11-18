const Component =   spruits2.Component;
const Container =   spruits2.Container;
const AlphaNumericString = spruits2.AlphaNumericString;
const DigitString = spruits2.DigitString;
const DecimalDigitString = spruits2.DecimalDigitString;
const InputDate =   spruits2.InputDate;
const InputDateAndTime = spruits2.InputDateAndTime;
const InputCheckbox = spruits2.InputCheckbox;
const Select =      spruits2.Select;
const Table =       spruits2.Table;
const Modal =       spruits2.Modal;
const Calendar =    spruits2.Calendar;
const TimePicker =  spruits2.TimePicker;
const ResizeAgent = spruits2.ResizeAgent;
const getId =       spruits2.getId;
const mediaQuery =  spruits2.mediaQuery;
const isFunction =  spruits2.isFunction;
const TabSheet =    spruits2.TabSheet;
const Entity =      spruits2.Entity;
const isString =    spruits2.isString;

const testcases = [];

//****************************************************************************************************************************************************************************
const cal = new Calendar({ fieldName:"Calendar", $modalcontainer:$("body") });
const tp = new TimePicker({ fieldName:"TimePicker", $modalcontainer:$("body") });
const resizeAgent  = new ResizeAgent({ fieldName:"resizeAgent" });

//****************************************************************************************************************************************************************************
const Testcase = function(entity) {
  Component.call(this, { insertLabel:false });

  entity.load();
  
  this.$field.append(entity.$field, "<hr/>");
}

//****************************************************************************************************************************************************************************
testcases.push(new Testcase(
  new Entity({ fieldName:"TBA" })
));

//****************************************************************************************************************************************************************************
let screens = {
  "Subscription": { 
    create: function(entity) {
      let field39Row;
      
      /* 1 */
      entity.createField("Mobile Number", DigitString, { size:"32", isKey:true });
      /* 2 */
      entity.createField("Subscription Type", AlphaNumericString, { size:"5" });
      /* 3 */
      entity.createField("State", Select, {
        options:{ "Installed":1, "Active":2, "Insufficient Funds":3, "Deactive":4, "Disconnected":5, "Pre-activated":6, "Passive":7, "PortedOut":8, "NotInrtBilling":9, "TP-active":21, 
                  "TP-Insufficient Funds":31 } 
      });
      /* 4 */
      entity.createField("Activation Date", InputDateAndTime, { cal:entity.cal, timepicker:entity.timepicker });
      /* 5 */
      entity.createField("State Expiry Date", InputDate, { cal:entity.cal });
      /* 6 */
      entity.createField("Disable Mediation", InputCheckbox);
      /* 7 */
      entity.createField("Free Friend Time FF", InputDateAndTime, { cal:entity.cal, timepicker:entity.timepicker });
      /* 8 */
      entity.createField("BF", InputDateAndTime, { cal:entity.cal, timepicker:entity.timepicker });
      /* 9 */
      entity.createField("Account ID", DigitString, { size:"32" });
      /* 10 */
      entity.createField("Screening ID", AlphaNumericString, { size:"16" });
      /* 11 */
      entity.createField("Controlled Account ID", DigitString, { size:"32" });
      /* 12 */
      entity.createField("Transfer From CA", Select, {
        options: { "Disabled":0, "Automatic":1, "Manual":2 }
      });
      /* 13 */
      entity.createField("Hybrid Accounts", Select, {
        options: { "Not in use":0, "Prefixed":1, "Automatic":2, "Prefixed and Automatic":3 }
      });
      /* 14 */
      entity.createField("Service Provider ID", DigitString, { size:"3" });
      /* 15 */
      entity.createField("Product ID", DigitString, { size:"20" });
      /* 16 */
      entity.createField("Billing Group", AlphaNumericString, { size:"5" });
      /* 17 */
      entity.createField("Home Location ID", AlphaNumericString, { size:"20" });
      /* 18 */
      entity.createField("IMSI", DigitString, { size:"15" });
      /* 19 */
      entity.createField("Lifecycle Options", Select, {
        options:{ "Follow":0, "Do not follow":1, "Do not use":2 }
      });
      /* 20 */
      entity.createField("Language", AlphaNumericString, { size:"5" });
      /* 21 */
      entity.createField("Registered", InputCheckbox);
      /* 22 */
      entity.createField("Tariff Change Ind", Select, {
        options:{ "Not selected":0, "Selected and unchangeable":1, "Selected and changeable":2 }
      });
      /* 23 */
      entity.createField("FF/BF Menu Enabled", InputCheckbox);
      /* 24 */
      entity.createField("Default Time Zone ID", AlphaNumericString, { size:"5", matchRegexp:/^[0-9a-zA-Z\+\-]+$/ });
      /* 25 */
      entity.createField("Pass Code", AlphaNumericString, { size:"4" });
      /* 26 */
      entity.createField("Home Zone In Use", InputCheckbox);
      /* 27 */
      entity.createField("Notification Mask", DigitString, { size:"10" });
      /* 28 */
      entity.createField("Notification Method SMS", InputCheckbox);
      /* 29 */
      entity.createField("Enable Initial Low Balance Warning", InputCheckbox);
      /* 30 */
      entity.createField("Calling Card", Select, {
        options:{ "No":0, "Ad-hoc":1, "CLI":2 }
      });
      /* 31 */
      entity.createField("Enable Pre Announcement", InputCheckbox);
      /* 32 */
      entity.createField("Enable M-Commerce", InputCheckbox);
      /* 33 */
      entity.createField("Enable Post Announcement", InputCheckbox);
      /* 34 */
      entity.createField("Privacy (internal)", DigitString, { size:"1" });
      /* 35 */
      entity.createField("Enable Balance Notification via USSN", InputCheckbox);
      /* 36 */
      entity.createField("Privacy (external)", DigitString, { size:"1" });
      /* 37 */
      entity.createField("Promotional Discount", Table, {
	numRows:1, rowNum:false, colTitle:true,
	colTypes: [
	  { title:"Start", type:InputDate, args:{ cal:entity.cal } },
	  { title:"End",   type:InputDate, args:{ cal:entity.cal } }
	],
	//responsive:true,
	attrs:{
	  mediaquery:{ span:() => { return true; } },
	  span:() =>  { return mediaQuery() ? { style:"position:relative;display:inline-block;height:4.5em;color:#333300;" } : { style:"" }; },
	  table: { 
	    position: {
	      create:true,
	      table: { style:"position:absolute;left:0;top:0;" },
	      coltitle: {
		titles:[ "Start", "End" ],
		posi:[ ["top:0em; left:11em;", "top:0em; left:23em;"] ]
	      },
	      tr:[ "" ],
	      td:[ "position:absolute;top:0; left:13em; display: inline-block;width: 10em;", "position:absolute;top:0; left:25em; display: inline-block;width: 10em;" ]

	    }},
	  $row:{ class:"field-row-nocolors dotted" },
	}, // position, table, attrs
      });
      /* 38 */
      entity.createField("Group ID", Table, {
	numRows:3, rowNum: true, colTitle:false, cellNum:false,
	colTypes: [
	  { type:AlphaNumericString, args:{ size:"12" } }
	],
	attrs:{ span:{ style:"margin-right:0;" } },
	forceTableview:true,
	responsive:false,
      });
      /* 39 */
      field39Row = (top, left) => { return { class:"spruit-rownum-counter", style:"position:absolute;top:" + top + ".5em;width:4em;left:" + left + "em;" }; };
      entity.createField("Loyalty Bonus Programs", Table, {
	numRows:16, colTitle:false, rowNum:true,
        colTypes: [
          { type:InputCheckbox, args:{} }
        ],
	responsive:true,
        attrs:{
          mediaquery:{ span:()=>{return true;} },
          span:() => { return mediaQuery() ? {style:"position:relative;display:inline-block;height:4.5em;"} : {style:""}; }, // XXX () => like 37
          table: { 
            position: {
              create:true, // mediaQuery(),
              table: { class:"spruit-table-rownum-nocoltitle", style:"position:absolute;left:0;top:0;" },
              tr:[ 
                field39Row(1, 0), field39Row(1, 4), field39Row(1, 8), field39Row(1, 12), field39Row(1, 16), field39Row(1, 20), field39Row(1, 24), field39Row(1, 28), 
                field39Row(3, 0), field39Row(3, 4), field39Row(3, 8), field39Row(3, 12), field39Row(3, 16), field39Row(3, 20), field39Row(3, 24), field39Row(3, 28)
              ] 
            }}}, // position, table, attrs
	forceTableview:true, // This forces between createTableview and createCustomTypeView
      });
      /* 40 */
      entity.createField("Max Sum Of Reservations", DecimalDigitString);
      /* 41 */
      entity.createField("Max Amount of Reservation", DecimalDigitString);
      /* 42 */
      entity.createField("Hybrid Subscription Options", Table, {
	numRows:1, colTitle:true, cellNum:false,
	colTypes: [
          { title:"Use Default", type:InputCheckbox, args:{} },
          { title:"Fallback",    type:InputCheckbox, args:{} }
        ],
        attrs:{
	  span:{ style:"margin-right:0;" },
	  $row:{ class:"field-row-nocolors dotted" },
	},
	responsive:true,
      });
      /* 43 */
      entity.createField("Last Known Time Zone", Table, {
	numRows:1, colTitle:true, cellNum:false,
	colTypes: [
          { title:"ID",   type:AlphaNumericString, args:{ size:"5" } },
          { title:"Type", type:Select,             args:{ width:2.75, options:{"":"", "Undefined":0, "CellID":1, "MSC ID or equivalent":2, "time&timezone":3, "SGSN IP address":4, "MS-TimeZone":5} } }
        ],
	attrs:{ $row:{ class:"field-row-nocolors dotted" } },
	responsive:true,
      });
      /* 44 */
      entity.createField("Last Known MSC ID", DigitString, { size:"50" });
      /* 45 */
      entity.createField("Block All Numbers", InputCheckbox);
      /* 46 */
      entity.createField("Block Reason Code", DigitString, { size:"2" });
      /* 47 */
      entity.createField("Primary MSISDN", DigitString, { size:"32" });
      /* 48 */
      entity.createField("No Screening Notifications", InputCheckbox, { initial:true });
      /* 49 */
      entity.createField("Barring Thresholds", Table, {
	numRows:1, colTitle:false, cellNum:true,
	colTypes: [
          { type:DecimalDigitString, args:{} },
          { type:DecimalDigitString, args:{} }
        ],
        attrs:{ span:{ style:"margin-right:0;" }, $row:{ class:"field-row-nocolors dotted" } },
	responsive:true,
      });
      /* 50 */
      entity.createField("CCA Balance Threshold", DecimalDigitString );
      /* 51 */
      entity.createField("TP Periodic Services", Table, {
	numRows:5, colTitle:true, rowNum:true, 
	colTypes:[
          { "title":"Service Id",        "type":DigitString, "args":{ size:"12" } },
          { "title":"Billed Up To",      "type":InputDate,   "args":{ cal:entity.cal } },
          { "title":"Next Bill Attempt", "type":InputDate,   "args":{ cal:entity.cal } }
        ],
	responsive:true,
	attrs:{ $row:{ class:"field-row-nocolors dotted" } },
      });
      /* 52 */
      entity.createField("Subscription Services", TabSheet, {
	$modalcontainer:$("body"),
	sheetName:"Service ",
        fields:[
          [ "Service ID",        AlphaNumericString, { size:"12"                                                   } ],
          [ "State",             Select,             { options:{ "Off":0, "On":1, "Pending":2 }                    } ],
          [ "Price List ID",     AlphaNumericString, { size:"12"                                                   } ],
          [ "Valid From",        InputDateAndTime,   { mode:"hhmmss", cal:entity.cal, timepicker:entity.timepicker } ],
          [ "Valid Until",       InputDateAndTime,   { mode:"hhmmss", cal:entity.cal, timepicker:entity.timepicker } ],
          [ "Billed Until",      InputDateAndTime,   { mode:"hhmmss", cal:entity.cal, timepicker:entity.timepicker } ],
          [ "Next Billing Time", InputDateAndTime,   { mode:"hhmmss", cal:entity.cal, timepicker:entity.timepicker } ],
        ],
        tabs: [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25" ],
	createScreen:($screen, comps) => { $screen.append(comps.map(comp => comp.$field)); },
	responsive:true,
      });

      entity.addScreenLabel();
      entity.insertFields();
    } /* create */
  }, // Subscription
}; // screens

let fieldName = "Subscription";
testcases.push(new Testcase(
  new Entity({ fieldName:fieldName, screen:screens[fieldName], cal:cal, timepicker:tp, responsive:true, resizeAgent:resizeAgent })
));

//****************************************************************************************************************************************************************************
const Testcase2 = function(entity) {
  let
  $getButton = $("<button>").html('entity.get("val")'),
  $setButton = $("<button>").html('entity.set("val")'),
  $data = $("<div>").append( $("<textarea>").attr({ style:"width:99%;height:10em;margin-right:2em;" }));
  
  Component.call(this, { insertLabel:false });

  entity.load();
  $getButton.on("click", e => {
    let val;
    e.preventDefault();

    val = entity.get("val");
    $data.children("textarea").val("");
    $data.children("textarea").val(JSON.stringify(val));
  });
  $setButton.on("click", e => {
    let val
    e.preventDefault();
    val = $data.children("textarea").val();
    val = JSON.parse(val);
    entity.set("val", val);
  });
  
  this.$field.append(entity.$field, $getButton, $setButton, $data, "<hr/>");
}
fieldName = "All Types";
screens[fieldName] = { 
  create: function(entity) {
    /* 1 */
    entity.createField("Mobile Number", DigitString, { size:"32", isKey:true });
    /* 2 */
    entity.createField("Subscription Type", AlphaNumericString, { size:"5" });
    /* 3 */
    entity.createField("State", Select, {
      options:{ "Installed":1, "Active":2, "Insufficient Funds":3, "Deactive":4, "Disconnected":5, "Pre-activated":6, "Passive":7, "PortedOut":8, "NotInrtBilling":9, "TP-active":21, 
                "TP-Insufficient Funds":31 } 
    });
    /* 4 */
    entity.createField("Activation Date", InputDateAndTime, { cal:entity.cal, timepicker:entity.timepicker });
    /* 5 */
    entity.createField("State Expiry Date", InputDate, { cal:entity.cal });
    /* 6 */
    entity.createField("Disable Mediation", InputCheckbox);
    /* 12 */
    entity.createField("Transfer From CA", Select, {
      options: { "Disabled":0, "Automatic":1, "Manual":2 }
    });
    /* 38 */
    entity.createField("Group ID", Table, {
      numRows:3, rowNum: true, colTitle:false, cellNum:false,
      colTypes: [
	{ type:AlphaNumericString, args:{ size:"12" } }
      ],
      attrs:{ span:{ style:"margin-right:0;" } },
      forceTableview:true,
      responsive:false,
    });
    /* 40 */
    entity.createField("Max Sum Of Reservations", DecimalDigitString);
    /* 52 */
    entity.createField("Subscription Services", TabSheet, {
      $modalcontainer:$("body"),
      sheetName:"Service ",
      fields:[
        [ "Service ID",        AlphaNumericString, { size:"12"                                                   } ],
        [ "State",             Select,             { options:{ "Off":0, "On":1, "Pending":2 }                    } ],
        [ "Next Billing Time", InputDateAndTime,   { mode:"hhmmss", cal:entity.cal, timepicker:entity.timepicker } ],
      ],
      tabs: [ "1", "2" ],
      createScreen:($screen, comps) => { $screen.append(comps.map(comp => comp.$field)); },
      responsive:true,
    });

    entity.addScreenLabel();
    entity.insertFields();
  } /* create */
}; // All types
testcases.push(new Testcase2(
  new Entity({ fieldName:fieldName, screen:screens[fieldName], cal:cal, timepicker:tp, responsive:true, resizeAgent:resizeAgent })
));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>Entity</h4>", testcases.map(testcase => testcase.$field)
);
