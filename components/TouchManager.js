TouchManager = function(args) {
let
touch,log,
isSwipe,handleTouchStart,handleTouchMove,handleTouchEnd,handleTouchCancel,init,
getVal,setVal,empty,validate;
isSwipe = function(touch) {
  let 
  duration, distanceX, distanceY, moves, numMoves, result, oneDirection, direction;
  
  oneDirection = function(moves, numMoves) {
    let prevX, prevY, i, horizontal, minY, maxY;

    if (numMoves <= 1) {
      return { horizontal:{ oneDirection:false } };
    }
    prevX = moves[0].x;
    minY = moves[0].y;
    maxY = minY;
    if (moves[1].y < minY) {
      minY = moves[1].y;
    } else if (moves[1].y > maxY) {
      maxY = moves[1].y;
    }
    if (prevX <= moves[1].x) {
      horizontal = { right:true, oneDirection:true };
      
      for (i=2; i<numMoves; i++) {
        if (prevX > moves[i].x) {
          horizontal.oneDirection = false;
          break;
        }
        prevX = moves[i].x;
	
        if (moves[i].y < minY) {
          minY = moves[i].y;
        } else if (moves[i].y > maxY) {
          maxY = moves[i].y;
        }
      } // for (i)
    } else {
      horizontal = { right:false, oneDirection:true };
      
      for (i=2; i<numMoves; i++) {
        if (prevX < moves[i].x) {
          horizontal.oneDirection = false;
          break;
        }
        prevX = moves[i].x;
	
        if (moves[i].y < minY) {
          minY = moves[i].y;
        } else if (moves[i].y > maxY) {
          maxY = moves[i].y;
        }
      } // for (i)
    } // horizontal -> left
    
    horizontal.verticalAltitude = Math.abs(minY - maxY);
    
    return { horizontal:horizontal };
  }; // oneDirection()

  moves = touch.moves;
  duration = touch.end.time - touch.start.time;
  distanceX = parseInt(touch.start.x - touch.end.x);
  distanceY = parseInt(touch.start.y - touch.end.y);
  
  result = (duration < 500);
  if (result &&
      (result = ((distanceX = Math.abs(distanceX))<300)) &&
      (result = (distanceX >= 30)) &&
      (result = ((numMoves = moves.length) <= 21)) &&
      (result = (numMoves > 0))) {

    direction = oneDirection(moves, numMoves);
    if ((result=direction.horizontal.oneDirection) &&
        (result=(direction.horizontal.verticalAltitude<30))) {
    }
  }
  
  return { result:result, horizontal: direction.horizontal };
};
handleTouchStart = function(e) {
  touch = {
    start: { time: Date.now(),
             x: e.changedTouches[0].screenX,
             y: e.changedTouches[0].screenY,
             numT:e.changedTouches.length
           },
    moves: []
  };
};
handleTouchMove = function(e) {
  touch.moves.push({ time: Date.now(),
		     x: e.changedTouches[0].screenX,
		     y: e.changedTouches[0].screenY,
		     numT: e.changedTouches.length
		   });
};
handleTouchEnd = function(e) {
  let swipe;
  
  touch.end = {
    time:Date.now(),
    x: e.changedTouches[0].screenX,
    y: e.changedTouches[0].screenY,
    numT:e.changedTouches.length
  };
  swipe = isSwipe(touch);
  if (swipe.result === true) {
    if (swipe.horizontal.right === true) {
      if (log !== undefined) {
        log.append("swipe-right<br>");
      }
      $(e.target).trigger("swipe-right");
    } else {
      if (log !== undefined) {
        log.append("swipe-left<br>");
      }
      $(e.target).trigger("swipe-left");
    }
  }
};
handleTouchCancel = function(e){
  if (log !== undefined) {
    log.append("Tcancel");
  }
};
init = function(that) {
  Component.call(that, args);
  
  $("body")
    .on("touchstart",  handleTouchStart)
    .on("touchmove",   handleTouchMove)
    .on("touchend",    handleTouchEnd)
    .on("touchcancel", handleTouchCancel);
};
init(this);
getVal = function(propName) {
};
setVal = function(propName, val) {
  switch (propName) {
  case "$log":
    log = val;
    break;
  } // switch
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