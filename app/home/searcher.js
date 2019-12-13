/* eslint-disable no-console */
//
// npm modules required
//
var searcher = require('vws-js-lib/lib/searcher')

// TODO: Distinguir entre peliculas y series
function loadAndRenderShowSearch(htmlElementID) {

    //document.getElementById("search-box").value = ''
    //document.getElementById("show-search-results").innerHTML = ''
    //
    // VER: https://developer.mozilla.org/es/docs/Web/HTML/Elemento/input/search
    //
    document.getElementById(htmlElementID).innerHTML =
        `<div class="show-searcher">
            <input type="search" id="search-box" name="q" 
                placeholder="Buscar películas o series. Mínimo 3 caracteres" 
                size="40" 
                minlength="3"/>
            <span class="validity"></span>
        </div>
        
        <div class="search-results">
            <p></p>
            <p>Películas</p>
            <div id="films-search-results">
            </div>
            <p>Series</p>
            <div id="tvshow-search-results">
            </div>
        </div>        
        `

    // Get the input field
    var input = document.getElementById("search-box");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault()
            // Trigger the button element with a click
            searchShows()
        }
    })
}



function searchShows() {
    const textSearch = document.getElementById("search-box").value

    if ((textSearch) && (textSearch.length > 2)) {
        document.getElementById("films-search-results").innerHTML = 'sdasd'
        document.getElementById("tvshow-search-results").innerHTML = 'asdasd'

        var modalWindow = showModalWindow(
            'Espere por favor..',
            `Buscando películas y series para '${textSearch}'`,
            '')

        return searcher.searchShows(textSearch, SEARCHER_MAX_RESULTS, searchResult => {
            //console.log(`onSearchResult !!  --> ${JSON.stringify(searchResult)}\n\n`)
            if (searchResult.type == 'film') {
                document.getElementById("films-search-results").innerHTML
                    += renderFilm(searchResult.show)
            } else if (searchResult.type == 'tvshowcollection') {
                document.getElementById("tvshow-search-results").innerHTML
                    += renderTVShow(searchResult.show)
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