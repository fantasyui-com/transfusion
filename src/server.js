const chokidar = require('chokidar');
const path = require('path');

const retry = require('retry');

const WebSocket = require('ws');

// TODO: Wrap object handeling in Specialized Emitter to escape data: envelope.data madness
// TODO: Employ https://github.com/fantasyui-com/cuddlemuffin for data storage

const wss = new WebSocket.Server({ port: 8081 });

const EventEmitter = require('events');
class Transfusion extends EventEmitter {}
const transfusion = new Transfusion();

transfusion.on('send.object', (object) => {
  transfusion.emit('send', {name:'object', data: object });
})

transfusion.on('send', (object) => {
  const encoded = JSON.stringify(object);
  var operation = retry.operation({
    retries: 5,
    factor: 3,
    minTimeout: 1 * 1000,
    maxTimeout: 10 * 1000,
    randomize: true,
  });
  operation.attempt(function(currentAttempt) {
    console.error(`Sending object resulted in an error, retying ${currentAttempt}/${operation.retries}: ${operation.mainError()}`)
    try{
      ws.send(encoded);
    }catch(e){
      operation.retry(e);
    }
  });
});

wss.on('client.connection', function connection(socket) {

  transfusion.emit('client.connection', {socket});

  socket.on('message', function incoming(data) {
    transfusion.emit('client.message', {socket,data});
  });

  socket.on('message', function incoming(data) {
    try{
      const envelope = JSON.parse(data);

      transfusion.emit('client.envelope', {socket,envelope});

      if(envelope.type) {
        transfusion.emit(`client.${envelope.type}`, {socket, envelope.data});
      }

    }catch(e){
      console.error(e)
    }
  });

})

transfusion.on('client.connection', ({socket}) => {

  transfusion.emit('send.object', {uuid:'aaf', version:1, tags:'todo,today,bork', text:"Buy Milk!"});

  setInterval(function(){
    transfusion.emit('send', {name:'object', data: {uuid:'aag', version:1, tags:'todo,today,bork', text:"Buy Socks!"} });
  }, 1000);

})
