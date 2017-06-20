"use strict";

const Promise = require('bluebird');

const dns = require('./libs/dns.js');
const shadowsocks = require('./libs/shadowsocks.js');
const curl = require('./libs/curl.js');

function checkList(list) {
  const config = {
    local: 10000
  };
  return Promise.map(list, (item) => {
    item.local = config.local++;
    return dns.getIp(item)
      .then((ip) => {
        item.ip = ip;
        return shadowsocks({
          host: ip,
          port: item.port,
          pwd: item.password,
          local: item.local,
          aes: item.aes
        });
      })
      .then((ssClient) => {
        item.ssClient = ssClient;
        item.time = Date.now();
        return curl(ssClient.local);
      })
      .then((resp) => {
        item.ssClient.child.kill();
        delete item.ssClient;
        item.time = resp instanceof Error ? 10000 : Date.now() - item.time;
        return item;
      });
  });
}

module.exports = checkList;

// const list = [{
//   domain: 'sss.sss',
//   aes: 'aes-256-cfb',
//   port: 1234,
//   password: 'password'
// }, {
//   domain: 'sss.xxx',
//   aes: 'aes-256-cfb',
//   port: 4321,
//   password: 'password'
// },];
//
// checkList(list)
//   .then((list) => {
//     console.log('=================');
//     console.log(list.sort((a, b) => {
//       return a.time - b.time;
//     }));
//     console.log('=================');
//   });