spruits2.wc(function Gender() {
  spruits2.Component.call(this, { fieldName:"Gender" });

  this.$field.append(
    [ "Male", "Female", "Other" ].map(name => {
      return $("<div>").append(
	$("<span>").html(name),
	$("<input>", { type:"radio", name:"Gender", value:name }));
    })
  );
  
  this.$field.children("div").children("span").css(
    { display:"inline-block", "padding-left":"1em", width:"5em" }
  );
});
function Entity() {};

if (spruits2.Gender) $("body").append($("<p>").html("wc: created Gender"));
if (spruits2.wc(Entity) === false) $("body").append($("<p>").html("wc: can not create Entity"));

$("body").append((new spruits2.Gender()).$field,
		 $("<p>").append(
		   $("<code>").append( $("<pre>").text(spruits2.Gender.toString()) )
		 ));
$("body").append(
  $("<ol>").append(Object.keys(spruits2).map(prop => { return $("<li>").html(prop); }))
);
