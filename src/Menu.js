//****************************************************************************************************************************************************************************
function init() {
  Component.call(this, args);

  $menu = $("<ul>" , { class:"spruits-menubar" }).append( menubar.map(item => {
    return $("<li>", { class:"dropdown " }).append(
      $("<a>", { class:"dropbtn" }).html(item).attr("href","javascript:;").on("click", handleClickMenubar),
      getDropdown(item, dropdown)
    );
  }) );

  this.$field.append($menu);
}

//****************************************************************************************************************************************************************************
function handleClickMenubar(e, ui) {
  let
  $m =        $(e.target).parent().parent(),
  $dropdown = $(e.target).parent();

  e.preventDefault();

  if ($m.hasClass("showdropdown")) {
    $dropdown.siblings().removeClass("show");
    if ($dropdown.hasClass("show")) {
      $dropdown.removeClass("show");
      $m.removeClass("showdropdown");
    } else {
      $dropdown.addClass("show");
    }
  } else {
    $m.toggleClass("showdropdown"); 
    $dropdown.toggleClass("show");
  }
};

//****************************************************************************************************************************************************************************
function handleClickSubmenu(e) {
  e.preventDefault();
  e.stopPropagation();

  if ($(this).hasClass("fa-angle-down")) {
    $(this).next().addClass("show-dropdown-content");
    $(this).removeClass("fa-angle-down").addClass("fa-angle-up");
  } else {
    $(this).next().removeClass("show-dropdown-content");
    $(this).removeClass("fa-angle-up").addClass("fa-angle-down");
  }
};

//****************************************************************************************************************************************************************************
function collapseMenu() {
  let $dropdown = $menu.children(".show"), $dropdownContent = $dropdown.children(".dropdown-content");

  // console.log("collapseMenu");

  $menu.removeClass("showdropdown");
  $dropdown.removeClass("show");
    
  $dropdownContent.children("li").each(function() {
    let $li = $(this);
    $li.find("i.fa.fa-angle-up").each(function() { $(this).removeClass("fa-angle-up").addClass("fa-angle-down"); });
    $li.find("ul.show-dropdown-content").each(function() { $(this).removeClass("show-dropdown-content"); });
  });
};

//****************************************************************************************************************************************************************************
function getDropdown(menuItem, dropdown, submenu) {
  if (dropdown[menuItem] === undefined) { console.log("getDropdown, menuItem=" + menuItem + ", undefined"); return ""; }

  return $("<ul>", { class:submenu ? "dropdown-content-submenu" : "dropdown-content" }).append( dropdown[menuItem].map(item => {
    let $li = $("<li>", submenu ? { class:"mark" } : {}), $a = $("<a>"), onClick;
    if (isString(item)) {
      $li.append($a.attr("id", item.replace(/ /g, "")).html(item).on("click", (e) => { onClickDropdown(e, item); collapseMenu(); }));
    }
    else {
      onClick = item.onClick ? item.onClick : onClickDropdown;
      $li.append( $a.attr("id", item.text.replace(/ /g, "")).on("click", (e) => onClick(e, item.text)).html(item.text) );
      if (dropdown[item.text]) {
	$li.append($("<i>", { class:"fa fa-angle-down" }).on("click", handleClickSubmenu), getDropdown(item.text, dropdown, true));
      }
    }
    return $li; // $("<li>").append($a);
  }) );
};

//****************************************************************************************************************************************************************************
function getVal(propName) {
}; // getValue

//****************************************************************************************************************************************************************************
function setVal(propName, val) {
}; // setVal

//****************************************************************************************************************************************************************************
function empty() {
}; // empty

//****************************************************************************************************************************************************************************
function validate() {
}; // validate

//****************************************************************************************************************************************************************************
exports.className = "Menu";
exports.args =      [ "menubar", "dropdown", "onClickDropdown" ];
exports.props =     [ "$menu" ];
exports.methods =   { "handleClickMenubar":handleClickMenubar, "handleClickSubmenu":handleClickSubmenu, "collapseMenu":collapseMenu, "getDropdown":getDropdown };
exports.init =      init;
exports.interfaceFuncs = {
  "getVal":getVal, "setVal":setVal, "empty":empty, "validate":validate
};
