//****************************************************************************************************************************************************************************
function FindPairsAdmin(args) {
  let State;

  spruits2.Entity.call(this, args);
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
		socket.emit("login", { userName:userName });
	      }
	    }));

	ScreenState.render = function() {
	  switch(ScreenState.state) {
	  case "login":
	  default:
	    entity.$field.append(entity.name + ", ScreenState.render() = TBA");
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
    console.log('msg: "app state"');
  });

  State.render("init", true /* gotoScreen */);
} // FindPairsAdmin

$("body").append($("<div>", { class:"page slideIn"}).append((new FindPairsAdmin({})).$field));
