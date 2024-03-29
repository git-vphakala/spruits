//****************************************************************************************************************************************************************************
let GamesTable = function(args) {
  let Pen, Cancel, gamesTable;

  Pen = function Pen(args) {
    let $pen = $("<i>", { class:"fa fa-pencil" });
    
    spruits2.Component.call(this, args);
    this.$field.append($pen.on("click", e => {
      let rowI = args.fieldName.split("-")[0], origVal;

      e.preventDefault();

      if ($pen.hasClass("fa-pencil")) {
	origVal = gamesTable.fields[rowI + "-players"].get("val");
	gamesTable.fields[rowI + "-5"].set("origVal", origVal);
	
	gamesTable.fields[rowI + "-players"].$input
	  .prop("disabled", false)
	  .addClass("editable");
	gamesTable.fields[rowI + "-5"].$field.removeClass("hidden");
	gamesTable.fields[rowI + "-4"].get("$pen").removeClass("fa-pencil").addClass("fa-check");
	
      } else { // fa-check
	gamesTable.fields[rowI + "-players"].$input
	  .prop("disabled", true)
	  .removeClass("editable");
	gamesTable.fields[rowI + "-4"].get("$pen").removeClass("fa-check").addClass("fa-pencil");
	gamesTable.fields[rowI + "-5"].$field.addClass("hidden");

	gamesTable.socket.emit("modified game", { matchId:gamesTable.fields[rowI + "-Id"].get("val"), players:gamesTable.fields[rowI + "-players"].get("val").split(",") });
      }
    }));
    this.$label.css({ display:"none" });

    this.getVal = function(propName) {
      return $pen;
    };
    this.setVal = function(propName, val) {
      let rowI = args.fieldName.split("-")[0];
      if (val === undefined) {
	val = propName;
	propName = "val";
      }
      gamesTable.fields[rowI + "-players"].$input.val(val);
    };
  }; // Pen

  Cancel = function(args) {
    let origVal;
    
    spruits2.Component.call(this, args);
    this.$field.append($("<i>", { class:"fa fa-ban" }).on("click", e => {
      let rowI = args.fieldName.split("-")[0];

      e.preventDefault();
      
      gamesTable.fields[rowI + "-players"].$input
	.prop("disabled", true)
	.removeClass("editable");
      gamesTable.fields[rowI + "-5"].$field.addClass("hidden");    
      gamesTable.fields[rowI + "-4"].get("$pen").removeClass("fa-check").addClass("fa-pencil");
      gamesTable.fields[rowI + "-4"].set("val", origVal);
    }));
    this.$label.css({ display:"none" });

    this.setVal = function setVal(propName, val) {
      origVal = val;
    };
  };

  spruits2.Table.call(this, {
    fieldName:"Games", fieldClass:"spruit-field games", numRows:args.numRows, colTitle:true, colTypes: [
      { type:spruits2.DigitString,        args:{ attrs:{ input:{ size:"3" }},  props:{ input:{ disabled:true }} }, title:"Id" },
      { type:spruits2.AlphaNumericString, args:{ attrs:{ input:{ size:"20" }}, props:{ input:{ disabled:true }}, matchRegExp:/[^a-z0-9A-Z,]/ }, title:"players" },
      { type:spruits2.DigitString,        args:{ attrs:{ input:{ size:"1" }},  props:{ input:{ disabled:true }} }, title:"#pairs" },
      { type:spruits2.AlphaNumericString, args:{ attrs:{ input:{ size:"7" }},  props:{ input:{ disabled:true }} }, title:"state" },
      { type:Pen,                         args:{ fieldClass:"edit"}, ignore:true },
      { type:Cancel,                      args:{ fieldClass:"cancel hidden"}, ignore:true }
    ],
    responsive:false,
  });

  this.socket = args.socket;
  gamesTable = this;
}; // GamesTable

spruits2.addCssRule(`
.spruit-field.games .edit .fa-pencil, .spruit-field.games .edit .fa-check, .spruit-field.games .cancel .fa-ban {
  padding: 5px;
  border-top: 1px solid #bbbb00;
  border-right: 2px solid #bbbb00;
  border-bottom: 1px solid #bbbb00;
  border-radius: 50%;
  background: var(--backgroundColor);
  color:#333300;
  margin-left:1em;
}
.spruit-field.games .cancel.hidden {
  display:none;
}
.spruit-field.games input.editable {
  border-bottom:1px solid #000000;
}`);

//****************************************************************************************************************************************************************************
function FindPairsAdmin(args) {
  let State;

  spruits2.Entity.call(this, args);
  this.$field.addClass("findpairsadmin");
  this.$label.css({ display:"none" });
  State = this.get("State");
  State.ScreenEntities = {};
  
  State.ScreenEntities["init"] = function Init(args) {
    args.screen = {
      create:function(entity) {
	let ScreenState = entity.get("State"),
	    $name = $("<input>", { class:"name" }),
	    
	    $login = $("<div>", { class:"login" }).append( $name, $("<i>", { class:"fa fa-check" }).on("click", e => {
	      State.userName = $name.val();
	      if (State.userName.length) {
		ScreenState.state = "login-response";
		State.socket.emit("login", { userName:State.userName });
	      }
	    })),
	    
	    playersList = new spruits2.Component({ fieldName:"Players" }),

	    gamesTable,
	    createGamesTable = function(games, GameStates) {
	      let tt = new GamesTable({ numRows:games.length, socket:State.socket });
		  /*new spruits2.Table({
		    fieldName:"Games", numRows:games.length, colTitle:true, colTypes: [
		      { type:spruits2.DigitString,        args:{ attrs:{ input:{ size:"3", disabled:true }} }, title:"Id" },
		      { type:spruits2.AlphaNumericString, args:{ attrs:{ input:{ size:"20",disabled:true }} }, title:"players" },
		      { type:spruits2.DigitString,        args:{ attrs:{ input:{ size:"1", disabled:true }} }, title:"#pairs" },
		      { type:spruits2.AlphaNumericString, args:{ attrs:{ input:{ size:"7", disabled:true }} }, title:"state" }
		    ],
		    responsive:false,
		  });*/
	      tt.set("val", games.map(game => {
		return ["" + game.matchId, game.players.toString(), "" + game.numPairs, Object.keys(GameStates)[game.gameState-1]];
	      }));
	      return tt;
	    };

	ScreenState.render = function() {
	  switch(ScreenState.state) {
	  case "login":
	  default:
	    entity.$field.append($login);
	    break;
	  case "login-response":
	    if (!State.msg.err) {
	      $login.detach().addClass("username").html("user name: " + State.userName);
	      playersList.$field.append($("<ul>").append(State.msg.users.map(user => {
		let $user = $("<li>").append(user.userName, (user.playingMatchId !== undefined) ? (", playing " + user.playingMatchId, $("<i>", { class:"fa fa-minus" })) : "")
		return $user;
	      })));
	      gamesTable = createGamesTable(State.msg.games, State.msg.GameStates);
	      entity.$field.append( $("<div>", { class:"field-row dotted" }).append($login),
				    $("<div>", { class:"field-row dotted" }).append(playersList.$field),
				    $("<div>", { class:"field-row dotted" }).append(gamesTable.$field) );
	    }
	    break;
	  }
	}; // ScreenState.render
      } // create()
    }; // args.screen

    spruits2.Entity.call(this, args);
    this.$field.addClass("screen-entity-" + this.name);
    this.$label.css({ display:"none" });
    this.load();
  }; // ScreenEntity.init

  State.render = function(newScreen, gotoScreen) {
    let $screen,
	insertScreen,
	
	createScreenEntity = function(screenName) {
	  this.fields[screenName] = undefined;
	  this.createField(screenName, State.ScreenEntities[screenName], { insertLabel:false });
	}.bind(this);

    if (this.fields[newScreen] === undefined) createScreenEntity(newScreen);

    if (gotoScreen) {
      if (newScreen !== State.screen) {
	insertScreen = true;
	$screen = this.$field.children(".screen");
	if ($screen.length) $screen.detach();
      }
      else insertScreen = false;
      
      this.fields[newScreen].get("State").render();

      if (insertScreen) {
	$screen = $("<div>", { class:"screen" });
	$screen.append(this.fields[newScreen].$field);
	this.$field.append($screen);
	State.screen = newScreen;
      }
    }
  }.bind(this); // render

  State.socket = io("/admin");
  State.socket.on("app state", function(msg) {
    console.log('msg: <- "app state"');
    State.msg = msg;
    State.render(State.screen, true);
  });

  State.render("init", true /* gotoScreen */);
} // FindPairsAdmin

spruits2.addCssRule(`.spruit-field.findpairsadmin .screen .screen-entity-init {
  text-align:left;
  padding:1em 0 1em 1em;
  display:block;
}
.spruit-field.findpairsadmin .screen button {
  background: #ffff00;
  color: #333300;
  margin: 0 0.5em 0.5em 0;
  border-radius: 1em;
  padding:1em;
}
.spruit-field.findpairsadmin .screen .fa-check {
  padding: 5px;
  border-top: 1px solid #bbbb00;
  border-right: 2px solid #bbbb00;
  border-bottom: 1px solid #bbbb00;
  border-radius: 50%;
  background: var(--backgroundColor);
  color:#999900;
  margin-left:1em;
}
.spruit-field.findpairsadmin .screen .screen-entity-init .username {
  display:inline-block;
}`);

$("body").append($("<div>", { class:"page slideIn"}).append((new FindPairsAdmin({})).$field));
