(function (dependents) {
  var { Thirteen: { utils, Chess } } = dependents;
  var el = utils.getDom('.thirteen-chessboard');
  var chess = new Chess({ el });
  var isGameover = false;

  el.onclick = function (event) {
    if(isGameover){
      return;
    }
    var x = event.offsetX;
    var y = event.offsetY;
    isGameover = chess.play(x, y, true);
  };

  window.chess = chess;
})({
  Thirteen
})