(function (dependents) {
  var { Thirteen: { utils, Chess, settings, IPC } } = dependents;
  var el = utils.getDom('.thirteen-chessboard');
  var chess = new Chess({ el });
  var isGameover = false, $chatroom;

  var { appKey, users } = settings;

  var MESSAGE = {
    CHESS: 'TT:chess'
  };

  var getChatroomId = () => {
    var KEY = 'thirteen_room_id'
    var roomId = utils.Cache.get(KEY);
    if (!roomId) {
      roomId = `I_${Date.now()}`;
      utils.Cache.set(KEY, roomId)
    }
    return roomId;
  }
  var QueryString = utils.getQueryString() || 0;
  IPC.startIM({
    appKey, token: users[QueryString.id]
  }, {
    connected: (im) => {
      var roomId = getChatroomId();
      $chatroom = im.ChatRoom.get({
        id: roomId
      });
      $chatroom.join({ count: -1 }).then(function () {
        console.log('已开局....');
      });
    },
    received: (message) => {
      var { messageType, content } = message;
      if (utils.isEqual(messageType, MESSAGE.CHESS)) {
        var { x, y } = content;
        isGameover = chess.play(x, y);
      }
    }
  });

  el.onclick = function (event) {
    if (isGameover) {
      return;
    }
    var x = event.offsetX;
    var y = event.offsetY;
    isGameover = chess.play(x, y, true);
    $chatroom.send({
      messageType: MESSAGE.CHESS,
      content: {
        x, y
      }
    });
  };

  window.chess = chess;
})({
  Thirteen
})