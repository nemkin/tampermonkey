// ==UserScript==
// @name         Redirect Miro to Dashboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect Miro to dashboard
// @author       You
// @match        https://miro.com/
// @icon         https://miro.com/app/static/a2ec6e0776521a79.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace("https://miro.com/app/dashboard");
})();
