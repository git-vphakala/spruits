const Component = spruits2.Component;

const testcases = [];

const Testcase = function(ra) {
  let $width = $("<span>");
  Component.call(this, { fieldName:ra.name });

  this.resize = function(e) {
    $width.html("" + $(window).width());
  };
  
  $(window).on("resize", this.resize);
  
  this.$field.append($("<div>").append( "Width: ", $width ));
  $(window).trigger("resize");
};

testcases.push(new Testcase({ name:"Resize Agent" }));

//****************************************************************************************************************************************************************************
$("body").append(
  "<h4>resize-event</h4>", testcases.map(testcase => testcase.$field)
);
