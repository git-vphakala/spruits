const Component = spruits2.Component;
const Calendar = spruits2.Calendar;
const TimePicker = spruits2.TimePicker;
const AlphaNumericString = spruits2.AlphaNumericString;
const DigitString = spruits2.DigitString;
const DecimalDigitString = spruits2.DecimalDigitString;
const InputDate =   spruits2.InputDate;
const InputDateAndTime = spruits2.InputDateAndTime;
const InputCheckbox = spruits2.InputCheckbox;
const Select =      spruits2.Select;
const Table =       spruits2.Table;
const Modal =       spruits2.Modal;
const isString = spruits2.isString;
const Entity = spruits2.Entity;
const Menu = spruits2.Menu;

const testcases = [];

//****************************************************************************************************************************************************************************
const cal = new Calendar({ fieldName:"Calendar", $modalcontainer:$("body") });
const tp = new TimePicker({ fieldName:"TimePicker", $modalcontainer:$("body") });

//****************************************************************************************************************************************************************************
const Testcase = function(menu) {
  Component.call(this, { fieldName:menu.name, insertLabel:false });

  this.$field = menu.$field;
};

//****************************************************************************************************************************************************************************
const handleClickDropdown = function(e, item) {
  e.preventDefault();

  console.log("handleClickDropdown, item=" + item);
};

testcases.push(new Testcase(
  new Menu({
    fieldName:"Menu 1",
    menubar:[ "File", "Edit", "View", "Transfer", "Server", "Bookmarks", "Help" ],
    dropdown:{
      "File":[ { text:"Site Manager...", onClick:handleClickDropdown }, "Copy current connection to Site Manager...", "New tab", "Close tab", "Export...", "Import...", "Show files currently being edited...", "Exit" ],
      "Edit":[ "Network configuration wizard...", "Clear private data...", "Settings..." ],
      "View":[ "Refresh", "Directory listing filters...", "Directory comparison...", "Synchronized browsing", "Filelist status bars", "Toolbar", "Quickconnect bar", "Message log", "Local directory tree",
	       "Remote directory tree", "Transfer queue" ],
      "Transfer":[ "Process Queue", "Default file exists action...", "Transfer type", "Preserve timestamps of transferred files", "Speed limits", "Manual transfer..." ],
      "Server":[ "Cancel current operation", "Reconnect", "Disconnect", "Search remote files...", "Enter custom command...", "Force showing hidden files" ],
      "Bookmarks":[ "Add bookmark...", "Manage bookmarks" ],
      "Help":[ "Check for updates...", "Show welcome dialog", "Getting help...", "Report a bug", "About..." ],
    },
    onClickDropdown:handleClickDropdown,
  })
));
//****************************************************************************************************************************************************************************
const Testcase2 = function(menu, $tabs, $sheets) {
  Component.call(this, { fieldName:menu.name, insertLabel:false });

  this.$field.append( menu.$field, $tabs, $sheets );
};

let menu2;
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
      entity.addScreenLabel();
      entity.insertFields();
    } /* create */
  }, // Subscription
}; // screens
let $tabs = $("<div>");
let $sheets = $("<div>");
let handleClickDropdown2 = function(e, item) {
  let entity, handleClickButton, $button=$("<button>");

  handleClickButton = function(e, entity) {
    e.preventDefault();
    
    entity.$field.siblings().addClass("hide"); // other entities are hidden
    entity.$field.toggleClass("hide");
  };
      
  e.preventDefault();
      
  console.log("Menu 2, onClickDropdown, item=" + item);

  entity = screens[item] ? new Entity({ fieldName:item, screen:screens[item], cal:cal, timepicker:tp }) : new Entity({ fieldName:item });
  entity.load();
  $tabs.append( $button.html(item).on("click", (e) => handleClickButton(e, entity)) );
  entity.$field.addClass("hide");
  $sheets.append(entity.$field);
  $button.trigger("click");
};
menu2 = new Menu({
  fieldName:"Menu 2",
  menubar:[ "File" ],
  dropdown:{
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
  },
  onClickDropdown:(e, item) => handleClickDropdown2(e, item),
});

testcases.push(new Testcase2(menu2, $tabs, $sheets));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>Menu</h4>", testcases.map(testcase => testcase.$field)
);
