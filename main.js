document.addEventListener('DOMContentLoaded', () => {
    // const API_KEY = '97c71b3b-2526-4932-a8a1-413d6aecee86';
    // const API_KEY = 'aa7693a2-d5af-4e7c-b7e1-d2450736091b';
    const API_KEY = 'd54208c5-9ec7-4274-92d4-aabbdd4d8580';
    const API_URL_PREMIERES = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2023&month=AUGUST';
    const API_URL_EXPECTED = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2023&month=SEPTEMBER';
    const API_URL_TOP_RATED = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
    const API_URL_DIGITAL_RELEASES = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/releases?year=2023&month=JULY&page=1';

    getMovies(API_URL_PREMIERES, 'premieres');
    getMovies(API_URL_EXPECTED, 'expected');
    getMovies(API_URL_TOP_RATED, 'topRated');
    getMovies(API_URL_DIGITAL_RELEASES, 'digitalReleases');

    async function getMovies(url, sectionId) {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY,
            },
        });
        const responseData = await response.json();
        showMovies(responseData, sectionId);
              updateAllIconsColor();
    }

    function getClassByRate(vote) {
        if (vote >= 7) {
            return 'green';
        } else if (vote > 5) {
            return 'orange';
        } else {
            return 'red';
        }
    }

    function showMovies(data, sectionId) {
        const sectionElement = document.getElementById(sectionId);
        const moviesElement = document.createElement('div');
        moviesElement.classList.add('movies');

        const dataTypes = ['items', 'films', 'releases'];

        dataTypes.forEach(dataType => {
            if (data[dataType]) {
                data[dataType].slice(0, 12).forEach(movie => {
                    const movieElement = document.createElement('div');
                    movieElement.classList.add('movie');
                    movieElement.innerHTML = `
                        <div class="movie">
                            <div class="movie__cover-inner">
                                <img class="movie__cover" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                                <div class="movie__cover--darkened"></div>
                            </div>
                            <div class="movie__info">
                                <div class="movie__title">${movie.nameRu}</div>
                                <div class="movie__category">${movie.genres.map(genre => genre.genre).slice(0, 3)}</div>
                                ${movie.rating != null ? `<div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating.toString().substr(0, 3)}</div>` : ''}
                                <button class="favorite-icon"  data-movie='${JSON.stringify(movie)}' >
                                   <img class="icon" src="./img/favourite2.png" alt="">
                                </button>

                            </div>
                        </div>
                    `;
                    moviesElement.appendChild(movieElement);
                });
            }
        });
        sectionElement.appendChild(moviesElement);
    }
    const moviesContainers = document.querySelectorAll('.movies');
    moviesContainers.forEach(container => {
        container.addEventListener('click', function(event) {
            if (event.target.classList.contains('icon')) {
                const icon = event.target;
                const movieElement = icon.closest('.movie');
                const movieDataString = movieElement.querySelector('.favorite-icon').getAttribute('data-movie');

                if (movieDataString) {
                    const movieData = JSON.parse(movieDataString);
                    toggleAndStoreFavorite(movieData);
                    updateIconColor(icon, movieData);
                }
            }
        });
    });
    function toggleAndStoreFavorite(movie) {
        const favorites = getFavorites();
        const movieIndex = favorites.findIndex(item => item.nameRu === movie.nameRu);

        if (movieIndex !== -1) {
            favorites.splice(movieIndex, 1);
        } else {
            favorites.push(movie);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateAllIconsColor();
    }
    function getFavorites() {
        const favoritesJSON = localStorage.getItem('favorites');
        return favoritesJSON ? JSON.parse(favoritesJSON) : [];
    }

    function updateIconColor(icon, movieData) {
        const favorites = getFavorites();
        const isFavorite = favorites.some(favorite => favorite.nameRu === movieData.nameRu);

        if (isFavorite) {
            icon.style.backgroundColor = 'red';
        } else {
            icon.style.backgroundColor = 'white';
        }
    }

    function updateAllIconsColor() {
        const allIcons = document.querySelectorAll('.icon');
        const favorites = getFavorites();

        allIcons.forEach(icon => {
            const movieDataString = icon.parentNode.dataset.movie;

            if (movieDataString) {
                const movieData = JSON.parse(movieDataString);
                const iconElement = icon;

                if (favorites.some(favorite => favorite.nameRu === movieData.nameRu)) {
                    iconElement.style.backgroundColor = 'red';
                } else {
                    iconElement.style.backgroundColor = 'white';
                }
            }
        });
    }
    updateAllIconsColor();

    const favoriteButtons = document.querySelectorAll('.favorite-icon');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const icon = event.target;
            const movieElement = icon.closest('.movie');
            const movieDataString = movieElement.dataset.movie;

            if (movieDataString) {
                const movieData = JSON.parse(movieDataString);
                toggleAndStoreFavorite(movieData);
                const iconElement = icon;
                updateIconColor(iconElement, movieData);

                updateAllIconsColor();
            }
        });
    });
    function showFavorites() {
        const favoritesContainer = document.getElementById('favorites');
        if (!favoritesContainer) {
            return;
        }
        const favorites = getFavorites();

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p class="not-favorite">У вас пока нет избранных фильмов. Для добавления фильма, перейдите на страницу \<a href="index.html" class="header__logo">Movie App</a>\</p>'
            return;
        }
        favoritesContainer.innerHTML = '';

        favorites.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <div class="movie__cover-inner">
                    <img class="movie__cover" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                    <div class="movie__cover--darkened"></div>
                </div>
                <div class="movie__info">
                    <div class="movie__title">${movie.nameRu}</div>
                    <div class="movie__category">${movie.genres.map(genre => genre.genre).slice(0, 3)}</div>
                    ${movie.rating != null ? `<div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating.toString().substr(0, 3)}</div>` : ''}
                    <button class="favorite-icon" data-movie='${JSON.stringify(movie)}'>
                        <img class="icon" src="./img/favourite2.png" alt="" style="background-color: red">
                    </button>
                </div>
            `;
            favoritesContainer.appendChild(movieElement);
        });
    }
    showFavorites();
});






