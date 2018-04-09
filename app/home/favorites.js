//
// npm modules required
//
var Show = require('vws-js-lib/lib/show');
var crawler = require('vws-js-lib/lib/crawler');
var FavoriteRepository = require('../model/favoriteRepository');

function loadFavoritesTVShows() {
    // TODO ...
    // 1 cargamos mis favoritos de la BBDD y recuperamos sus ultimos shows

    //favoritesTVShows = ['erase-una-vez/1490']
    //favoritesTVShows = ['erase-una-vez/1490']
    var favoriteRepository = new FavoriteRepository();

    return favoriteRepository.findAllFavoritesShows()
        .then(shows => {
            return shows
        })
        .catch(err => {
            console.error('ERROR! - loadFavoritesTVShows - Error on loading favorites:' + err);
        })
}

function saveFavoriteTVshow(show) {
    //
    // OJO ...show  es un string no un object ..
    //
    console.log(`Saving favorite tvshow '${show}' ...`)
    //  Salvamos un show seleccionado si no existe ya en la BB.DD...
    var favoriteRepository = new FavoriteRepository();

    return favoriteRepository.save(show).then(
        newShow => {
            console.log("Show saved succesfully ");
        }
    );
}

function renderFavoritesTVshows(favoritesList, limit, htmlElementID) {
    /*
    crawler.crawlMyFavoritesTVShows(
            limit,
            favoritesList,
            show => {
                console.log(`crawlMyFavoritesTVShows - Favorite Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
                //document.getElementById(htmlElementID).innerHTML += renderShowBox(show)  // htmlElementID =='tvshows-favorites-content'
            })
        .then(
            urlList => {
                console.log(`loadAndRenderFavoritesTVshows - favorites length: ${favoritesList.length}`)
            }
        ).catch(err => {
            console.error(`ERROR! - loadAndRenderFavoritesTVshows: '${err}'`)
        });
        */
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