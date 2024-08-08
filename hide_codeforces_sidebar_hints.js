// ==UserScript==
// @name         Hide Codeforces hints
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the sidebar on Codeforces task descriptions.
// @author       You
// @match        https://codeforces.com/contest/*/problem/*
// @match        https://codeforces.com/problemset/problem/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
     const sidebar = document.getElementById("sidebar");
     sidebar.remove();
     const content = document.getElementById("pageContent");
     content.classList.remove("content-with-sidebar");
     const body = document.getElementById("body");
     body.style.minWidth = "480px";
})();
