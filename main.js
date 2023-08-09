const API_KEY = 'aa7693a2-d5af-4e7c-b7e1-d2450736091b';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1\n';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

getMovies(API_URL_POPULAR);

async function getMovies(url){
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
    });
    const responseData = await response.json();
    showMovies(responseData);
}

function getClassByRate(vote) {
    if (vote >= 7){
        return 'green';
    }else if (vote > 5){
        return 'orange';
    }else if (vote < 5){
        return 'red';
    } else {
    }
}
function showMovies(data) {
    const moviesElement = document.querySelector('.movies');
    document.querySelector('.movies').innerHTML = '';
    data.films.forEach(movie => {
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
            <div class="movie__category">${movie.genres.map((genre) => `${genre.genre}`)}</div>
            <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>
          </div>
        </div>
        `;
        moviesElement.appendChild(movieElement);
    })
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) =>{
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if (search.value){
        getMovies(apiSearchUrl);
        search.value = '';
    }
})