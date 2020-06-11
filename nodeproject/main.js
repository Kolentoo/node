var ws=require('nodejs-websocket');
var server=ws.createServer(function(conn){
  console.log('new connection创建连接成功。。。');
  //用来处理接收客户端的消息
  conn.on('text',function(str){
    console.log(str);

     var data = JSON.parse(str);    
     switch(data.type){
       case 'setname':
         conn.nickname=data.name;
         broadcast(JSON.stringify({
           name: 'Server',
           text: data.name + '加入了房间'        
         }));
          break;
       case 'chat':        
           broadcast(JSON.stringify({
             name: conn.nickname,
             text: data.text    
           }));           
           break;
       default:
           break;
     }
  });
  //当用户关闭网页或者手动关闭网页连接时自动触发
  conn.on('close', function() {    
   broadcast(JSON.stringify({
     name: 'Server',
     text: conn.nickname + '离开了房间'        
   }));
  });
    //error事件这个必须写，否则当客户端关闭时，后端服务器会崩溃
    conn.on('error',function(err){
        console.log(err);
    })
 }).listen(8001); //listen方法设置端口号
 
 //循环将消息广播更新给所有人
 function broadcast(str){
   console.log('进入广播。。。');
   console.log(str);
    //server.connections就是可以拿到所有人数组
    //遍历每一个人发消息
    server.connections.forEach(function(conn) {
      conn.sendText(str);//发送消息给客户端
    })
 }
