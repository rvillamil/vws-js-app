//
// npm modules required
//
var ShowCollection = require('vws-js-lib/lib/showCollection');
var crawler = require('vws-js-lib/lib/crawler');
var FavoriteRepository = require('vws-js-lib/lib/favoriteRepository');
const path = require('path');
const electron = require('electron');

//
// Constants
//
// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
// app.getPath('userData') will return a string of the user's app data directory path.
const userDataPath = (electron.app || electron.remote.app).getPath('userData');

//
// Global var
//
var favoriteRepository = new FavoriteRepository(path.join(userDataPath, 'vws-db'));

//
// Functions
//
function crawlMyFavoritesTVShowCollection(limit, htmlElementID) {

    return favoriteRepository.findAll()
        .then(showCollectionFavoriteList => {
            //console.log(`Loading my favorites: ${JSON.stringify(showCollectionFavoriteList)}\n`)
            return crawler.crawlTVShowCollections(limit, showCollectionFavoriteList)
        })
}

function saveFavoriteTVshow(collectionName) {

    var r = confirm(`¿Quieres añadir la serie '${collectionName}' a tus favoritos?!`);
    if (r == true) {

        var showCollection = new ShowCollection()
        showCollection.name = collectionName

        return favoriteRepository.save(showCollection).then(
            newShowCollection => {
                console.log(`ShowCollection object saved!: ${JSON.stringify(newShowCollection)}\n`)
            }
        ).catch(err => {
            console.error(err)
        })
    }
}

function deleteFavoriteTVshow(collectionName) {

    var r = confirm(`¿Quieres eliminar la serie '${collectionName}' de tus favoritos?!`);
    if (r == true) {
        return favoriteRepository.delete(collectionName).then(
            numRemoved => {
                console.log(`Collection name '${collectionName}' deleted!\n`)
                loadAndRenderFavoritesTVShowCollection("favorites-tvshows-content")
            }
        ).catch(err => {
            console.error(err)
        })
    }
}

function onclickToDownloadFile(urltodownload) {
    console.log(`favorites - onclickToDownloadFile: ${urltodownload}`)

    favoriteRepository.updateAllreadyDownloadedShowByURL(urltodownload, true).then(numReplaced => {
        console.log(`The episode with url '${urltodownload}' has been replaced '${numReplaced}' times`)
    })
}

function loadAndRenderFavoritesTVShowCollection(htmlElementID) {
    document.getElementById(htmlElementID).innerHTML = "";
    var modalWindow = showModalWindow("Espere por favor..", "Cargando mis series favoritas ..", "")

    return crawlMyFavoritesTVShowCollection(CRAWL_TV_SHOWS_FAVORITES_LIMIT, htmlElementID).then(

        showCollectionListCrawled => {

            var actions = showCollectionListCrawled.map(

                showCollectionCrawled => {
                    // Actualizamos la coleccion de nombre showCollectionCrawled.name con los shows de la coleccion showCollectionCrawled.shows
                    return favoriteRepository.mergeShowCollections(
                            showCollectionCrawled,
                            showCollectionCrawled.name
                        ).then(numReplaced => {
                            console.log(`New episodes for ${showCollectionCrawled.name}`)

                            return numReplaced
                        })
                        .catch(err => {
                            console.log(`ERROR! - crawlMyFavoritesTVShowCollection - ${err}`)
                        })
                })

            return Promise.all(actions)
                .then(numReplaced => {
                    _refreshFromPersistence(htmlElementID).then(
                        fullHTML => {
                            document.getElementById(htmlElementID).innerHTML = fullHTML
                            console.log("** End refresh favorites tv shows!")
                            closeModalWindow(modalWindow)
                            if (fullHTML.length == 0) {
                                showModalWindow(
                                    "No hay series favoritas!",
                                    "Vete a la sección de series y selecciona las que mas te gusten, haciendo doble click sobre la portada",
                                    "")
                            }

                        }
                    )
                })
                .catch(err => {
                    console.log(`ERROR! - crawlMyFavoritesTVShowCollection - ${err}`)
                })
        }
    ).catch(err => {
        onLoadAndRenderShowsError(htmlElementID, modalWindow, err)
    });
}


function _refreshFromPersistence(htmlElementID) {

    return favoriteRepository.findAll().then(

        docWithshowCollectionList => {

            var actions = docWithshowCollectionList.map(
                newDocWithShowCollection => {
                    return renderShowCollectionBox(newDocWithShowCollection, CRAWL_TV_SHOWS_FAVORITES_LIMIT)
                })

            return Promise.all(actions)
                .then(showCollectionListHTML => {
                    console.log(`Tienes ${showCollectionListHTML.length} series favoritas`)
                    return showCollectionListHTML // Realmente es un array de elementos <div> separados por coma. Si te fijas, se ve la coma al mostrar los favoritos
                })
                .catch(err => {
                    console.log(`ERROR! - _refreshFromPersistence - ${err}`)
                })
        })

}