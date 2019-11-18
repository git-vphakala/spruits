Crud = function(args) {
let
attrs = args.attrs,$modalcontainer = args.$modalcontainer,$pageboxes = args.$pageboxes,pm = args.pm,notification = args.notification,
CREATE_PENDING,CREATE_OK,CREATE_NOK,CREATE_VALID_NOK,READ_PENDING,READ_OK,READ_NOK,crudObj,entity,$log,status,valid,$icon,buttons,$buttons,modalAttrs,modalId,modal,notificationMap,
send,handleClickButton,handleClickIcon,init,
getVal,setVal,empty,validate;
send = function(msg) {
  $.ajax({
    type: "POST",
    url: "/crud",
    contentType: "application/json",
    data: JSON.stringify(msg),

    success: function(response) { 
      console.log("Crud.send.success, response=" + JSON.stringify(response) + "\n   entity.name=" + entity.name);

      switch (response.action) {
      case "C":
      case "U":
      case "D":
        if (response.resultCode === "1") {
          status = CREATE_OK;
          modal.set("close");
        } else {
          status = CREATE_NOK;
        }
        notification.set("show", response.action + ": " + notificationMap[response.resultCode]);
        break;
      case "R":
        if (response.resultCode === "1") {
          status = READ_OK;
          modal.set("close");
          entity.set("val", response.data);
        } else {
          status = READ_NOK;
        }
        notification.set("show", response.action + ": " + notificationMap[response.resultCode]);
        break;
      } // switch(response.action)
    }, // success
    error: function(jqXHR, exception) { console.log(jqXHR.status); }
  });
};
handleClickButton = function() {
  let val, action, valid;

  console.log("Crud.buttonClickHandler=" + $(this).html() + ", " + entity.name);

  action = $(this).html();

  switch(action) {
  case "C":
  case "U":
    valid = entity.get("valid");
    if (valid.valid !== true) {
      notification.set("show", action + ": " + notificationMap["valid.valid !== true"]);
      status = CREATE_VALID_NOK;
      Object.keys(valid.invalid).forEach(fieldName => { entity.fields[fieldName].set("invalid-color", valid.invalid[fieldName]); });
      console.log("buttonClickHandler, valid=" + JSON.stringify(valid));
    } else {
      val = entity.get("val");
      Object.values(entity.fields).forEach(comp => comp.set("reset-invalid-color"));
      if ($log !== undefined) {
        $log.append("Crud.buttonClickHandler=" + $(this).html() + ", " + entity.name + "<br>, val=" + JSON.stringify(val) + "<br>");
      }
      status = CREATE_PENDING;
      send({ action:action, entity:entity.name, data:val });
    }
    break;
  case "R":
  case "D":
    val = entity.get("key");
    if ($log !== undefined) {
      $log.append("Crud.buttonClickHandler=" + $(this).html() + ", " + entity.name + "<br>, val=" + JSON.stringify(val) + "<br>");
    }
    status = READ_PENDING;
    send({ action:action, entity:entity.name, data:val });
    break;
  } // switch(action)

  return false;
};
handleClickIcon = function(){
  entity = pm.get("entity");
  modal.set("show");
  return false;
};
init = function(that) {

  /* const */
  CREATE_PENDING = 0;
  CREATE_OK = 1;
  CREATE_NOK = 2;
  CREATE_VALID_NOK = 3;
  READ_PENDING = 0;
  READ_OK = 1;
  READ_NOK = 2;

  if (args.fieldClass === undefined) args.fieldClass = "spruits-crud";
  Component.call(that, args);
  crudObj = that;
  buttons = {};
  notificationMap = { 
    "1":  "successful", 
    "10": "exists already", 
    "11": "not found",
  
    "valid.valid !== true": "validation failed"
  };

  buttons["create"] = $("<i>", { class:"crud-button" }).html("C").on("click", handleClickButton);
  buttons["read"] =   $("<i>", { class:"crud-button" }).html("R").on("click", handleClickButton);
  buttons["update"] = $("<i>", { class:"crud-button" }).html("U").on("click", handleClickButton);
  buttons["delete"] = $("<i>", { class:"crud-button" }).html("D").on("click", handleClickButton);
  $buttons = $("<div>", { class:"spruits-crud-modal-content" }).append(buttons.create, buttons.read, buttons.update, buttons.delete);

  if (attrs !== undefined) modalAttrs = attrs.modal;
  
  // modalId = getId("spruits-crud");
  modal = new Modal({ fieldName:"CRUD", $modalbody:$buttons, id:modalId, $container:$modalcontainer, attrs:modalAttrs, $pageboxes:$pageboxes, crud:crudObj /*, closeCallback:modalClosed */ });

  $icon = $("<i>", { class:"fa fa-database" }).on("click", handleClickIcon);

  that.$field.append($icon);
  that.modal = modal; // XXX for testing, REMOVE
};
init(this);
getVal = function(propName) {
  switch(propName) {
  case "isHidden":
    return crudObj.$field.hasClass("fadeOut");
    break;
  case "status":
    return status;
    break;
  }
};
setVal = function(propName, val) {
  switch(propName) {
  case "show":
    crudObj.$field.removeClass("fadeOut").addClass("fadeIn");
    break;
  case "hide":
    crudObj.$field.removeClass("fadeIn").addClass("fadeOut");
    break;
  case "$log":
    $log = val;
    break;
  }
};
empty = function() {
};
validate = function() {
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
this.validate = validate;
};