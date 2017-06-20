"use strict";

const Promise = require('bluebird');

const spawn = require('child_process').spawn;

function ss({ host, port, pwd, local, aes }) {
  return new Promise((resolve, reject) => {
    const child = spawn('/usr/bin/sslocal', ['-s', host, '-p', port, '-k', pwd, '-l', local, '-t', 600, '-m', aes]);
    child.stdout.on('data', (data) => {
      const text = data.toString();
      if (text.indexOf('starting') > 0) {
        process.nextTick(() => {
          resolve({
            child: child,
            local: local
          });
        });
      }
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      if (text.indexOf('ERROR') > 0) {
        reject(new Error('ERROR'));
        return;
      }
      if (text.indexOf('starting') > 0) {
        process.nextTick(() => {
          resolve({
            child: child,
            local: local
          });
        });
      }
    });

    child.on('close', (code) => {
      reject(new Error(code));
    });
  });
}

module.exports = ss;
