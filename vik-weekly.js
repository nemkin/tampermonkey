// ==UserScript==
// @name         VIK Weekly Navigation + Bookmarklet
// @namespace    http://vik.bme.hu/
// @version      1.1
// @description  Add navigation arrows to move between VIK Weekly issues and a bookmarklet button for VIK Weekly link generator
// @author       YourName
// @match        https://vik.bme.hu/static/weekly_archives/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get current year and week from the URL
    const urlParts = window.location.pathname.split('/');
    let currentYear = parseInt(urlParts[3]);
    let currentWeek = parseInt(urlParts[4].match(/\d+/)[0]);

    // Create the left arrow element
    const leftArrow = document.createElement('div');
    leftArrow.innerHTML = '&lt;'; // "<" symbol
    leftArrow.style.position = 'fixed';
    leftArrow.style.top = '50%';
    leftArrow.style.left = '10px';
    leftArrow.style.fontSize = '2em';
    leftArrow.style.cursor = 'pointer';
    leftArrow.style.zIndex = '9999';
    document.body.appendChild(leftArrow);

    // Create the right arrow element
    const rightArrow = document.createElement('div');
    rightArrow.innerHTML = '&gt;'; // ">" symbol
    rightArrow.style.position = 'fixed';
    rightArrow.style.top = '50%';
    rightArrow.style.right = '10px';
    rightArrow.style.fontSize = '2em';
    rightArrow.style.cursor = 'pointer';
    rightArrow.style.zIndex = '9999';
    document.body.appendChild(rightArrow);

    // Function to update the URL
    function updateURL(year, week) {
        const newURL = `/static/weekly_archives/${year}/VIK_Weekly_${week}_het.htm`;
        window.location.href = newURL;
    }

    // Add click event for going to the previous issue (left arrow)
    leftArrow.addEventListener('click', () => {
        if (currentWeek === 1) {
            currentYear--;
            currentWeek = 52; // Assuming 52 weeks in the previous year
        } else {
            currentWeek--;
        }
        updateURL(currentYear, currentWeek);
    });

    // Add click event for going to the next issue (right arrow)
    rightArrow.addEventListener('click', () => {
        if (currentWeek === 52) {
            currentYear++;
            currentWeek = 1;
        } else {
            currentWeek++;
        }
        updateURL(currentYear, currentWeek);
    });

    // Create a bookmarklet button
    const bookmarkletButton = document.createElement('a');
    bookmarkletButton.innerHTML = 'Bookmarklet';
    bookmarkletButton.href = `javascript:(function() {
  var date = new Date();
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  var week1 = new Date(date.getFullYear(), 0, 4);
  var week = 1 + Math.round(((date - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  var year = date.getFullYear();
  var url = "https://vik.bme.hu/static/weekly_archives/" + year + "/VIK_Weekly_" + week + "_het.htm";
  window.location.href = url;
})();`;
    bookmarkletButton.style.position = 'fixed';
    bookmarkletButton.style.top = '10px';
    bookmarkletButton.style.right = '10px';
    bookmarkletButton.style.padding = '10px 15px';
    bookmarkletButton.style.backgroundColor = '#062A4C';
    bookmarkletButton.style.color = '#fff';
    bookmarkletButton.style.textDecoration = 'none';
    bookmarkletButton.style.borderRadius = '5px';
    bookmarkletButton.style.zIndex = '9999';
    bookmarkletButton.title = 'Vik Weekly Bookmarklet for the current week. Drag this to your bookmarks bar!';

    document.body.appendChild(bookmarkletButton);

})();
