let pm, screens = {}, menubar, dropdown, createDocPage, prettyPrintNopageSlideshow;

createDocPage = function(pageName, $page) {
  return {
    create: function(entity) {
      entity.createField(pageName, spruits2.Component, { insertLabel:false, $field:$("<span>").append($page) });
      entity.insertFields();
    }, // create
  }; // screens
};

prettyPrintNopageSlideshow = function(pmHtml) {
  pmHtml = pmHtml
    .replace('<label></label>', '\n  <label></label>\n\n  ')
    .replace('<span class="spruit-field">', '\n    <span class="spruit-field">\n      ')
    .replace('<ul class="spruits-menubar">', '\n      <ul class="spruits-menubar">\n        ')
    .replace('<a class="dropbtn" href="javascript:;">File</a>', '\n          <a class="dropbtn" href="javascript:;">File</a>\n          ')
    .replace('<li><a id="Slide1">Slide1</a></li>', '\n            <li><a id="Slide1">Slide1</a></li>\n            ')
    .replace('<li><a id="Slide3">Slide3</a></li></ul></li></ul></span></div>', '\n            <li><a id="Slide3">Slide3</a></li></ul></li></ul></span></div>\n\n  ')
    .replace('<i class="fa fa-home myhome"></i>', '\n    <i class="fa fa-home myhome"></i>\n    ')
    .replace('<i class="fa fa-arrow-circle-right arrow-swipe"></i></ul>', '\n    <i class="fa fa-arrow-circle-right arrow-swipe"></i></ul>');
  return pmHtml.slice(0, pmHtml.indexOf('<span class="spruits-modal"')) + "</span>";
};

/*
{
  create: function(entity) {
    entity.$field.append(
      $("<div>", { class:"field-row dotted" }).append(
	slideshow[0].$field.css({ "padding-left":"1em" })
      )
    );
  }, // create
};
*/
menubar = [ "File" ];

dropdown = {
  "File":[ "PageManager" ],
}

//****************************************************************************************************************************************************************************
let SlideshowImplementation = [], slideshow=[];

spruits2.addCssRule(`.spruit-field.slideshow {
  display: block;
  width: 80%;
  margin-left: 10%;
  background: lightcyan;
  position: relative;
}
.spruit-field.slideshow .page,
.spruit-field.slideshow .homepage,
.spruit-field.slideshow .pageboxes {
  position: absolute;
  background: lightcyan;
  overflow-y: hidden;
}
.spruit-field.slideshow .pageboxes {
  padding:0;
}
.slideshow .spruit-screen > label {
  display: none;
}
.page.slideOut.hide,
.page.slideOutToLeft.hide {
  display: none;
}
.spruits-crud.hide.fadeIn {
  display: none;
}
.spruit-field.slideshow-app .fa-play, 
.spruit-field.slideshow-app .fa-pause, 
.spruit-field.slideshow-app .fa-stop {
  padding: 5px;
  border-top: 1px solid #bbbb00;
  border-right: 2px solid #bbbb00;
  border-bottom: 1px solid #bbbb00;
  border-radius: 4px;
  background: var(--backgroundColor);
  color: #999900;
  padding-left: 8px;
}
.spruit-field.slideshow.hide {
	display: none;
}`);

//****************************************************************************************************************************************************************************
SlideshowImplementation[0] = {};
SlideshowImplementation[0].f = function Slideshow(args) {
  let
  slideList = [ "Slide1", "Slide2", "Slide3" ],
  
  Pager = function Pager(args) {
    args.screens = {};
    slideList.forEach(slideName => {
      args.screens[slideName] = { create:function(entity) {
	entity.$field.append( $("<img>", { alt:slideName, src:slideName + ".JPG", width:"100%" }) );
      } };
    });

    args.menubar = [ "File" ];

    args.dropdown = {};
    args.dropdown["File"] = slideList.slice();

    spruits2.PageManager.call(this, args);
    this.$field.addClass("slideshow");
    this.$field.children(".spruits-crud").addClass("hide");
    
    $(window).on("resize", () => this.setHeight("height"));

    this.setHeight = function(propName, val, func) {
      switch (propName) {
      case "height":
	let w = this.$field.width();
	this.$field.height(w * 0.704);
	break;
      case "animate":
	let h = (this.$field.width() * 0.704) + "px";
	this.$field.animate({ height: val ? val : h }, func);
	break;
      }
    };
  },

  slidesInitDone,
  showOn,
  
  handleTimeoutArrowLeft = function(counter) {
    pager.$field.find(".fa-arrow-circle-left").trigger("click");
    counter++;
    if (counter < slideList.length) setTimeout(handleTimeoutArrowLeft, 5000, counter);
    else showOn = false;
  },
  
  handleClickPlay = function handleClickPlay(e) {
    e.preventDefault();
    pager.$field.removeClass("hide");
    pager.setHeight("animate", undefined, () => {
      if (slidesInitDone !== true) {
	let $myhome = pager.$field.children(".pageboxes").children(".myhome");
	$myhome.trigger("click");
	pager.$field.find("#Slide1").trigger("click");
	pager.$field.find("#Slide3").trigger("click");
	pager.$field.find("#Slide2").trigger("click");
	$myhome.trigger("click");
	slidesInitDone = true;
      }
      if (showOn !== true) {
	setTimeout(handleTimeoutArrowLeft, 5000, 0);
	showOn = true;
      }
    });
  },
  handleClickPause = ()=>{},
  handleClickStop = (e) => {
    e.preventDefault();
    pager.setHeight("animate", "0px", () => pager.$field.addClass("hide"));
  },
  
  pager = new Pager({ fieldName:"Slideshow", insertLabel:false });

  spruits2.Component.call(this, { fieldName:args.fieldName });
  this.$label.append($("<i>", { class:"fa fa-play" }).on("click", handleClickPlay).css({ "margin-left":"0.5em" }),
		     " ", $("<i>", { class:"fa fa-pause" }).on("click", handleClickPause),
		     " ", $("<i>", { class:"fa fa-stop" }).on("click", handleClickStop));
  this.$field.append(pager.$field.addClass("hide")).addClass("slideshow-app");
  
  this.setHeight = () => pager.setHeight("height");
};
slideshow[0] = new SlideshowImplementation[0].f({ fieldName:"Slideshow", insertLabel:false });

screens["PageManager"] = createDocPage("PageManager",[
  $("<div>", { class:"field-row dotted" }).append(
    $("<p>").append(
      $("<p>").html(`
  PageManager is a specialized container-component which extends Component only. It gets the content as components which are grouped into screens. Screens are type of Entity. Entity is packed to Page and handling of these gives the 
  manager its name. Page is an internal component of PageManager. Manager creates a page, when it is needed. Screen-entities are application specific and they are programmed by the application developers. In addition to creation, 
  PageManager provides means for navigation from a page to another. A whole application can be paged or it may contain a paged field. This document is an example of the paged application and this page shows how to create a paged field.
      `),
      $("<p>").html(`
  Inside PageManager, there are Bar, Homepage and Pageboxes. The following shows the html which is produced, when there is not any created pages.
      `),
      $("<code>").append( $("<pre>").css({ "padding-left":"1em" }).text(prettyPrintNopageSlideshow(slideshow[0].$field.prop("outerHTML"))) ),
      $("<p>").html(`
  Homepage which is the table of contents of the created pages. Homepage contains Menu which is able to trigger the creation of the desired page. Menu can be visible or not. If the menu is unvisible pages are done programmatically.
  It is possible to create pages programmatically when the menu is available or by the user interactions. An example of the programmatically created pages is the browser version of this document. The latter case is typically used by a 
  database UI application, for example. It is possible to create several pages from one screen-entity.
      `),
      $("<p>").html(`
  PageManager gets its screen-entities in an argument called <code>screens</code>. It is an object, which contains screens as properties.
      `)
    )    
  ),
  $("<div>", { class:"field-row dotted" }).append(
    slideshow[0].$field.css({ "padding-left":"1em" })
  )
]);
//****************************************************************************************************************************************************************************
pm = spruits2.init({ screens:screens, menubar:menubar, dropdown:dropdown });
pm.$field.addClass("spruitsdoc");
$("body").append(pm.$field);

$(".spruitsdoc").children(".homepage").children(":first")
  .removeClass("spruit-field")
  .addClass("spruit-screen")
  .children("label").html("Table of Contents");
$(".spruitsdoc").children(".homepage").children(":first").children(".spruits-menubar").addClass("hide");

$(".spruitsdoc").children(".pageboxes").children(".myhome").trigger("click");
//$("#Introduction").trigger("click");
//$("#Screen JS".replace(/ /g, "")).trigger("click");
//$("#Component".replace(/ /g, "")).trigger("click");
//$("#Container".replace(/ /g, "")).trigger("click");
//$("#Entity".replace(/ /g, "")).trigger("click");
$("#PageManager".replace(/ /g, "")).trigger("click");

$(".spruitsdoc").children(".pageboxes").children(".myhome").trigger("click");
