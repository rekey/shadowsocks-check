"use strict";

const Promise = require('bluebird');

const spawn = require('child_process').spawn;

function ss({host, port, pwd, local, aes}) {
  return new Promise((resolve, reject) => {
    const child = spawn('sslocal', ['-s', host, '-p', port, '-k', pwd, '-l', local, '-t', 600, '-m', aes]);

    child.stdout.on('data', (data) => {
      const text = data.toString();
      if (text.indexOf('starting') > 0) {
        resolve({
          child: child,
          local: local
        });
      }
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      if (text.indexOf('ERROR') > 0) {
        console.error(host, port, pwd, local, aes);
        reject();
        return;
      }
      if (text.indexOf('starting') > 0) {
        resolve({
          child: child,
          local: local
        });
      }
    });

    child.on('close', (code) => {
      process.nextTick(reject);
    });
  });
}

module.exports = ss;
