const CRAWL_LIMIT = 20; // Number of shows to crawl
const favoriteRepository = require('../app/model/favoriteRepository');

const crawlerPath = 'vws-js-lib/lib/crawler';
try {
    console.log(`Loading 'crawler' npm module from Local from '../${crawlerPath}'`)
    var crawler = require('../' + crawlerPath);
} catch (e) {
    console.log(`'crawler' not found in dir. Loading npm module from current 'node_modules/" ${crawlerPath}`);
    var crawler = require(crawlerPath);
}

/**
 * Init home
 */
function loadContent() {
    getShows(event, 'videopremieres-content');
}

/**
 * Replace de tabcontent with name 'htmlElementID' with HTML show list
 *
 * @param evt : MouseEvent
 * @param htmlElementID: billboardfilms-content, videopremieres-content,... HTML element to replace
 */
function getShows(evt, htmlElementID) {
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
                    document.getElementById(htmlElementID).innerHTML += renderShowBox(show, null);
                })
            .then(
                urlList => {
                    console.log(`crawler - Billboardfilms length: ${urlList.length}`)
                    closeModalWindow(modalWindow)
                }
            ).catch(err => {
                console.error(`ERROR! getShows - Billboardfilms: ${err}`)
            });


    } else if (htmlElementID == "videopremieres-content") {
        modalWindow = showModalWindow("Espere por favor..", "Obteniendo los estrenos de Video ..", "");

        crawler.crawlVideoPremieres(
                CRAWL_LIMIT,
                show => {
                    //console.log(`onShowFoundEvent - Show crawled !!  --> ${JSON.stringify(show)}\n\n`)
                    document.getElementById(htmlElementID).innerHTML += renderShowBox(show, null);
                })
            .then(
                urlList => {
                    console.log(`crawler - VideoPremieres length: ${urlList.length}`);
                    closeModalWindow(modalWindow);
                }
            ).catch(err => {
                console.error(`ERROR! getShows - VideoPremieres: ${err}`)
            });

    } else if (htmlElementID == "favoritetvshows-content") {
        modalWindow = showModalWindow("Espere por favor..", "Obteniendo mis series favoritas ..", "");
        favoriteRepository.findAllFavoritesShows(show => {
            console.log(`TVShow favorite found '${JSON.stringify(show)}'`);
        });

    } else {
        alert(`ERROR!! 'main-content' not exists ${htmlElementID}`)
    }
}

/**
 * Fill 'about show' section
 * 
 * @param title: The show title 
 * @param description The show description (actor, length..)
 * @param sinopsis The show sinopsis
 */
function setAboutShow(title, year, description, sinopsis) {
    document.getElementById("about-show-title").innerHTML = "<p>Titulo</p>" + title;
    document.getElementById("about-show-year").innerHTML = "<p>Año</p>" + year;
    document.getElementById("about-show-description").innerHTML = "<p>Descripcion</p>" + description;
    document.getElementById("about-show-sinopsis").innerHTML = "<p>Sinopsis</p>" + sinopsis;
}