<!DOCTYPE html>
<html>
<style>
/* checkbox */
.checkbox {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Hide the browser's default checkbox */
.checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

/* Create a custom checkbox */
.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #ff0;
    border:0;
    border-right: 1px dotted #999900;
    border-bottom: 1px dotted #999900;
    border-radius:4px;
}

/* On mouse-over, add a grey background color */
.checkbox:hover input ~ .checkmark {
    background-color: #cccc00;
}

/* When the checkbox is checked, add a blue background */
.checkbox input:checked ~ .checkmark {
    background-color: #FFFF00;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

/* Show the checkmark when checked */
.checkbox input:checked ~ .checkmark:after {
    display: block;
}

/* Style the checkmark/indicator */
.checkbox .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid #333300;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
</style>
<body>

<h1>Custom Checkboxes</h1>
<label class="checkbox">One
  <input type="checkbox" checked="checked">
  <span class="checkmark"></span>
</label>
<label class="checkbox">Two
  <input type="checkbox">
  <span class="checkmark"></span>
</label>
<label class="checkbox">Three
  <input type="checkbox">
  <span class="checkmark"></span>
</label>
<label class="checkbox">Four
  <input type="checkbox">
  <span class="checkmark"></span>
</label>

</body>
</html>
