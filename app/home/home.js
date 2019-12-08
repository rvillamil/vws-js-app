/* eslint-disable no-console */
//
// npm modules required
//
var crawler = require('./vws-js-lib/lib/crawler')
var pkginfo = require('../package.json')

function getAppVersion() {
    // eslint-disable-next-line no-console
    console.log(
        `Obteniendo la version de la aplicacion del fichero package.json ${pkginfo.version}`
    )
    return pkginfo.version
}

// -------------------------------------------------------------------
/**
 * Init home
 */
function init() {
    // Title and version
    document.getElementById(
        'main-topbar'
    ).innerHTML = `<p>VWS: Video websites scraper ${getAppVersion()}</p>`

    //loadAndRenderShows(event, 'tvshows-content');
    //loadAndRenderShows(event, 'videopremieres-content');
    loadAndRenderShows(event, 'favorites-tvshows-content')
}

/**
 * Replace de tabcontent with name 'htmlElementID' with HTML show list
 *
 * @param evt : MouseEvent
 * @param htmlElementID: billboardfilms-content, videopremieres-content,... HTML element to replace
 */
function loadAndRenderShows(evt, htmlElementID) {
    console.log(`loadAndRenderShows - Loading content for '${htmlElementID}'`)

    var i, tabcontent, tablinks
    tabcontent = document.getElementsByClassName('main-content')
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none'
    }
    tablinks = document.getElementsByClassName('tablinks')
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '')
    }
    document.getElementById(htmlElementID).style.display = 'block'
    evt.currentTarget.className += ' active'

    if (htmlElementID == 'billboardfilms-content') {
        loadAndRenderBillBoards(htmlElementID)
    } else if (htmlElementID == 'videopremieres-content') {
        loadAndRenderVideoPremieres(htmlElementID)
    } else if (htmlElementID == 'tvshows-content') {
        loadAndRenderLatestTVShows(htmlElementID)
    } else if (htmlElementID == 'favorites-tvshows-content') {
        loadAndRenderFavoritesTVShowCollection(htmlElementID)
    } else {
        alert(`ERROR !! 'main-content' does not exists '${htmlElementID}'`)
    }
}

function loadAndRenderBillBoards(htmlElementID) {
    document.getElementById(htmlElementID).innerHTML = ''
    var modalWindow = showModalWindow(
        'Espere por favor..',
        'Obteniendo los estrenos de cine ..',
        ''
    )

    return crawler
        .crawlBillboardFilms(CRAWL_LIMIT, show => {
            //console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
            document.getElementById(htmlElementID).innerHTML += renderFilm(show)
        })
        .then(shows => {
            console.log(
                `loadAndRenderBillBoards - Billboardfilms length: ${shows.length}`
            )
            closeModalWindow(modalWindow)
        })
        .catch(err => {
            onLoadAndRenderShowsError(htmlElementID, modalWindow, err)
        })
}

function loadAndRenderVideoPremieres(htmlElementID) {
    document.getElementById(htmlElementID).innerHTML = ''
    var modalWindow = showModalWindow(
        'Espere por favor..',
        'Obteniendo los estrenos de Video ..',
        ''
    )
    return crawler
        .crawlVideoPremieres(CRAWL_LIMIT, show => {
            //console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
            document.getElementById(htmlElementID).innerHTML += renderFilm(show)
        })
        .then(shows => {
            console.log(
                `loadAndRenderVideoPremieres - VideoPremieres length: ${shows.length}`
            )
            closeModalWindow(modalWindow)
        })
        .catch(err => {
            onLoadAndRenderShowsError(htmlElementID, modalWindow, err)
        })
}

function loadAndRenderLatestTVShows(htmlElementID) {
    document.getElementById(htmlElementID).innerHTML = ''
    var modalWindow = showModalWindow(
        'Espere por favor..',
        'Obteniendo las ultimas series publicadas ..',
        ''
    )
    return crawler
        .crawlTVShowCollections(CRAWL_TV_SHOWS_LIMIT, show => {
            //console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
            document.getElementById(htmlElementID).innerHTML += renderTVShow(show)
        })
        .then(shows => {
            console.log(
                `loadAndRenderLatestTVShows - crawlTVShows length: ${shows.length}`
            )
            closeModalWindow(modalWindow)
        })
        .catch(err => {
            onLoadAndRenderShowsError(htmlElementID, modalWindow, err)
        })
}

/**
 * On error loading or rendering shows
 *
 * @param {*} htmlElementID htmlelement when error
 * @param {*} modalWindow current modal window
 * @param {*} err Error to log
 */
function onLoadAndRenderShowsError(htmlElementID, modalWindow, err) {
    console.error(
        `ERROR! - onLoadAndRenderShowsError (${htmlElementID}) : ${err}`
    )
    closeModalWindow(modalWindow)
    modalWindow = showModalWindow(
        'Error grave',
        'Reinicie la aplicacion. Compruebe en un navegador, que el portal www.tumejortorrent.com esta disponible',
        'OMG!'
    )
}

/**
 * Render 'about show' section
 *
 * @param title: The show title
 * @param year: The show year
 * @param description The show description (actor, length..)
 * @param sinopsis The show sinopsis
 */
function renderAboutShowSection(title, year, description, sinopsis) {
    document.getElementById('about-show-title').innerHTML =
        '<p>Titulo</p>' + title
    document.getElementById('about-show-year').innerHTML = '<p>Año</p>' + year
    document.getElementById('about-show-description').innerHTML =
        '<p>Descripcion</p>' + description
    document.getElementById('about-show-sinopsis').innerHTML =
        '<p>Sinopsis</p>' + sinopsis
}