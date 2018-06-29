module.exports = function(options){


/// standard boilerplate with ecosystem components
const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');

const pookie = require('pookie')(options.vfs);
const ensign = require('ensign')({});

const bogo = require('bogo')({port:options.port, debug:true});
const dataCommand = require('data-command')();

const reconcilers = options.reconcilers;

const EventEmitter = require('events');
class Transfusion extends EventEmitter {}
const transfusion = new Transfusion();

transfusion.on('send', (object) => {
  console.log('send triggered bogo reply', object)
  bogo.emit('reply', object);
});

transfusion.on('server.control', (object) => {
  if(object.command === 'reload') window.location.reload(true);
});

transfusion.on('server.object', (object) => {
  console.log('server.object', object)
  pookie.pipe(object); // insert object into pookie
});

transfusion.on('server.objects', (objects) => {
  console.log('server.objects', objects);
  objects.map(object=>pookie.pipe(object));
});

/// Register Commands

transfusion.on('command.clog', ({node, options}) => {
  console.dir(ensign.log());
});

transfusion.on('command.create', ({node, options}) => {
  const task = {
    uuid: options.uuid || uuid(),
    version:1,
    tags:'todo,today,bork',
    text: options.text || "Untitled Task"
  };
  console.log('Create Action Called...:', options, task);

  transfusion.emit('send', {type:'storage', data:task});

});

transfusion.on('command.load', () => {
  console.log('command.load triggered dispatching send')
  transfusion.emit('send', {type:'load'})

});

transfusion.on('command.stream', ({node, options}) => {
  const path = options.source;
  const template = $(`#${options.template}`).children(0).clone();
  // TODO: reconciler should allow editing of bound data via event delegation on node
  const reconciler = reconcilers[options.reconciler]({transfusion, node, template});
  pookie.mount(path, reconciler);
});

/// Flow Preparations
transfusion.on('install.commands', (object) => {

  /// bogo to transfusion proxy (for uniformity)
  bogo.on('control', function(object) { transfusion.emit('server.control', object); })
  bogo.on('object', function(object) { console.log('bogo: object', object); transfusion.emit('server.object', object); });
  bogo.on('objects', function(objects) { console.log('bogo: objects', objects); transfusion.emit('server.objects', objects); });
  bogo.on('error', function(object) { transfusion.emit('socket.error', object); });
  bogo.on('close', function(object) { transfusion.emit('socket.close', object); });


  dataCommand.commands().forEach(function({node, commands}){

   commands.forEach(function(setup){
     console.info('COMMAND:', setup);

     if(setup.on === 'click'){
       $(node).on('click', function(){
         console.info('COMMAND EXECUTION (via click):', setup);
         transfusion.emit(`command.${setup.program}`, {node, options:setup});
         ensign.log(setup)
       });
     }else{
       // Instant execution
       transfusion.emit(`command.${setup.program}`, {node, options:setup});
       ensign.log(setup)
     }

   }); // for each command fragment

 }); // forEach command in DOM


});

transfusion.on('dom.ready', (object) => {
  transfusion.emit('install.commands');
});

transfusion.on('socket.error', (object) => {
  console.error(object)
});

transfusion.on('socket.close', (object) => {

  console.log(object.code.code, object.code, object.code)

   if(object.code.code == 1006){
     // Server Down
     console.info('socket.close: Server Restart/Down');
     setTimeout(()=>location.reload(true), 6000);
   }else if(object.code.code == 1001){
     // user reload
     console.info('socket.close: User Reload');
   }else{
     console.info('socket.close:', object);
   }
});

/// Boot Transfusion

$(function() {
  transfusion.emit('dom.ready');
});

return transfusion;
}
