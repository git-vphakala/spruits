let rows = Array(200).fill(1);

spruits2.addCssRule(`
.slideshow {
  display:none;
  margin-left:10%;
  width:80%;
  background:cyan;
  height:20em;
}
.slideshow.play {
  display:block;
}
`);
$("body").append(
  $("<button>").html("p1").on("click", function(e) {
    e.preventDefault();
    $("body").children(".page:first").addClass("slideIn");
  }),
  $("<div>", { class:"page", style:"margin-top:2em;" }).append(
    $("<button>").html("scroll").on("click", (e) => {
      e.preventDefault();
      $('#scrolltarget')[0].scrollIntoView({behavior: "smooth"});
    }),
    rows.map((row, i) => { return $("<div>").html("" + (row + i)); }),
    $("<i>", { class:"fa fa-play" }).on("click", e => {
      e.preventDefault();
      $(".slideshow")
	.toggleClass("play")
        [0].scrollIntoView({behavior: "smooth"});
    }),
    $("<div>", { class:"spruit-field slideshow" }),
    $("<div>", { id:"scrolltarget" })
  )
);
