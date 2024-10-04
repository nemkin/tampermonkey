// ==UserScript==
// @name         VIK Weekly Navigation + Bookmarklet + Existing Weeks (Years from 2020 with Persistent Cache)
// @namespace    http://vik.bme.hu/
// @version      1.9
// @description  Add navigation arrows to move between VIK Weekly issues, a bookmarklet button for VIK Weekly link generator, and a list of existing weeks from 2020 in a flexbox with persistent URL caching (using localStorage)
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

    // Get the current system year and week (to avoid checking future weeks)
    const today = new Date();
    const currentSystemYear = today.getFullYear();
    const currentSystemWeek = getWeekNumber(today);

    // Helper function to calculate the ISO week number
    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    // Initialize the cache to store the existence of URLs (true = exists, false = does not exist) using localStorage
    let urlCache = JSON.parse(localStorage.getItem('vikUrlCache')) || {};

    // Save cache to localStorage
    function saveCache() {
        localStorage.setItem('vikUrlCache', JSON.stringify(urlCache));
    }

    // Apply CSS to shift the main content to the left, leaving room for the sidebar
    document.body.style.marginRight = '300px'; // Reserve space for the right sidebar
    document.body.style.padding = '20px';

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
    rightArrow.style.right = '330px'; // Adjust to align with the right sidebar
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
    bookmarkletButton.innerHTML = 'Current Week\n(Bookmarklet)';
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

    // Function to check if a URL exists (cached for both existing and non-existing)
    async function checkUrlExists(url) {
        // Check cache first (either true or false)
        if (urlCache[url] !== undefined) {
            return urlCache[url];
        }

        // If not in cache, check the URL with a HEAD request
        try {
            let response = await fetch(url, { method: 'HEAD' });
            urlCache[url] = response.ok; // Cache true if exists, false if not
            saveCache(); // Save updated cache
            return response.ok;
        } catch (error) {
            console.log('Error checking URL: ' + url, error);
            urlCache[url] = false; // Cache as false if there's an error
            saveCache(); // Save updated cache
            return false;
        }
    }

    // Function to generate weekly URLs for each year starting from 2020
    function generateWeeklyUrls(year) {
        let urls = [];
        const maxWeek = (year === currentSystemYear) ? currentSystemWeek : 52; // Only check up to current week in the current year
        for (let week = 1; week <= maxWeek; week++) {
            let paddedWeek = week.toString().padStart(2, '0'); // Pad week numbers
            let url = `https://vik.bme.hu/static/weekly_archives/${year}/VIK_Weekly_${paddedWeek}_het.htm`;
            urls.push({ week: paddedWeek, url: url });
        }
        return urls;
    }

    // Function to display existing weeks for each year from 2020 to current year
    async function displayExistingWeeks() {
        const existingWeeksContainer = document.createElement('div');
        existingWeeksContainer.style.position = 'fixed';
        existingWeeksContainer.style.top = '50px';
        existingWeeksContainer.style.right = '0px';
        existingWeeksContainer.style.width = '300px';
        existingWeeksContainer.style.backgroundColor = '#f9f9f9';
        existingWeeksContainer.style.padding = '10px';
        existingWeeksContainer.style.borderLeft = '2px solid #ccc';
        existingWeeksContainer.style.borderRadius = '0px';
        existingWeeksContainer.style.zIndex = '9999';
        existingWeeksContainer.style.maxHeight = '90%';
        existingWeeksContainer.style.overflowY = 'auto';
        existingWeeksContainer.style.display = 'flex';
        existingWeeksContainer.style.flexWrap = 'wrap';
        existingWeeksContainer.style.justifyContent = 'space-around';

        // Loop through each year starting from 2020
        for (let year = 2020; year <= currentSystemYear; year++) {
            const header = document.createElement('h4');
            header.innerText = `Weeks of ${year}`;
            header.style.width = '100%'; // Ensures header takes the full width
            header.style.margin = '0 0 10px 0';
            existingWeeksContainer.appendChild(header);

            const urls = generateWeeklyUrls(year);
            for (let urlObj of urls) {
                let exists = await checkUrlExists(urlObj.url);
                if (exists) {
                    const weekLink = document.createElement('a');
                    weekLink.href = urlObj.url;
                    weekLink.innerText = urlObj.week; // Display just the number
                    weekLink.style.display = 'block';
                    weekLink.style.margin = '5px';
                    weekLink.style.padding = '10px';
                    weekLink.style.width = '40px';
                    weekLink.style.textAlign = 'center';
                    weekLink.style.backgroundColor = '#e0e0e0';
                    weekLink.style.border = '1px solid #ccc';
                    weekLink.style.borderRadius = '5px';
                    existingWeeksContainer.appendChild(weekLink);
                }
            }
        }

        document.body.appendChild(existingWeeksContainer);
    }

    // Display existing weeks for all years starting from 2020
    displayExistingWeeks();

})();
