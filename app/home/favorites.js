//
// npm modules required
//
var ShowCollection = require('vws-js-lib/lib/showCollection');
var crawler = require('vws-js-lib/lib/crawler');
var FavoriteRepository = require('vws-js-lib/lib/favoriteRepository');

// Global var ...ejem...
var favoriteRepository = new FavoriteRepository();

function renderFavoritesTVShowCollection(limit, htmlElementID) {
    // TODO
    // 1 - Cargamos los favoritos
    // 2 - _crawlCollectionTVShowsFromFavorites --> Buscamos los ultimos episodios de los favoritos
    // 3 - _render
    return favoriteRepository.findAll()
        .then(showCollectionList => {
            console.log(`Loading favorites: ${showCollectionList}\n`)
            return _crawlShowCollectionList(limit, showCollectionList)
        })
}

function saveFavoriteTVshow(collectionName) {

    //
    // OJO ...show  es un string no un object ..
    // OJO ...salvamos el show no la coleccion que no merece la pena
    //
    //  Salvamos un show seleccionado si no existe ya en la BB.DD...
    console.log(`Saving ${collectionName}'\n`)

    var showCollection = new ShowCollection()
    showCollection.name = collectionName

    return favoriteRepository.save(showCollection).then(
        newShowCollection => {
            console.log(`collectionName favorite saved succesfully: '${newShowCollection}'\n`)
        }
    );
}

// ----------------------------------------------------------------------------
// 
// Private functions : ¿Merece la pena una funcion con solo esto? --¿Llevar al crwaler?
//
function _crawlShowCollectionList(limit, showCollectionList) {

    var actions = showCollectionList.map(showCollection => {
        return crawler.crawlTVShowCollection(limit, showCollection.name)
    });

    return Promise.all(actions)
        .then(
            showCollectionList => {
                console.log(`showCollectionList is: ${JSON.stringify(showCollectionList)}\n`)
                return showCollectionList
            });
}