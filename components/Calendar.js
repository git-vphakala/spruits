Calendar = function(args) {
let
attrs = args.attrs,$modalcontainer = args.$modalcontainer,$pageboxes = args.$pageboxes,crud = args.crud,view = args.view,
timestamp,$dest,$content,modalId,modal,modalAttrs,
inc,dec,setCalendar,clickDay,init,
getVal,setVal,empty;
inc = function() {
  let date = new Date(timestamp);

  if (date.getMonth() < 11) {
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setDate(1);
    date.setMonth(0);
    date.setFullYear(date.getFullYear() + 1);
  }

  setCalendar(date.getTime());
  return false;
};
dec = function() {
  let date = new Date(timestamp);

  if (date.getMonth() > 0) {
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
  } else {
    date.setDate(1);
    date.setMonth(11);
    date.setFullYear(date.getFullYear() - 1);
  }

  setCalendar(date.getTime());
  return false;
};
setCalendar = function(ts) {
  let srcdate, mon, year, r, day = 1, dayOfWeek, daysInMonth, row, $day;

  timestamp = ts;

  srcdate = new Date(timestamp);
  mon = Month.getMonStr(srcdate.getMonth()),
  year = srcdate.getFullYear();
  daysInMonth = Month.getDaysInMonth(srcdate),

  $content.find("tr:first-child td:nth-child(2)").html(mon + " " + year); // $(".spruits-calendar tr:first-child td:nth-child(2)").html(mon + " " + year);

  /*$weeks*/
  for (row=3;row<=8;row++) {
    $content.find("tr:nth-child(" + row + ") td").each( function() { $(this).empty().css("cursor", "").off("click"); });
  }

  for (r = 0; r < 6 && day <= daysInMonth; day++) {
    row = $content.find("tr:nth-child(" + (r + 3) + ")");
    srcdate.setDate(day);

    dayOfWeek = srcdate.getDay();

    switch (dayOfWeek) {
    case 0: // su
      $day = row.children("td:nth-child(" + 7 + ")");
      $day.html(day).css("cursor", "pointer").on("click", clickDay);
      r++;
      break;

    default:
      $day = row.children("td:nth-child(" + dayOfWeek + ")");
      $day.html(day).css("cursor", "pointer").on("click", clickDay);
      break;
    } // switch
  } // for (r)
};
clickDay = function(e) {
  let day = $(this).html(), date = new Date(timestamp);

  date.setDate(day);
  timestamp = date.getTime();
  $dest.val( "" + date.getFullYear() +  "-" + (("00" + (date.getMonth() + 1)).slice(-2))+ "-" + (("00" + date.getDate()).slice(-2)) );
  modal.set("close");
  return false;
};
init = function(that) {
  if (args === undefined) {
    args = {};
  };
  if (args.fieldClass === undefined) {
    args.fieldClass = "spruits-calendar";
  }
  args.insertLabel = false;

  Component.call(that, args);

  that.$field.append(
    $("<table>").append( $("<tbody>").append(
      $("<tr>").append(
        $("<td>").append( $("<i>", {class:"fa fa-angle-left"}).on("click", dec) ),
        $("<td>").attr("colspan", "5"),
        $("<td>").append( $("<i>", {class:"fa fa-angle-right"}).on("click", inc) ),
      ),
      $("<tr>").append( ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => { return $("<td>").html(day) }) ),
      Array(6).fill( Array(7).fill(null) ).map(row => $("<tr>").append(row.map(col => $("<td>"))))
    )));
  $content = that.$field;

  if (attrs !== undefined) {
    modalAttrs = attrs.modal;
  }
  modalId = getId("spruits-cal");
  modal = new Modal({ fieldName:"Calendar", "$modalbody":$content, id:modalId, $container:$modalcontainer, attrs:modalAttrs, $pageboxes:$pageboxes, crud:crud, attrs:{span:{style:"z-index:10;"}} });
};
init(this);
getVal = function(propName) {
  return $content;
};
setVal = function(propName, val) {
  switch(propName) {
  case "field name":
    modal.set("$title", val);
    // $content.children("span:first-child").html(val);
    break;
  default:
  case "val":
  case "date":
    setCalendar(val === undefined ? propName : val);
    break;
  case "$dest":
    $dest = val;
    break;
  case "show":
    modal.set("show"); // $field.css("display", "block");
    // modal.$field.find(".modal-content").removeClass("modalout").addClass("modalin");
    //$content.removeClass("calendarSlideOut").addClass("calendarSlideIn");
    break;
  } // switch
};
empty = function() {
};
this.getVal = getVal;
this.setVal = setVal;
this.empty = empty;
};