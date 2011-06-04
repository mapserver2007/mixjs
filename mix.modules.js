/*
 * mix.modules.js
 * varsion: 0.1.0 (2011/06/04)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2011, Ryuichi TANAKA [mapserver2007@gmail.com]
 */
 
var Cache = Module.create({
  getCurrentDate: function() {
    return ~~(new Date() / 1000);
  },
  unixTimeToDate: function(ut, optTimeZone) {
    var tz = optTimeZone || 0;
    var date = new Date(ut * 1000);
    date.setTime(date.getTime() + 60 * 60 * 1000 * tz);
    return date;
  },
  createKey: function(key, optExpire) {
    if (typeof optExpire === "undefined") {
      return key;
    }
    var expireTime = this.getCurrentDate();
    for (var term in optExpire) {
      switch (term) {
      // 現在よりx日後
      case "day":
        expireTime += 60 * 60 * 24 * optExpire[term];
        break;
      // 現在よりx時間後
      case "hour":
        expireTime += 60 * 60 * optExpire[term];
        break;
      // 現在よりx分後
      case "min":
        expireTime += 60 * optExpire[term];
        break;
      // 現在よりx秒後
      case "sec":
        expireTime += optExpire[term];
      break;
      }
    }
    return key + "-" + expireTime;
  },
  setCache: function(key, content, expire) {
    if (typeof this.stack === "undefined") { this.stack = {}; }
    this.stack[this.createKey(key, expire)] = content;
  },
  getCache: function(keyName) {
    // keyのsuffixとしてUNIX TIMEが付与されている場合は分離する。
    var key, content, expireTime;
    var stack = this.stack;
    for (var keyWithExpire in stack) {
      // keyが先頭で一致した場合、keyとcontentを取り出す
      if (keyWithExpire.search(key) === 0) {
      // 期限付きの場合
      if (keyWithExpire.match(/^(.*?)-(\d{10})$/)) {
        key = RegExp.$1;
        expireTime = RegExp.$2;
        // 期限が切れていないかどうか
        if (expireTime >= this.getCurrentDate()) {
          content = stack[keyWithExpire];
        }
        // 期限切れの場合はキャッシュを消す
        else {
          delete this.stack[keyWithExpire];
        }
      }
      // 期限なしの場合
      else {
        key = keyWithExpire;
        content = stack[keyWithExpire];
      }
      break;
      }
    }
    return content;
  }
});

var Http = Module.create({
  xhr: function(url, params, opts, successCallback, errorCallback, startFunc, endFunc) {
  var caller = function(f) {
    if (typeof f === "function") {  
      f.call(this);
    }
  };

  var start = function() { caller(startFunc); },
      end = function() { caller(endFunc); },
      success = function(callback, response, args) {
        end();
        if (typeof callback === "function") {
          callback.call(this, response, args);
        }
        else {
          throw response;
        }
      },
      error = function(callback, response, args) {
        end();
        if (typeof callback === "function") {
          callback.call(this, response, args);
        }
        alert(response);
      };

  start();

  $.ajax({
    type: opts.type,
    dataType: opts.dataType,
    data: params,
    cache: true,
    url: url,
    success: function(data, dataType) {
      success(successCallback, data, opts.args);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      error(errorCallback, textStatus, opts.args);
    }
  });
});