(function (dependents) {
  var { Thirteen: { utils, Chess, settings, IPC } } = dependents;
  var el = utils.getDom('.thirteen-chessboard');
  var warnEl = utils.getDom('.thirteen-warning');
  var restartEl = utils.getDom('.thirteen-restart');
  var startLiveEl = utils.getDom('.thirteen-startlive');
  var currentVideoEl = utils.getDom('#current-user');
  var remoteVideoEl = utils.getDom('#remote-user');
  var introEl = utils.getDom('#intro');

  var chess = new Chess({ el });
  var isGameover = false, $chatroom;

  var { appKey, users } = settings;

  var MESSAGE = {
    CHESS: 'TT:chess',
    RESTART: 'TT:restart'
  };

  var QueryString = utils.getQueryString();

  var getChatroomId = () => {
    return QueryString.roomid;
  }

  var getWinText = (name) => {
    return `${name}赢了~~~`;
  };
  var interval = 0, isNext = true;
  var checkGame = (direction) => {
    var name = '对方';
    if (!utils.isCurrent()) {
      introEl.innerHTML = '你为白棋，对手为黑棋';
      name = '自己'
    }
    if (isGameover) {
      clearInterval(interval)
      warnEl.innerHTML = getWinText(name);
    } else {
      if (interval) {
        clearInterval(interval)
      }
      var seconds = 15;
      interval = setInterval(() => {
        warnEl.innerHTML = `待${direction}下棋，倒计时 ${seconds--}s`;
        if (seconds < 0) {
          clearInterval(interval);
          isGameover = true;
          warnEl.innerHTML = getWinText(name);
        }
      }, 1000);
    }
  }

  var restart = () => {
    location.reload();
  };

  var setVideo = (node, user) => {
    node.srcObject = user.stream.mediaStream;
  };

  IPC.startIM({
    appKey, token: users[QueryString.id || 0]
  }, {
    connected: (im) => {
      var roomId = getChatroomId();
      $chatroom = im.ChatRoom.get({
        id: roomId
      });
      $chatroom.join({ count: -1 }).then(function () {
        console.log('已开局....');
      });

      startLiveEl.onclick = function (event) {
        IPC.startRTC({
          roomId: roomId,
          user: {
            id: im.getConnectionUserId()
          }
        }, {
          published: (user) => {
            // setVideo(currentVideoEl, user);
          },
          subscribed: (user) => {
            // setVideo(remoteVideoEl, user);
          }
        });
      }

    },
    received: (message) => {
      var { messageType, content } = message;
      if (utils.isEqual(messageType, MESSAGE.CHESS)) {
        var { x, y } = content;
        isGameover = chess.play(x, y, !utils.isCurrent());
        isNext = true;
        checkGame('自己')
      }
      if (utils.isEqual(messageType, MESSAGE.RESTART)) {
        restart();
      }
    }
  });

  el.onclick = function (event) {
    if (isGameover || !isNext) {
      return;
    }
    isNext = false;
    var x = event.offsetX;
    var y = event.offsetY;
    isGameover = chess.play(x, y, utils.isCurrent());
    $chatroom.send({
      messageType: MESSAGE.CHESS,
      content: {
        x, y
      }
    });
    checkGame('对方')
  };

  restartEl.onclick = function (event) {
    $chatroom.send({
      messageType: MESSAGE.RESTART,
      content: {}
    }).then(() => {
      restart();
    });
  }

  window.chess = chess;
})({
  Thirteen
})