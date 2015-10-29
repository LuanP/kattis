'use strict';

let runner = require('./runner');

let count = 0;


function log(msg, spaceTop) {
  console.log(`${spaceTop ? '\n' : ''}# ${msg}`);
}

function setLogger(set) {
  count++;
  set.on('init', () => log(`Input set #${count}, running...`, true));
  set.on('print', str => process.stdout.write(str));
  set.on('completed', () => {
    log(`Completed after ${set.duration.toFixed(3)}s`, set.useNewline());
    if (!set.matches()) {
      log(`Failure! Expected output:\n${set.expected}`);
    }
  });
  set.on('error', err => {
    log(`Terminated after ${set.duration.toFixed(3)}s`, set.useNewline());
    console.error(`\n${err.stack}\n`);
  });
}


module.exports = function(cb) {
  count = 0;

  runner.on('set', setLogger);
  log('Testing solution');
  runner.emit('run');
  runner.removeListener('set', setLogger);

  cb();
};
