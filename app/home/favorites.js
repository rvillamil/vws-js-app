//
// npm modules required
//
var ShowCollection = require('vws-js-lib/lib/showCollection');
var crawler = require('vws-js-lib/lib/crawler');
var FavoriteRepository = require('vws-js-lib/lib/favoriteRepository');

//
// Global var
//
var favoriteRepository = new FavoriteRepository();

//
// Functions
//
function renderFavoritesTVShowCollection(limit, htmlElementID) {

    return favoriteRepository.findAll()
        .then(showCollectionFavoriteList => {
            console.log(`Loading my favorites: ${JSON.stringify(showCollectionFavoriteList)}\n`)
            return crawler.crawlTVShowCollections(limit, showCollectionFavoriteList)
        })
}

function saveFavoriteTVshow(collectionName) {

    var showCollection = new ShowCollection()
    showCollection.name = collectionName

    return favoriteRepository.save(showCollection).then(
        newShowCollection => {
            console.log(`Saving showColection: ${JSON.stringify(newShowCollection)}\n`)
        }
    );
}