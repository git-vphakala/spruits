PageManager = function(args) {
let
screens = args.screens,menubar = args.menubar,dropdown = args.dropdown,attrs = args.attrs,
$container,$homepage,$pageboxes,$home,$arrowLeft,$arrowRight,pagesI,pages,menu,cal,tp,ra,notif,crud,slideInClass,slideOutClass,slideInFromRightClass,slideOutToLeftClass,
handleClickHome,handleSwipeRight,handleSwipeLeft,deletePage,handleClickDelButton,handleFrameSwipeLeft,Page,createPage,handleClickMenuItem,init,
getVal,setVal,empty,validate;
handleClickHome = function(e) {
  e.preventDefault();
    
  if ($home.hasClass("myhome-2x")) {
    $home.removeClass("myhome-2x");
    if (pages.length) pages[pagesI].set("slideIn", slideInFromRightClass); // "slideInFromRight");
    $homepage.removeClass("fadeIn").addClass("fadeOut");

    crud.set("show");
  } else {
    $home.addClass("myhome-2x");
    $homepage.removeClass("fadeOut").addClass("fadeIn");
    if (pages.length) pages[pagesI].set("slideOut", slideOutClass); // "slideOut");

    crud.set("hide");
  }
};
handleSwipeRight = function(e){
  e.preventDefault();
  e.stopPropagation();
    
  if ($home.hasClass("myhome-2x") || !pages.length) return;
    
  if (pagesI < 0) {
    pagesI = 0;
    pages[0].set("slideIn", slideInClass);        // "slideIn");
  } else {
    pages[pagesI].set("slideOut", slideOutClass); // "slideOut");
    pages[pagesI].set("pagebox-inactivate");
    
    pagesI++;
    if (pagesI > pages.length-1) pagesI = 0;
      
    pages[pagesI].set("slideIn", slideInClass);  // "slideIn");
  }
};
handleSwipeLeft = function(e){
  e.preventDefault();
  e.stopPropagation();
  
  if ($home.hasClass("myhome-2x") || !pages.length) return;
  
  if (pagesI < 0) {
    pagesI = pages.length-1;
    pages[pagesI].set("slideIn", slideInFromRightClass);  // "slideInFromRight");
  } else {
    pages[pagesI].set("slideOut", slideOutToLeftClass);   // "slideOutToLeft");
    pages[pagesI].set("pagebox-inactivate");
    
    pagesI--;
    if (pagesI < 0) pagesI = pages.length-1;
    
    pages[pagesI].set("slideIn", slideInFromRightClass);  // "slideInFromRight");
  }
};
deletePage = function($delButton) {
  let i = $delButton.data("pagesi"), len;
  
  // pages[0].$page.append("i=" + i + "<br>");
  
  pages[i].set("remove");
  pages.splice(i, 1);
  
  len = pages.length;
  if (pagesI > len-1) {
    if (i === pagesI) pagesI = 0;
    else pagesI = len - 1;
  }
  if (i >= len) i = len - 1;
  
  for (; len > 0 && i<len; i++) {
    pages[i].set("pagesI", i); // $frame.children(".del").data("pagesi", "" + i);
  }
};
handleClickDelButton = function(e){
  e.preventDefault();
  deletePage($(this));
};
handleFrameSwipeLeft = function(e, ui) {
  e.preventDefault();
  // pages[0].$page.append("frame-swipe<br>");
  $(this).one('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function(e) {
    e.preventDefault();
    deletePage($(this).children(".del"));
  });
  $(this).addClass("slideOutToLeft");
};
Page = function(args) {
  let
  entity = args.entity, onClickDelButton = args.onClickDelButton, onSwipeLeftFrame = args.onSwipeLeftFrame, myPagesI = args.pagesI, $pageboxes = args.$pageboxes, $homepage = args.$homepage, $home = args.$home,
  
  $delButton = $("<div>", { class:"del" }).html("&times;"),
  $page =      $("<div>", { class:"page" }),
  $pagebox =   $("<li>", { class:"pagebox" }),
  $frame =     $("<div>", { class:"frame" }),

  getVal, setVal;
  
  Component.call(this, args);

  $page.append(entity.$field);
  $frame.html($page.html());  
  $frame.prepend($delButton);
  $delButton.attr("data-pagesi", "" + myPagesI).on("click", onClickDelButton);
  $frame.on("swipe-left", onSwipeLeftFrame);
  
  $page.insertBefore($pageboxes).on('webkitAnimationEnd oanimationend oAnimationEnd msAnimationEnd animationend', function(e) {
    e.preventDefault();
    if ($(this).hasClass(slideOutClass) || $(this).hasClass(slideOutToLeftClass)) $(this).addClass("hide");
  });;
  $homepage.append($frame);
  $pagebox.insertBefore($home.parent()); // <ul.pageboxes> <pagebox/> *** inserts here *** <li $home/> <li swipe-left-button/> <li swipe-right-button/> </ul>

  getVal = function(propName) {
    let val;
    
    switch (propName) {
    case "entity":
      val = entity;
      break;
    }
    return val;
  };

  setVal = function(propName, val) {
    switch(propName) {
    case "slideIn":
      $page.removeClass(/* "slideOut slideOutToLeft" */slideOutClass + " " + slideOutToLeftClass + " hide").addClass(val);
      $pagebox.addClass("pagebox-active");
      break;
    case "slideOut":
      $page.removeClass(/* "slideIn slideInFromRight" */slideInClass + " " + slideInFromRightClass).addClass(val);
      break;
    case "pagebox-inactivate":
      $pagebox.removeClass("pagebox-active");
      break;
    case "remove":
      $page.remove();
      $frame.remove();
      $pagebox.remove();	
      break;
    case "pagesI":
      $frame.children(".del").data("pagesi", "" + val);
      break;
    }
  };
  
  this.getVal = getVal;
  this.setVal = setVal;
};
createPage = function(args) {
  let entity = args.entity;
    
  pages.push(new Page({ entity:entity, pagesI:pages.length, $pageboxes:$pageboxes, $homepage:$homepage, $home:$home, onClickDelButton:handleClickDelButton, onSwipeLeftFrame:handleFrameSwipeLeft }));
    
  if (pagesI >= 0) pages[pagesI].set("pagebox-inactivate");
  pagesI++;
};
handleClickMenuItem = function(e, item) {
  let entity;
    
  entity = screens[item] ? new Entity({ fieldName:item, fieldClass:"spruit-screen", screen:screens[item], cal:cal, timepicker:tp, responsive:true, resizeAgent:ra }) : new Entity({ fieldName:item });

  // entity.$pageboxes = $pageboxes; XXX
  // entity.crud = crud; XXX REMOVE?

  entity.load();
  createPage({ entity:entity });
};
init = function(that) {
  Component.call(that, args);
  pages = [];
  pagesI = -1;
  $container = that.$field;
  $homepage = $("<div>", { class:"homepage" });
  $pageboxes = $("<ul>", { class:"pageboxes" });
  $container.append($homepage, $pageboxes);
  $home = $("<i>", { class:"fa fa-home myhome" }).on("click", handleClickHome);

  $pageboxes.append( $("<li>", { class:"navi-button" }).append($home) );
  if (!($.support.touch)) {
    $arrowLeft = $("<i>", { class:"fa fa-arrow-circle-left arrow-swipe" }).on("click", () => { $container.trigger("swipe-left"); return false; });
    $arrowRight = $("<i>", { class:"fa fa-arrow-circle-right arrow-swipe" }).on("click", () => { $container.trigger("swipe-right"); return false; });
    $pageboxes.append( $("<li>", { class:"navi-button" }).append($arrowLeft), $("<li>", { class:"navi-button" }).append($arrowRight) );
  }

  slideInClass =          getAttr(attrs, "slideIn",          "page", "slideInClass"); // attrs:{ page:{ slideInClass:"fadeIn", slideOutClass:"fadeOut", slideInFromRightClass:"fadeIn", slideOutToLeftClass:"fadeOut" }}
  slideOutClass =         getAttr(attrs, "slideOut",         "page", "slideOutClass");
  slideInFromRightClass = getAttr(attrs, "slideInFromRight", "page", "slideInFromRightClass");
  slideOutToLeftClass =   getAttr(attrs, "slideOutToLeft",   "page", "slideOutToLeftClass");
  
  $container.on("swipe-right", (e) => handleSwipeRight(e));
  $container.on("swipe-left", (e) => handleSwipeLeft(e));

  menu = new Menu({ fieldName:"PageManager menu", insertLabel:false, menubar:menubar, dropdown:dropdown, onClickDropdown:(e, item) => handleClickMenuItem(e, item) });
  $homepage.append(menu.$field);

  notif = new Notification({ insertLabel:false });
  crud = new Crud({ insertLabel:false, $pageboxes:$pageboxes, $modalcontainer:$container, attrs:{ modal:{ span:{ style:"z-index:3"} }}, pm:that, notification:notif });
  $container.append(crud.$field, notif.$field);

  cal = new Calendar({ fieldName:"Calendar", $modalcontainer:$container, /* attrs:{ modal:{ span:{ style:"z-index:3"} }}, crud:crud, $pageboxes:$pageboxes */ });
  tp = new TimePicker({ fieldName:"TimePicker", $modalcontainer:$container, /* attrs:{ modal:{ span:{ style:"z-index:3"} }}, $pageboxes:$pageboxes, */ });
  ra = new ResizeAgent({ fieldName:"resizeAgent" });
};
init(this);
getVal = function(propName) {
  switch(propName){
  case "entity":return pages[pagesI].get("entity");
  case "ra":return ra;
  }
};
setVal = function(propName, val) {
  let i;
  
  switch (propName) {
  case "goto-page":
    i = pages.findIndex(page => val === page.get("entity").name);
    // console.log("goto-page, i=" + i + ", name=" + pages[i].get("entity").name);
    if (i > -1) {
      pages[pagesI].set("slideOut", slideOutClass); // "slideOut");
      pages[pagesI].set("pagebox-inactivate");
      pagesI = i;
      pages[pagesI].set("slideIn", slideInClass);   // "slideIn");
    } else {
      notif.set("show", "Broken page-link: " + val);
    }
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