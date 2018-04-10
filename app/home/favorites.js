//
// npm modules required
//
var Show = require('vws-js-lib/lib/show');
var crawler = require('vws-js-lib/lib/crawler');
var FavoriteRepository = require('../model/favoriteRepository');

// Global var ...ejem...
var favoriteRepository = new FavoriteRepository();

function renderFavoritesTVShowCollection(limit, htmlElementID) {
    // TODO
    // 1 - Cargamos los favoritos
    // 2 - _crawlCollectionTVShowsFromFavorites --> Buscamos los ultimos episodios de los favoritos
    // 3 - _render
    return favoriteRepository.findAllFavoritesShows()
        .then(favoritesShows => {
            return _crawlCollectionTVShowsFromFavorites(limit, favoritesShows)
        })
}

function saveFavoriteTVshow(show) {
    //
    // OJO ...show  es un string no un object ..
    // OJO ...salamos el show no la coleccion que no merece la pena
    //
    console.log(`Saving favorite tvshow '${show}' ...`)
    //  Salvamos un show seleccionado si no existe ya en la BB.DD...
    return favoriteRepository.save(show).then(
        newShow => {
            console.log("Show saved succesfully ");
        }
    );
}

// ----------------------------------------------------------------------------
// 
// Private functions
//
function _crawlCollectionTVShowsFromFavorites(limit, shows) {

    var fnCrawlTVShowsCollection = function (limit, show) {
        return crawler.crawlTVShowCollection(limit, show)
    }

    var actions = shows.map(fnCrawlTVShowsCollection);
    return Promise.all(actions)
        .then(showsCollection => {
            // TODO Array de "showscollection"
        });
}





/*
        var show = new Show();
        show.title = 'A_test_title_save_1';
        show.year = '2018';

        var favoriteRepository = new FavoriteRepository();
        favoriteRepository.save(show).then(
            newShow => {
                console.log("Show: " + JSON.stringify(newShow));
            }
        );
        */