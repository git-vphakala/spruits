let chatName = "",
    socket = io(),
    $input = $("<input>", { class:"chat" }),
    $name = $("<input>", { class:"name" }),
    $login = $("<div>").append( $name, $("<i>", { class:"fa fa-check" }).on("click", function() {
      chatName = $name.val();
      $login.html("chat name=" + chatName);
      socket.emit("my-name", chatName);
      return false;
    }) ),
    $receiver = $("<input>");
      
$("body").append( $("<div>", { class:"page slideIn" }).append(
  $login,
  $("<ul>", { id:"messages" }),
  $("<ul>", { id:"private-messages" }).append(
    $("<li>").append(
      $receiver,
      $("<i>", { class:"fa fa-paper-plane priva" }).on("click", function() {
	let receiver;
	
	if (chatName.length === 0) return false;
	receiver = $receiver.val();
	if (receiver.length === 0) return false;
	
	socket.emit('private message', { sender:chatName, receiver:receiver, msg:$input.val() });
	$input.val('');
	return false;
      }))),
  $input,
  $("<i>", { class:"fa fa-paper-plane" }).on("click", function() {
    if (chatName.length === 0) return false;
    socket.emit('chat message', { chatName:chatName, msg:$input.val() });
    $input.val('');
    return false;
  })
));

socket.on("chat message", function(msg) {
  $("#messages").append($("<li>").append(
    $("<span>", { class:"chatname"}).text(msg.chatName),
    msg.msg
  ));
});

socket.on("private message", function(msg) {
  $("#private-messages").append($("<li>").append(
    $("<span>", { class:"chatname"}).text(msg.sender),
    msg.msg
  ));
})

spruits2.addCssRule(`body { font: 16px Helvetica, Arial; position:relative; }
  input.chat { position:absolute; bottom:0; width:90%; }
  i.fa-paper-plane { position:absolute; bottom:0.5em; right:1em; font-size:150%; }
  i.fa-paper-plane.priva { position:unset; }
  .fa-check,
  .fa-paper-plane {
    padding: 5px;
    border-top: 1px solid #bbbb00;
    border-right: 2px solid #bbbb00;
    border-bottom: 1px solid #bbbb00;
    border-radius: 50%;
    background: var(--backgroundColor);
    color:#999900;
  }
  i.fa-check { margin-left:1em; }
  #messages, #private-messages { list-style-type: none; margin: 0; padding: 0; }
  #messages li, #private-messages li { padding: 5px 10px; }
  #messages li:nth-child(odd) { background: #eee; }
  #private-messages { background: yellowgreen; }
  #private-messages li:nth-child(odd) { background: #999900; }
  #private-messages li:nth-child(even) { background: #666600; }
  .chatname { display:inline-block; width:5em; border-right:1px solid #bbb; margin-right:0.5em; }`);
