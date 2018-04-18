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
            console.log(`Loading my favorites: ${JSON.stringify(showCollectionFavoriteList)}\n`)
            return crawler.crawlTVShowCollections(limit, showCollectionFavoriteList)
        })
}

function saveFavoriteTVshow(collectionName) {

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

function deleteFavoriteTVshow(collectionName) {

    var txt;
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


function loadAndRenderFavoritesTVShowCollection(htmlElementID) {
    document.getElementById(htmlElementID).innerHTML = "";
    var modalWindow = showModalWindow("Espere por favor..", "Cargando mis series favoritas ..", "")
    return crawlMyFavoritesTVShowCollection(CRAWL_TV_SHOWS_FAVORITES_LIMIT, htmlElementID).then(
        showCollectionList => {
            showCollectionList.forEach(function (showCollection) {
                document.getElementById(htmlElementID).innerHTML += renderShowCollectionBox(showCollection);
            })
            closeModalWindow(modalWindow)
        }
    ).catch(err => {
        onLoadAndRenderShowsError(htmlElementID, modalWindow, err)
    });
}