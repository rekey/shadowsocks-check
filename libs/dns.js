/**
 * Created by Rekey on 2017/6/21.
 */

'use strict';

const dns = require('dns');

function getIp(item) {
  if (item.ip) {
    return Promise.resolve(item.ip);
  }
  const domain = item.domain;
  return new Promise((resolve, reject) => {
    dns.lookup(domain, function (err, resp) {
      if (err) {
        // 如果解析不了，就返回一个百度的 ip，反正是要报错的
        resolve('123.125.114.144');
        return;
      }
      resolve(resp);
    });
  });
}

module.exports = { getIp };
