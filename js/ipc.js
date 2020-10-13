(function (dependents) {
  var { Thirteen, Thirteen: { utils }, RongIMLib, RongRTC } = dependents;
  var startIM = (config, callbacks) => {
    var { appKey, token, chatroomId } = config;
    var im = RongIMLib.init({ appkey: appKey });
    im.watch({
      message: function (event) {
        var message = event.message;
        console.log('收到新消息:', message);
        callbacks.received(message);
      },
      status: function (event) {
        var { status } = event;
        console.log('连接状态码:', status);
      },
      chatroom: function (event) {
        var updatedEntries = event.updatedEntries;
        console.log('聊天室 KV 存储监听更新:', updatedEntries);
      }
    });
    im.connect({ token }).then(function (user) {
      console.log(user.id)
      callbacks.connected(im);
    });
  };
  var startRTC = () => {

  };
  Thirteen.IPC = {
    startIM,
    startRTC
  };
})({
  Thirteen,
  RongIMLib,
  RongRTC
})