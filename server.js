// TurboWarp联机WebSocket服务端 端口8080
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// 存放所有在线玩家
const onlineUsers = new Set();

// 有玩家连接进来
wss.on('connection', (ws) => {
  onlineUsers.add(ws);
  console.log("玩家已加入，当前在线人数：" + onlineUsers.size);

  // 收到消息，广播给房间所有人
  ws.on('message', (msg) => {
    for (const user of onlineUsers) {
      if (user.readyState === WebSocket.OPEN) {
        user.send(msg);
      }
    }
  });

  // 玩家退出房间
  ws.on('close', () => {
    onlineUsers.delete(ws);
    console.log("玩家离开，当前在线人数：" + onlineUsers.size);
  });
});

console.log("联机服务器启动成功！地址：ws://127.0.0.1:8080");
