// print mesage + pid to console when a message is recieved from
console.log('echo was spawned!');
process.on('message', function (message) {
  console.log(`pid ${process.pid} got message ${message}`);
  process.send('pong!')
});

//process.exit()