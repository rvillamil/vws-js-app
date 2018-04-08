//
// npm modules required
//
var Show = require('vws-js-lib/lib/show');
var crawler = require('vws-js-lib/lib/crawler');


function loadAndRenderFavoritesTVshows(CRAWL_TV_SHOWS_FAVORITES_LIMIT, htmlElementID) {
    // 1 cargamos mis favoritos de la BBDD
    favoritesList = ['erase-una-vez/1490']

    // 2 Cargamos mis favoritos y los pintamos
    crawler.crawlMyFavoritesTVShows(CRAWL_TV_SHOWS_FAVORITES_LIMIT,
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