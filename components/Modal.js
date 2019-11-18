Modal = function(args) {
let
closeCallback = args.closeCallback,modalinClass = args.modalinClass,modaloutClass = args.modaloutClass,id = args.id,$pageboxes = args.$pageboxes,crud = args.crud,
$modalcontainer,$bodycontent,$modalBody,$title,iHidedPageboxes,iHidedCrud,
handleCloseClick,handleCloseEnd,init,
getVal,setVal;
handleCloseClick = function(e) {
  e.preventDefault();

  if (closeCallback !== undefined) {
    closeCallback(e, $title.html());
  }
  $(this).parents(".modal-content").removeClass("modalIn").addClass("modalout");
  return false;
};
handleCloseEnd = function(e) {
  e.preventDefault();
  
  if ($(this).hasClass("modalout")) {
    $(this).parents(".spruits-modal").css("display","none");
    if (iHidedPageboxes === true) {
      $pageboxes.removeClass("hide");
      iHidedPageboxes = false;
    }
    if (iHidedCrud === true) {
      crud.set("show");
      iHidedCrud = false;
    }
  }
  return false;
};
init = function(that){
  if (args === undefined) {
    args = {};
  };
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-modal";
  }
  args.insertLabel = false;

  Component.call(that, args);

  $modalcontainer = args.$container;
  $bodycontent = args.$modalbody;
  $title = $("<h2>");
  $title.html(that.name);
  iHidedPageboxes = false;
  iHidedCrud = false;

  $modalBody = $("<div>", {class:"modal-body"});
  if ($bodycontent !== undefined) {
    $modalBody.append($bodycontent);
  }

  that.$field.append(
    $("<div>", {class:"modal-content"}).append(
      $("<div>", {class:"modal-header"}).append(
        $("<span>", {class:"close"}).html("&times;")
        .on("click", handleCloseClick),
        $title
      ),

      $modalBody,

      $("<div>", {class:"modal-footer"}).append(
        "&nbsp;"
      )
    ) // .modal-content
    .on("animationend", handleCloseEnd)
  ); // .spruits-modal
  that.$field.attr("id", id);
  if ($modalcontainer) $modalcontainer.append(that.$field);
};
init(this);
getVal = function(){};
setVal = function(propName, val) {
    switch(propName) {
    case "$modalbody":
      $modalBody.children().detach();
      $modalBody.append(val);
      break;
    case "$title":
      $title.html(val);
      break;
    case "show":
      this.$field.css("display", "block");
      this.$field.find(".modal-content").removeClass("modalout").addClass("modalin");
      if (($pageboxes !== undefined) && ($pageboxes.hasClass("hide") === false)) {
        $pageboxes.addClass("hide");
        iHidedPageboxes = true;
      } else {
        iHidedPageboxes = false;
      }
      if ((crud !== undefined) && (crud.get("isHidden") === false)) {
        crud.set("hide");
        iHidedCrud = true;
      } else {
        iHidedCrud = false;
      }
      break;
    case "close":
      this.$field.find(".modal-content").removeClass("modalin").addClass("modalout");
      break;
    } // switch
  };
this.getVal = getVal;
this.setVal = setVal;
};