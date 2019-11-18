/* This is menu and screens for the test application BAO. Copy to ../../bao.js. 
 * This file is generated from menu and screens source files.
 */

var bao = (function() {
"use strict";

  let
  TABLE = spruits2.TABLE,
  TH = spruits2.TH,
  TR = spruits2.TR,
  TD = spruits2.TD,
  DIV = spruits2.DIV,
  SPAN = spruits2.SPAN,
  INPUT = spruits2.INPUT,
  I = spruits2.I,
  DEFAULT_FIELD_CLASS = spruits2.DEFAULT_FIELD_CLASS,

  isArray = spruits2.isArray,
  isFunction = spruits2.isFunction, 
  isString = spruits2.isString, 
  getId = spruits2.getId,
  mediaQuery = spruits2.mediaQuery,

  Component = spruits2.Component,
  InputText = spruits2.InputText,
  AlphaNumericString = spruits2.AlphaNumericString,
  DigitString = spruits2.DigitString,
  DecimalDigitString = spruits2.DecimalDigitString,
  InputCheckbox = spruits2.InputCheckbox, 
  Select = spruits2.Select,
  Modal = spruits2.Modal,
  Calendar = spruits2.Calendar,
  InputDate = spruits2.InputDate,
  Modes = spruits2.Modes,
  Spinner = spruits2.Spinner,
  TimePicker = spruits2.TimePicker,
  InputTime = spruits2.InputTime,
  InputDateAndTime = spruits2.InputDateAndTime,
  ResizeAgent = spruits2.ResizeAgent,
  Table = spruits2.Table,
  TabSheet = spruits2.TabSheet, 
  CustomType = spruits2.CustomType,
  Entity = spruits2.Entity,
  Container = spruits2.Container,
  Menu = spruits2.Menu,
  PageManager = spruits2.PageManager,
  TouchManager = spruits2.TouchManager,
  init = spruits2.init,

  menubar, dropdown, screens;

  menubar = [ "File" ];
  
  dropdown = {
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

  screens = {  
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

  return {
    menubar: menubar,
    dropdown:dropdown,
    screens:screens,
  };
  
  }());
