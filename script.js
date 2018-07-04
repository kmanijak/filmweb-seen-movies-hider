// ==UserScript==
// @name         Filmweb - seen movies hider
// @namespace    https://github.com/kmanijak/filmweb-seen-movies-hider
// @version      0.4
// @updateURL    https://raw.githubusercontent.com/kmanijak/filmweb-seen-movies-hider/master/script.js
// @description  Hide movies you've seen on Filmweb rankings
// @author       Karol Manijak & Justyna Sroka
// @match        https://www.filmweb.pl/ranking/*
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
    let firstUsage = true;
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
            window.getComputedStyle(movie.querySelector('.ifw-flag')).color === 'rgb(255, 194, 0)'
        ))
    };

    const getNotSeenMovies = () => {
        if (!movies) {
            movies = document.querySelectorAll('.item.place');
        }

        return Array.prototype.filter.call(movies, movie => (
            window.getComputedStyle(movie.querySelector('.ifw-flag')).color !== 'rgb(255, 194, 0)'
        ))
    };

    const changeMoviesDisplay = (display) => {
        const seenMovies = getSeenMovies();

        Array.prototype.map.call(seenMovies, movie => {
            movie.style.display = display;
        });

        if (firstUsage) {
            const notSeenMovies = getNotSeenMovies();
            Array.prototype.map.call(notSeenMovies, movie => {
                const poster = movie.querySelector('.filmPoster__image');
                const src = poster.getAttribute('data-src');
                if (src) {
                    poster.setAttribute('src', src);
                }
            });
            firstUsage = false;
        }
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
        const allMovies = Number(document.querySelector('.ranking__user-see-info').childNodes[3].textContent.split(' ')[2])
        const percentage = seenMovies / allMovies * 100;
        paragraph.innerHTML = ` (${Math.round(percentage * 10) / 10}%)`;

        addToDOM(anchorPlace, paragraph);
    }

    addPercentage();
    addHideButton();
})();
