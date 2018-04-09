const CRAWL_LIMIT = 20; // Number of shows to crawl
const CRAWL_TV_SHOWS_LIMIT = 20; // Number of TVshows to crawl
const CRAWL_TV_SHOWS_FAVORITES_LIMIT = 4; // Number of links with the latest episodes for each favorite show

//
// npm modules required
//
var Show = require('vws-js-lib/lib/show');
var crawler = require('vws-js-lib/lib/crawler');

// -------------------------------------------------------------------
/**
 * Init home
 */
function loadContent() {
    renderShows(event, 'favorites-tvshows-content');
}

/**
 * Replace de tabcontent with name 'htmlElementID' with HTML show list
 *
 * @param evt : MouseEvent
 * @param htmlElementID: billboardfilms-content, videopremieres-content,... HTML element to replace
 */
function renderShows(evt, htmlElementID) {
    console.log(`getShows - Loading content .. ${htmlElementID}`);
    document.getElementById(htmlElementID).innerHTML = "";

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("main-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(htmlElementID).style.display = "block";
    evt.currentTarget.className += " active";
    var modalWindow = null;

    if (htmlElementID == "billboardfilms-content") {
        modalWindow = showModalWindow("Espere por favor..", "Obteniendo los estrenos de cine ..", "");

        crawler.crawlBillboardFilms(
                CRAWL_LIMIT,
                show => {
                    //console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
                    document.getElementById(htmlElementID).innerHTML += renderShowBox(show)
                })
            .then(
                shows => {
                    console.log(`crawler - Billboardfilms length: ${shows.length}`)
                    closeModalWindow(modalWindow)
                }
            ).catch(err => {
                getErrorHandle(htmlElementID, modalWindow, err)
            });


    } else if (htmlElementID == "videopremieres-content") {
        modalWindow = showModalWindow("Espere por favor..", "Obteniendo los estrenos de Video ..", "");

        crawler.crawlVideoPremieres(
                CRAWL_LIMIT,
                show => {
                    //console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
                    document.getElementById(htmlElementID).innerHTML += renderShowBox(show);
                })
            .then(
                shows => {
                    console.log(`crawler - VideoPremieres length: ${shows.length}`);
                    closeModalWindow(modalWindow);
                }
            ).catch(err => {
                getErrorHandle(htmlElementID, modalWindow, err)
            });

    } else if (htmlElementID == "tvshows-content") {
        modalWindow = showModalWindow("Espere por favor..", "Obteniendo las ultimas series publicadas ..", "");
        // Latest shows published
        crawler.crawlTVShows(
                CRAWL_TV_SHOWS_LIMIT,
                show => {
                    //console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
                    document.getElementById('tvshows-latest-content').innerHTML += renderShowBox(show);
                })
            .then(
                shows => {
                    console.log(`crawler - crawlTVShows length: ${shows.length}`);
                    closeModalWindow(modalWindow);
                }
            ).catch(err => {
                getErrorHandle('tvshows-latest-content', modalWindow, err)
            });

    } else if (htmlElementID == "favorites-tvshows-content") {
        modalWindow = showModalWindow("Espere por favor..",
            "Cargando mis series favoritas ..", "")
        renderFavoritesTVshows(
            loadFavoritesTVShows(),
            CRAWL_TV_SHOWS_FAVORITES_LIMIT,
            htmlElementID)

    } else {
        alert(`ERROR !! 'main-content' not exists ${htmlElementID}`)
    }
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
    document.getElementById("about-show-title").innerHTML = "<p>Titulo</p>" + title;
    document.getElementById("about-show-year").innerHTML = "<p>Año</p>" + year;
    document.getElementById("about-show-description").innerHTML = "<p>Descripcion</p>" + description;
    document.getElementById("about-show-sinopsis").innerHTML = "<p>Sinopsis</p>" + sinopsis;
}

/**
 * On error getting shows
 * 
 * @param {*} htmlElementID htmlelement when error
 * @param {*} modalWindow current modal window
 * @param {*} err Error to log
 */
function getErrorHandle(htmlElementID, modalWindow, err) {
    console.error(`ERROR! - getShows (${htmlElementID}) : ${err}`)
    closeModalWindow(modalWindow);
    modalWindow = showModalWindow("Error grave",
        "Reinicie la aplicacion. Compruebe en un navegador, que el portal www.tumejortorrent.com esta disponible", "OMG!");
}