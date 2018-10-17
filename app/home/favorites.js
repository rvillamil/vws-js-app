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
                    return favoriteRepository.updateCollectionWithNewShows(
                            showCollectionCrawled.name,
                            showCollectionCrawled.shows
                        ).then(numReplaced => {
                            console.log(`New '${numReplaced}' episodes for ${showCollectionCrawled.name}`)
                        })
                        .catch(err => {
                            console.log(`ERROR! - crawlMyFavoritesTVShowCollection - ${err}`)
                        })
                })

            return Promise.all(actions)
                .then(
                    _refreshFromPersistence(htmlElementID).then(closeModalWindow(modalWindow))
                )
                .catch(err => {
                    console.log(`ERROR! - crawlMyFavoritesTVShowCollection - ${err}`)
                })
        }
    ).catch(err => {
        onLoadAndRenderShowsError(htmlElementID, modalWindow, err)
    });
}


function _refreshFromPersistence(htmlElementID) {

    return favoriteRepository.findAll(CRAWL_TV_SHOWS_FAVORITES_LIMIT).then(
        docWithshowCollectionList => {
            docWithshowCollectionList.forEach(newDocWithShowCollection => {
                console.log(`RENDER: ${JSON.stringify (newDocWithShowCollection)}`)
                document.getElementById(htmlElementID).innerHTML += renderShowCollectionBox(newDocWithShowCollection);
            })
        })
}