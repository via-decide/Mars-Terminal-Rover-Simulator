(function (global) {
  'use strict';

  var JWT_STORAGE_KEY = 'via_passport_jwt';
  var PASSPORT_BASE_URL = global.VIA_PASSPORT_BASE_URL || 'https://passport.via-dev.tools';

  function getReturnUrl() {
    return global.location ? global.location.href : '';
  }

  function parseJwt(token) {
    try {
      var payload = token.split('.')[1];
      if (!payload) return null;
      var normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      var decoded = global.atob(normalized);
      return JSON.parse(decoded);
    } catch (err) {
      return null;
    }
  }

  function login(context) {
    var returnUrl = encodeURIComponent(getReturnUrl());
    var role = encodeURIComponent(context && context.role ? context.role : 'player');
    var target = PASSPORT_BASE_URL + '/login?return_url=' + returnUrl + '&context=' + role;
    if (global.location) global.location.assign(target);
  }

  function verifySession() {
    var token = null;
    try {
      token = global.localStorage.getItem(JWT_STORAGE_KEY);
    } catch (err) {
      token = null;
    }

    if (!token) return { valid: false, token: null, uid: null };

    var payload = parseJwt(token) || {};
    var now = Math.floor(Date.now() / 1000);
    var isExpired = payload.exp ? payload.exp <= now : false;
    var uid = payload.uid || payload.sub || null;

    if (isExpired) {
      logout(false);
      return { valid: false, token: null, uid: null };
    }

    return { valid: true, token: token, uid: uid };
  }

  function logout(redirectToLogin) {
    try {
      global.localStorage.removeItem(JWT_STORAGE_KEY);
    } catch (err) {
      // no-op
    }

    if (redirectToLogin !== false) login({ role: 'logout' });
  }

  global.PassportClient = {
    login: login,
    verifySession: verifySession,
    logout: logout
  };
})(window);
