// ==UserScript==
// @name         Redirect Codeforces Problemset to Contest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects Codeforces problemset URLs to corresponding contest URLs.
// @author       You
// @match        https://codeforces.com/problemset/problem/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = window.location.href;
    const problemsetPattern = /https:\/\/codeforces\.com\/problemset\/problem\/([^/]+)\/([^/]+)/;
    const match = currentUrl.match(problemsetPattern);
    if (match) {
        const newUrl = `https://codeforces.com/contest/${match[1]}/problem/${match[2]}`;
        // console.log(newUrl);
        window.location.replace(newUrl);
    }
})();
