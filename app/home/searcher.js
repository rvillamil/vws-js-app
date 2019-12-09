/* eslint-disable no-console */
//
// npm modules required
//
var searcher = require('vws-js-lib/lib/searcher')

// TODO: Poner mas bonito el buscador y distinguir entre peliculas y series
function loadAndRenderShowSearch(htmlElementID) {

    //document.getElementById("search-box").value = ''
    //document.getElementById("show-search-results").innerHTML = ''
    //
    // VER: https://developer.mozilla.org/es/docs/Web/HTML/Elemento/input/search
    //
    document.getElementById(htmlElementID).innerHTML =
        `<div class="show-searcher">
            <input type="search" id="search-box" name="q" placeholder="Buscar películas o series ..." />
            <button id='search-button' onclick="searchShows()">Buscar</button>
        </div>
        <div id="show-search-results">
        </div>
        `
}

function searchShows() {
    const textSearch = document.getElementById("search-box").value

    if (textSearch) {
        document.getElementById("show-search-results").innerHTML = ''

        var modalWindow = showModalWindow(
            'Espere por favor..',
            'Buscando películas y series ...',
            ''
        )

        return searcher.searchShows(textSearch, SEARCHER_MAX_RESULTS, searchResult => {
            //console.log(`onSearchResult !!  --> ${JSON.stringify(searchResult)}\n\n`)
            if (searchResult.type == 'film') {
                document.getElementById("show-search-results").innerHTML += renderFilm(searchResult.show)
            } else if (searchResult.type == 'tvshowcollection') {
                document.getElementById("show-search-results").innerHTML += renderTVShow(searchResult.show)
            } else {
                console.log('No deberia de pasar por aqui')
            }
        }).then(searchShows => {
            console.log(
                `searcher.js - searchShows - results found: ${searchShows.length}`
            )
            closeModalWindow(modalWindow)
        }).catch(err => {
            onLoadAndRenderShowsError("searching-shows-content", modalWindow, err)
        })
    }
}