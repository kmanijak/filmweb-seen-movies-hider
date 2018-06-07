// ==UserScript==
// @name         Filmweb - seen movies hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide movies you've seen on Filmweb rankings
// @author       Karol Manijak & Justyna Sroka
// @match        http://www.filmweb.pl/ranking/*
// @grant GM_addStyle
// ==/UserScript==

GM_addStyle(
    `.hide-button {
        margin-top: 14px;
        border: 1px solid #eab30b;
        padding: 4px 12px;
    }`
);

(function() {
    'use strict';
    let moviesHidden = false;
    let movies = null;

    const buttonTextHide = 'Ukryj obejrzane 🙈';
    const buttonTextShow = 'Pokaż obejrzane 🐵';

    const hideButton = document.createElement('button');
    hideButton.className = 'hide-button';
    hideButton.innerHTML = buttonTextHide;
    hideButton.type = 'button';

    const addToDOM = (target, element) => {
        target.appendChild(element);
    }

    const getSeenMovies = () => {
        if (!movies) {
            movies = document.querySelectorAll('.item.place');
        }

        return Array.prototype.filter.call(movies, movie => (
            movie.querySelector('.filmPoster__ribbon').querySelector('strong')
        ))
    };

    const changeMoviesDisplay = (display) => {
        const seenMovies = getSeenMovies();
        Array.prototype.map.call(getSeenMovies(), movie => {
            movie.style.display = display;
        })
    }

    const changeButtonText = (text) => {
        hideButton.innerHTML = text;
    }

    const toggleMovies = () => {
        if (moviesHidden) {
            changeMoviesDisplay('flex');
            changeButtonText(buttonTextHide);
            moviesHidden = false;
        } else {
            changeMoviesDisplay('none');
            changeButtonText(buttonTextShow);
            moviesHidden = true;
        }
    }

    const addHideButton = () => {
        const nextLine = document.createElement('br');
        hideButton.onclick = toggleMovies;

        const anchorPlace = document.querySelector('.ranking__user-see-info');

        addToDOM(anchorPlace, nextLine);
        addToDOM(anchorPlace, hideButton);
    }

    const addPercentage = () => {
        const paragraph = document.createElement('strong');
        const anchorPlace = document.querySelector('.amount');
        const seenMovies = Number(anchorPlace.innerHTML);
        const percentage = seenMovies / 500 * 100;
        paragraph.innerHTML = ` (${Math.round(percentage * 10) / 10}%)`;

        addToDOM(anchorPlace, paragraph);
    }

    addPercentage();
    addHideButton();
})();
