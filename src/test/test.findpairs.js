//****************************************************************************************************************************************************************************
function RadioGroup(args) {
  let buttonNames = args.buttonNames,
      custom = args.custom,
      buttons,
      
      RadioButton = function(args) {
	let groupName = args.groupName,
	    $input,
	    $customButton,

	    handleClickCheckbox = function(e) {
	      // let $input = $(this).prev();
	      e.preventDefault();
	      $input[0].checked = $input[0].checked ? false : true;
	    };
    
	spruits2.Component.call(this, args);
	
	$input = $("<input>", { type:"radio", name:groupName, value:this.name });
	
	$customButton = (custom !== false) ?
	  $("<span>", { class:"custombutton" })
	  .on("click", handleClickCheckbox) : "";
	
	this.$field.addClass("radiobutton-1" + ((custom === false) ? " def" : "")).append(
	  $input,
	  $customButton
	);

	this.getVal = function getVal(propName) {
	  let val;

	  switch(propName) {
	  case "val":
	  default:
	    val = $input[0].checked ? true : false;
	    break;
	  }

	  return val;
	};

	this.setVal = function setVal(propName, val) {
	  if (val === undefined) {
	    val = propName;
	    propName = "val";
	  }
	  switch (propName) {
	  case "val":
	    $input[0].checked = val;
	    break;
	  case "empty":
	    $input[0].checked = false;
	    break;
	  }
	};
      };

  spruits2.Component.call(this, args);
  
  buttons = buttonNames.map(buttonName => {
    return new RadioButton({ fieldName:buttonName, groupName:this.name });
  });
  buttons.forEach(comp => { this.$field.append(comp.$field); });

  this.getVal = function(propName) {
    let val, len, i;
    
    switch(propName) {
    case "val":
    default:
      len = buttons.length;
      for (i=0; i<len; i++) {
	if (buttons[i].get("val")) {
	  val = buttons[i].name;
	  break;
	}
      }
      break;
    }

    return val;
  };

  this.empty = function() {
    buttons.forEach(rb => { rb.set("val", false); });
  }
} // RadioGroup

spruits2.addCssRule(`.radiobutton-1 {
  display:block;
  padding-left:1em;
}
.radiobutton-1 input {
  opacity:0;
}
.radiobutton-1.def input {
  opacity:unset;
}
.radiobutton-1 .custombutton {
  height:1em;
  width:1em;
  background-color:#ffff00;
  display:inline-block;
  border-radius:50%;
  border-bottom:1px solid #999900;
  border-right:1px solid #999900;
  margin-left:-1em;
}
.radiobutton-1:hover input ~ .custombutton {
  background-color:#999900;
}
.radiobutton-1 .custombutton:after {
  content:"";
  display:inline-block;
  background-color:#FFFF00;
  width:0.5em;
  height:0.5em;
  border-radius:50%;
  margin-left:0.25em;
  margin-bottom:0.125em;
}
.radiobutton-1 input:checked ~ .custombutton:after {
  display:inline-block;
  background-color:#333300;
}`);
spruits2.wc(RadioGroup);

//****************************************************************************************************************************************************************************
function Card(args) {
  let faceValue = args.faceValue.slice(0, -1),
      onClick =   args.onClick,
      $label,
      labelMap = { // a:"android", b:"google", c:"github", d:"fort-awesome", e:"youtube-play", f:"twitter", g:"snapchat", h:"whatsapp", i:"linux", j:"apple",
		   // k:"firefox", l:"font-awesome", m:"chrome", n:"html5", o:"amazon", p:"skype", q:"stack-overflow", r:"wikipedia-w", s:"superpowers", t:"windows",
		   // u:"dropbox", v:"drupal", x:"edge", y:"empire", z:"envira",

	1:"android", 2:"google", 3:"github", 4:"fort-awesome", 5:"youtube-play", 6:"twitter", 7:"snapchat", 8:"whatsapp", 9:"linux", 10:"apple",
	11:"firefox", 12:"font-awesome", 13:"chrome", 14:"html5", 15:"amazon", 16:"skype", 17:"stack-overflow", 18:"wikipedia-w", 19:"superpowers", 20:"windows",
	21:"dropbox", 22:"drupal", 23:"edge", 24:"empire", 25:"envira", 26:"facebook", 27:"flickr", 28:"gitlab", 29:"glide", 30:"gg",
	31:"git", 32:"forumbee", 33:"get-pocket"
		 };
  
  spruits2.Component.call(this, args);
  $label = this.$label;
  $label.html("").append( $("<i>", { class:"fa fa-" + labelMap[faceValue] }) ); // html(faceValue);
  this.$field.addClass("card");
  this.$field.on("click", e => onClick(e, $label));
}
spruits2.addCssRule(`.spruit-field.card > label {
  font-size:150%;
  width: 1.5em;
  height: 1.25em;
  padding-top:0;
  text-align: center;
  border: 0;
  margin: 0.2em;
  border-radius: 8px;
  background: #ffff00;
  border-right: 1px solid #999900;
  border-bottom: 1px solid #999900;
  color: #333300;
  display:inline-block;
}
@media only screen and (min-width:400px) {
  .spruit-field.card > label {
    font-size:200%;
  }
}
.spruit-field.card > label.facedown {
  background: #999900;
  color: #999900;
  border-right-color: #ffff00;
  border-bottom-color: #ffff00;
}
.spruit-field.card > label.removed {
  background: #9ACD32;
  color: #9ACD32;
  border-right-color: #9ACD32;
  border-bottom-color: #9ACD32;
}`);

//****************************************************************************************************************************************************************************
function FindPairs(args) {
  let game,
      $field,
      States = { init:1, play:2, gameover:3, initGaming:4 },
      ScreenEntities = {},
      state,
      render,
      
      socket,
      userName = "",
      myTurn,
      games = [],
      hood,
      conf,
      $log;
  
  ScreenEntities["init"] = function Init(args) {
    args.screen = {
      create:function(entity) {
	let numPairs = { "Easy":5, "Medium":15, "Hard":21, "Ultra":24 },
	    $name = $("<input>", { class:"name" }),
	    
	    $login = $("<div>", { class:"login" }).append(
	      $("<div>").append( $("<img>", { src:"fp2.png", width:"160" }) ),
	      $("<div>").append( $name ),
	      $("<i>", { class:"fa fa-sign-in" }).on("click", e => {
		userName = $name.val();
		entity.$field.html("");
		initGaming();
		socket.emit("my-name", userName);
	      })),
	    
	    $games = $("<div>"),
	    
	    initGaming = function initGaming() {
	      let level = new spruits2.RadioGroup({ fieldName:"Select level", buttonNames:Object.keys(numPairs) }),
		  ultra = new spruits2.Spinner({ fieldName:"Ultra", fieldClass:"spruits-spinner numofplayers-spinner", attrs:{ input:{ class:"numdigits-2", size:"2" }}, min:24, max:33 }),

		  handleClickConf = function(e) {
		    e.preventDefault();
		    conf.set("$modalbody", [ $("<table>").append(
		      $("<thead>").append( $("<tr>").append( $("<th>").html("#Players"), $("<th>").html("#Pairs"), $("<th>").html(""), $("<th>").html("State"), $("<th>").html("Name"), $("<th>").html("Id") ) ), 
		      $("<tbody>").append( games.map(game => {
			let retVal = "";
		      
			if (game.creator.name === userName) retVal =  $("<tr>").append(
			  $("<td>").html("" + game.numPlayers), $("<td>").html("" + game.numPairs), $("<td>").html($("<i>", { class:"fa fa-trash" })), $("<td>").html(game.gameState), $("<td>").html(game.creator.name),
			  $("<td>").html(game.matchId)
			);

			return retVal;
		      }) )), $log ] );
		    conf.set("show");
		  },
		  
		  handleClickCreateGame = function(e) {
		    let levelVal = level.get("val"),
			size = (levelVal === "Ultra") ? ultra.get("val") : numPairs[ levelVal ];
	      
		    e.preventDefault();
				 
		    if (size && userName.length) {
		      /* msg = { user:userName, playerId:turn, numPairs:#pairs }, turn = [ 0, 1 ] */
		      socket.emit("create game", { user:userName, playerId:myTurnComp.get("val") ? 0 : 1, numPairs:size, numPlayers:numOfPlayers.get("val") });
		      level.empty();
		      myTurnComp.empty();
		      numOfPlayers.set("init"); // empty();
		      ultra.set("init"); // init();
		    }
		  },
		  myTurnComp = new spruits2.InputCheckbox({ fieldName:"My turn 1st" }),
		  numOfPlayers = new spruits2.Spinner({ fieldName:"Number of players", fieldClass:"spruits-spinner numofplayers-spinner", attrs:{ input:{ class:"numdigits-2", size:"2" }}, initial:2, min:1, max:6 });
	      
	      $login.addClass("username").html("user name: " + userName);
	      myTurn = -1;
	      entity.$field.append($login, $("<i>", { class:"fa fa-cog conf" }).on("click", handleClickConf),
				   $("<div>", { class:"games" }).append( $("<h6>").html("Available games"), $games),
				   $("<div>", { class:"select-level-row" }).append(level.$field, ultra.$field),
				   myTurnComp.$field,
				   numOfPlayers.$field,
				   $("<div>", { class:"c-game" }).append(
				     $("<button>").html("Create Game").on("click", handleClickCreateGame)
				   ));
	    }; // initGaming

	entity.set("State", { key:"renderGames", value: function() {
	  $games.html("");
	  $games.append( games.map(game => {
	    let names;

	    if (game.gameState !== "created") return ""; // Value of gameState is one of GameStates, which is defined in Server.

	    names = Array(game.numPlayers).fill("???");
	    names[game.creator.id] = (game.creator.name === userName) ? "I" : game.creator.name;
	      
	    return $("<button>")
	      .text( names.reduce((all, name, i, arr) => {
		let s = name;
		if (i < (arr.length - 1)) s += " vs ";
		return all + s;
	      }, "") + ", " + game.numPairs)
	      .on("click", e => {
		if (names.some(name => { return name === "I" })) return false;

		entity.get("State").waitforGaming();
		socket.emit("join game", { user:userName, game:game });
		return false;
	      });
	  }));
	  
	  return true;
	}});

	entity.set("State", { key:"initGaming", value:function() {
	  entity.$field.html("");
	  initGaming();
	}});

	entity.set("State", { key:"waitforGaming", value:function() {
	  $login.html("user name: " + userName);
	  entity.$field.html("").append(
	    $login,
	    $("<div>").append("Waiting for the game to start.")
	  );
	}});

	entity.$field.addClass("screen-entity-init").append($login);
	entity.$label.css({ display:"none" });
      } // create()
    }; // args.screen
    
    spruits2.Entity.call(this, args);
    this.load();
  }; // ScreenEntity.init
  
  ScreenEntities["play"] = function(args) {
    args.screen = {
      create:function(entity) {
	let turns,
	    $dash = $("<span>", { class:"dash" }).html("-"),
	    scores,
	    numPlayers,
	    
	    handleClickCard = function handleClickCard(e, cardI) {
	      let msg;
	      
	      e.preventDefault();
	      
	      if ((numPlayers === 2 && turns[myTurn].hasClass("active") !== true) || (numPlayers > 2 && turns[0].text() !== userName)) {
		console.log("handleClickCard, ignore: not active");
		$log.append($("<li>").append("handleClickCard, ignore: not active, myTurn=" + myTurn));
		return;
	      }
	      
	      msg = entity.get("State").msg;
	      if (myTurn !== msg.turn) {
		console.log("handleClickCard, ignore: not myturn, myTurn=" + myTurn + ", msg.turn=" + msg.turn);
		$log.append($("<li>").append("handleClickCard, ignore: not myturn, myTurn=" + myTurn + ", msg.turn=" + msg.turn));
		return;
	      }
	      
	      socket.emit("card click", { matchId:msg.matchId, players:msg.players, turn:msg.turn, cardI:cardI });
	    },
	    
	    changeTurn = function changeTurn(newTurn, players, points) {
	      let numPlayers = players.length,
		  currentTurn = (((newTurn - 1) < 0) ? numPlayers : newTurn) - 1,
		  nextTurn = (((newTurn + 1) >= numPlayers) ? 0 : (newTurn + 1));

	      if (numPlayers === 2) {
		turns[currentTurn].removeClass("active");
		turns[newTurn].addClass("active");
		scores.forEach((score, i) => { score.html("" + points[i]) });
	      } else {
		turns[0].html(players[newTurn]);
		turns[1].html(players[nextTurn]);
		scores[0].html("" + points[newTurn]);
		scores[1].html("" + points[nextTurn]);
	      }
	    };
	
	entity.set("State", { key:"renderBoard", value:function(board) {
	  let msg = entity.get("State").msg,
	      
	      getScoreboard = function() {
		let $scoreboard = $("<div>", { class:"header" }),
		    
		    handleClickEmptyLog = function(e) {
		      e.preventDefault();
		      $log.html("").append($("<li>").append("Cleared=" + (new Date(Date.now())).toString()));
		    },

		    handleClickGiveupGame = function(e) {
		      e.preventDefault();
		      socket.emit("give up game", { matchId:msg.matchId, user:userName, turn:myTurn });
		      $log.append($("<li>").append("handleClickGiveupGame, myTurn=" + myTurn + ", msg.turn=" + msg.turn));
		      render(States.initGaming);
		    },
		    
		    $confContent = [
		      $("<i>", { class:"fa fa-trash emptylog" }).on("click", handleClickEmptyLog),
		      $("<i>", { class:"fa fa-play giveupgame" }).on("click", handleClickGiveupGame),
		      $log
		    ],

		    handleClickRightTurn = function(e) {
		      e.preventDefault();
		      conf.set("$modalbody", $confContent);
		      conf.set("show");
		    };

		if (msg.players.length === 2) {
		  turns = [ $("<span>", { class:"turn active" }), $("<span>", { class:"turn right" }).on("click", handleClickRightTurn) ];
		  scores =[ $("<span>", { class:"score" }).html("0"), $("<span>", { class:"score right" }).html("0") ];
		  $scoreboard.append(turns[0], $("<div>", {class:"scoreboard"}).append(scores[0], $dash, scores[1]), turns[1]);

		  msg.players.forEach((name, i) => {
		    turns[i].html(name);
		    if (userName === name) myTurn = i;
		  });
		} else {
		  turns = [ $("<span>", { class:"turn multi" }).html(msg.players[0]), $("<span>", { class:"turn multi" }).html(msg.players[1]).on("click", handleClickRightTurn) ];
		  turns[0].addClass("active");
		  scores = [ $("<span>", { class:"score" }).html("0"), $("<span>", { class:"score" }).html("0") ];
		  $scoreboard.append(turns[0], scores[0], turns[1], scores[1]);

		  msg.players.forEach((name, i) => { if (userName === name) myTurn = i; });
		}

		return $scoreboard;
	      };

	  numPlayers = msg.players.length;
	  
	  this.$field.append(
	    getScoreboard(),
	    board.map((val, i) => {
	      entity.createField("" + i, Card, { faceValue:val, attrs:{ label:{ class:"facedown" }}, onClick:(e) => handleClickCard(e, i) });
	      return entity.fields["" + i].$field;
	    }));
	}.bind(entity)});

	entity.set("State", { key:"renderGameState", value:function(gameStateMsg) {
	  let twoCardsFaceup = false,
	      pairFound = false,
	      State = entity.get("State");

	  console.log("renderGamestate, msg=" + JSON.stringify(gameStateMsg));
	  $log.append($("<li>").append("renderGamestate, msg=" + JSON.stringify(gameStateMsg)));
	  
	  gameStateMsg.action.cards.forEach(card => { entity.fields["" + card.position].$label.removeClass("facedown"); });

	  // scores.forEach((score, i) => { score.html("" + gameStateMsg.scores[i]) });
	  
	  if (gameStateMsg.action.cards.length === 2) {
	    twoCardsFaceup = true;
	    if (gameStateMsg.action.cards.reduce((all, card) => { return ((all && card.removed) ? true : false); }, true)) pairFound = true;
	  }

	  if (twoCardsFaceup) {
	    if (pairFound) {
	      setTimeout(() => {
		if (gameStateMsg.action.gameover === true) {
		  render(States.gameover);
		  State.screenEntities["gameover"].get("State").renderFinalResult(gameStateMsg);
		}
		else {
		  gameStateMsg.action.cards.forEach(card => { entity.fields["" + card.position].$label.addClass("removed"); });
		  changeTurn(gameStateMsg.turn, gameStateMsg.players, gameStateMsg.scores);
		}
	      }, 1000);
	    } else {
	      /* not a pair */
	      setTimeout(() => {
		gameStateMsg.action.cards.forEach(card => { entity.fields["" + card.position].$label.addClass("facedown"); });
		changeTurn(gameStateMsg.turn, gameStateMsg.players, gameStateMsg.scores);
	      }, 1000);
	    }
	  } else {
	    changeTurn(gameStateMsg.turn, gameStateMsg.players, gameStateMsg.scores);
	  }
	}});
      }}; // create, screen
	  
    spruits2.Entity.call(this, args);
    this.$label.css({ display:"none" });
    this.load();
  }; // ScreenEntity.play

  ScreenEntities["gameover"] = function(args) {
    args.screen = {
      create:function(entity) {
	let State = entity.get("State");

	State.renderFinalResult = function(msg) {
	  let foo,
	      getRank = function(rank) {
		let $rank;
	    
		switch(rank) {
		case 1:
		  $rank = $("<i>", { class:"fa fa-trophy gold" });
		  break;
		case 2:
		  $rank = $("<i>", { class:"fa fa-trophy silver" });
		  break;
		case 3:
		  $rank = $("<i>", { class:"fa fa-trophy bronze" });
		  break;
		default:
		  $rank = "" + rank;
		  break;
		}
		
		return $rank;
	      },
	      
	      playersScoresSorted = msg.players.map((name, i) => { return { name:name, score:msg.scores[i] }; }).sort((a, b) => { return b.score - a.score; }),
	      playersRanked = playersScoresSorted.map((player, i, arr) => {
		player.rank = i + 1;
		if (i>0) {
		  if (player.score === arr[i-1].score) player.rank = arr[i-1].rank;
		}
		return player;
	      }),
	      $finalResultRows = playersRanked.map((player, i) => {
		return $("<tr>").append($("<td>").append(getRank(player.rank)), $("<td>").html(player.name), $("<td>").html("" + player.score));
	      }),
	      
	      $finalResult = $("<table>").append(
		$("<thead>").append($("<tr>").append( $("<th>"), $("<th>"), $("<th>").html("Pairs") )),
		$("<tbody>").append($finalResultRows)
	      ),
	      
	      handleClickReplay = function(e, entity) {
		e.preventDefault();
		socket.emit("unsuspend my games", { user:userName });
		render(States.initGaming);
	      };
	
	  entity.$field.addClass("screen-entity-gameover").append("Game over. ",  $finalResult, $("<button>").html("Replay").on("click", e => handleClickReplay(e, this)));
	  entity.$label.css({ display:"none" });
	};
      }}; // create

    spruits2.Entity.call(this, args);
    this.load();
  };

  render = function(newState) {
    let $board = this.$field.children(".board"),
	
	renderScreen = function(screenName) {
	  this.fields[screenName] = undefined;
	  this.createField(screenName, ScreenEntities[screenName], { insertLabel:false });
	  $board.append(this.fields[screenName].$field);
	}.bind(this);

    if ($board.length) $board.remove();
    $board = $("<div>", { class:"board" });
    this.$field.append($board);
	
    switch (newState) {
    case States.init:
      renderScreen("init");
      break;

    case States.initGaming: // Return to "init"-screen without login.
      this.fields["init"].get("State").initGaming()
      this.fields["init"].get("State").renderGames();
      $board.append(this.fields["init"].$field);
      break;
	  
    case States.play:
      renderScreen("play");
      break;

    case States.gameover:
      renderScreen("gameover");
      break;

    default:
      $board.html("ERR:render:invalidState,this.name=" + this.name + ",newState=" + newState);
      newState = state;
      break;
    }
    state = newState;
  }.bind(this);

  spruits2.Component.call(this, args);
  spruits2.Container.call(this, this.name);
  this.$field.addClass("findpairs-4");
  $field = this.$field;

  hood = new spruits2.Modal({ fieldName:"Hood", $modalbody:$("<div>").css({ "height":"50%", "width":"100%"}).html("Hooding"), $container:$("body") });
  hood.$field.addClass("hood");
  conf = new spruits2.Modal({ fieldName:"Config", $modalbody:$("<div>").css({ "height":"25em", "width":"100%"}).html("TBA"), $container:$("body") });
  conf.$field.addClass("conf");

  $log = $("<ol>", { class:"log" }).append($("<li>").append("Start=" + (new Date(Date.now())).toString()));
  
  socket = io();
  
  socket.on("games", function(msg) {
    /* msg = games-array, game = { matchId, creator:{ id, name }, numPairs, numPlayers, gameState } */
    console.log("games, msg=" + JSON.stringify(msg));
    games = msg.slice();
    this.fields["init"].get("State").renderGames();
  }.bind(this));

  socket.on("start game", function(msg) {
    /* msg = { matchId, players:[], turn:0, board } */
    let State;
    render(States["play"]);
    State = this.fields["play"].get("State");
    State.msg = msg;
    State.renderBoard(msg.board, msg);
  }.bind(this));

  socket.on("game state", function(msg) {
    let State = this.fields["play"].get("State");
    State.msg = msg;
    State.screenEntities = this.fields;
    State.renderGameState(msg);
  }.bind(this));

  socket.on("logon", function(msg) {
    console.log("logon, msg=" + JSON.stringify(msg));
    render(States.init);
  });

  socket.on("hood", function(msg) {
    console.log("hood, msg=" + JSON.stringify(msg));
    
    if (msg.state === "on") hood.set("show");
    else {
      if (msg.timeout !== undefined) {
	setTimeout(function() {
	  hood.set("close");
	}, msg.timeout);
      } else {
	hood.set("close");
      }
    }
  });
  
  render(States.init);

  // XXX this for documentary purpose only
  this.ScreenEntities = ScreenEntities;
} // FindPairs

spruits2.addCssRule(`.spruit-field.findpairs-4 .board {
  background-color: #9ACD32;
  text-align:center;
}
.spruit-field.findpairs-4 .board .screen-entity-init {
  text-align:left;
  padding:1em 0 1em 1em;
  display:block;
}
.spruit-field.findpairs-4 .board .screen-entity-init .login {
  text-align:center;
}
.spruit-field.findpairs-4 .board .screen-entity-init .login .name {
  margin-top: 0.5em;
}
.spruit-field.findpairs-4 .board button {
  background: #ffff00;
  color: #333300;
  margin: 0 0.5em 0.5em 0;
  border-radius: 1em;
  padding:1em;
}
.spruit-field.findpairs-4 .board .fa-sign-in {
	padding: 5px 15px;
	border-top: 1px solid #bbbb00;
	border-right: 3px solid #bbbb00;
	border-bottom: 2px solid #bbbb00;
	border-radius: 30%;
	background: var(--backgroundColor);
	color: #999900;
	margin-top: 1em;
	font-size: 150%;
}
.spruit-field.findpairs-4 .board .screen-entity-init .username {
  display:inline-block;
}
.spruit-field.findpairs-4 .board .screen-entity-init .conf {
  margin-left: 2em;
}
.spruit-field.findpairs-4 .board .screen-entity-init h6 {
  margin-bottom:0.5em;
}
.spruit-field.findpairs-4 .board .screen-entity-init .games {
  margin-bottom:1em;
}
.spruit-field.findpairs-4 .board .screen-entity-init .select-level-row {
  display: flex;
  line-height: 1em;
}
.spruit-field.findpairs-4 .board .screen-entity-init .select-level-row > span:nth-child(1) {
  display: inline-block;
}
.spruit-field.findpairs-4 .board .screen-entity-init .select-level-row > span:nth-child(2) {
  display: inline-block;
  margin-top: 1em;
  margin-left: 2em;
}
.spruit-field.findpairs-4 .board .screen-entity-init .spruits-spinner.numofplayers-spinner {
  border: 0;
  font-size: unset;
  background: unset;
  display: unset;
  padding: 0;
}
.spruit-field.findpairs-4 .board .screen-entity-init .numofplayers-spinner label {
  color:unset;
  text-align:left;
}
.spruit-field.findpairs-4 .board .screen-entity-init .numofplayers-spinner div {
  border-bottom-color:#ffff00;
  border-top-color:#ffff00;
  margin-left:0.8em;
}
.spruit-field.findpairs-4 .board .screen-entity-init .numofplayers-spinner input {
  margin-left:1em;
}
.spruit-field.findpairs-4 .board .screen-entity-init .c-game {
  margin-top: 1.5em;
}
.spruit-field.findpairs-4 .board .header {
  height: 2em;
  position: relative;
  padding-top: 0.5em;
  padding-left: 0.5em;
  text-align:left;
}
.spruit-field.findpairs-4 .board .turn {
  display: inline-block;
  width: 30%;
  text-align: center;
  position: absolute;
  border-right: 3px solid #999900;
  border-bottom: 1px solid #999900;
  border-radius: 1em;
  background: #bbbb00;
}
.spruit-field.findpairs-4 .board .turn.multi {
  position:unset;
}
.spruit-field.findpairs-4 .board .turn.right {
  right:0.5em;
}
.spruit-field.findpairs-4 .board .turn.active {
  background: #f8f825;
}
.spruit-field.findpairs-4 .board .scoreboard {
  display:inline-block;
  width:20%;
  position:absolute;
  left:40%;
  color:#ffff00;
}
.spruit-field.findpairs-4 .board .scoreboard .dash {
  position: absolute;
  left: 50%;
}
.spruit-field.findpairs-4 .board .scoreboard .score.right {
  position: absolute;
  right: 0;
}
.spruit-field.findpairs-4 .board .screen-entity-gameover table {
  width: 80%;
  margin-left: 10%;
  text-align: left;
}
.spruit-field.findpairs-4 .board .screen-entity-gameover table > thead th:nth-child(1) {
  width: 20%;
}
.spruit-field.findpairs-4 .board .screen-entity-gameover table > thead th:nth-child(2) {
  width: 70%;
}
.spruit-field.findpairs-4 .board .screen-entity-gameover table > tbody > tr > td:nth-child(1) {
  text-align:center;
}
.spruit-field.findpairs-4 .board .screen-entity-gameover .gold {
  color:gold;
  font-size:300%;
}
.spruit-field.findpairs-4 .board .screen-entity-gameover .silver {
  color:#aea5a5;
  font-size:200%;
}
.spruit-field.findpairs-4 .board .screen-entity-gameover .bronze {
  color:#cd7f32;
  font-size:150%;
}
.spruits-modal.hood {
  background-color: rgba(0,0,0); /* Black w/ opacity */
}
.page { 
  bottom:2px;
  left:2px;
  width:99%; 
}
.conf .emptylog {
  margin-left:1em;
}
.log {
  overflow-x:scroll;
}`);

$("body").append($("<div>", { class:"page slideIn"}).append("<h6>Find Pairs Demo</h6>", (new FindPairs({})).$field));
