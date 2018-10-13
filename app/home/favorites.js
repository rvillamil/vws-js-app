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


function loadAndRenderFavoritesTVShowCollection(htmlElementID) {
    document.getElementById(htmlElementID).innerHTML = "";
    var modalWindow = showModalWindow("Espere por favor..", "Cargando mis series favoritas ..", "")
    return crawlMyFavoritesTVShowCollection(CRAWL_TV_SHOWS_FAVORITES_LIMIT, htmlElementID).then(
        showCollectionList => {
            showCollectionList.forEach(newShowCollection => {

                // TODO: Aqui cargamos la coleccion y deberiamos de salvar la lista de ultimos episodios

                _updateShowCollectionWithNewShows(newShowCollection.shows)

                document.getElementById(htmlElementID).innerHTML += renderShowCollectionBox(newShowCollection);

            })
            closeModalWindow(modalWindow)
        }
    ).catch(err => {
        onLoadAndRenderShowsError(htmlElementID, modalWindow, err)
    });
}

// TODO: Llevar al repositorio...
function _updateShowCollectionWithNewShows(shows) {

    shows.forEach(newShow => {
        return favoriteRepository.findShowByURLtodownload(newShow.urltodownload).then(
            show => {
                if (show.urltodownload != null) {
                    console.log(`Ya existe el show '${newShow.toStringSimple()}'. No lo anidadimos`)
                } else {
                    console.log(`Tenemos que aniadir el show '${newShow.toStringSimple()}' a la coleccion ${newShowCollection.name}`)

                    favoriteRepository.updateCollectionWithNewShow(newShowCollection.name, newShow).then(
                        showCollectionUpdated => {
                            console.log(`showCollectionUpdated '${showCollectionUpdated.shows.length}'`)
                        }
                    )
                }
            }
        ).catch(err => {
            console.log(`ERROR! ${err}`)
        })
    })

    /*

    favoriteRepository.findByCollectionName(newShowCollection.name).then(
        showCollectionFound => {
            newShowCollection.shows.forEach(newShow => {

            })
            
            showCollectionFound.shows.forEach(showFound => {
                _updateShowCollectionWithAllreadyDownloaded(showFound, newShowCollection)
            })
            
        }
    )
    /*
    newShowCollection.shows.forEach(newShow => {
        if ((newShow.currentSession == show.currentSession) &&
            (newShow.currentEpisode == show.currentEpisode)) {
            newShow.allreadyDownloaded = true
            console.log("Existe...")
        }
    })
    return pp
    */
}

/*
function _updateShowCollectionWithAllreadyDownloaded(show, newShowCollection) {

    newShowCollection.shows.forEach(newShow => {
        if ((newShow.currentSession == show.currentSession) &&
            (newShow.currentEpisode == show.currentEpisode)) {
            newShow.allreadyDownloaded = true
            console.log("Existe...")
        }
    })

    consoleLogCollection(newShowCollection)
    //console.log(`RETORNO _updateShowCollectionWithAllreadyDownloaded: ${JSON.stringify(newShowCollection)}\n`)

}
*/

/*
function _updateShowCollecion(newShowCollection) {
    console.log(`_updateShowCollecion - Collection name '${newShowCollection.name}'`)

    // updating shows
    favoriteRepository.findByCollectionName(newShowCollection.name).then(
        showCollectionFound => {
            showCollectionFound.shows.forEach(showFound => {
                _updateShowCollectionWithAllreadyDownloaded(showFound, newShowCollection)
            })
        }
    )
    //console.log(`RETORNO _updateShowCollecion: ${JSON.stringify(newShowCollection)}\n`)


    // Replace...
    favoriteRepository.delete(newShowCollection.name).then(
        numRemoved => {
            console.log(`Collection name '${newShowCollection.name}' deleted!\n`)
        }
    ).catch(err => {
        console.error(err)
    })
    favoriteRepository.save(newShowCollection).then(
        showCollectionCreated => {
            console.log(`Collection name '${showCollectionCreated.name}' saved!\n`)
        }
    ).catch(err => {
        console.error(err)
    })

}
*/