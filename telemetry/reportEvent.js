(function (global) {
  'use strict';

  var PASSPORT_BASE_URL = global.VIA_PASSPORT_BASE_URL || 'https://passport.via-dev.tools';
  var TELEMETRY_ENDPOINT = PASSPORT_BASE_URL + '/api/telemetry/events';

  function reportEvent(eventName, payload) {
    if (!eventName) return Promise.resolve(false);

    var session = global.PassportClient && global.PassportClient.verifySession
      ? global.PassportClient.verifySession()
      : { valid: false };

    if (!session.valid || !session.token) return Promise.resolve(false);

    var eventPayload = Object.assign({
      event: eventName,
      uid: session.uid || null,
      game: 'mars_terminal',
      ts: new Date().toISOString()
    }, payload || {});

    return fetch(TELEMETRY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + session.token
      },
      body: JSON.stringify(eventPayload),
      keepalive: true
    }).then(function (res) {
      return res.ok;
    }).catch(function () {
      return false;
    });
  }

  global.reportPassportEvent = reportEvent;
})(window);
