const tumejortorrent_scrapper_path = 'vws-js-lib/lib/tumejortorrent';
const omdb_path = 'vws-js-lib/lib/omdb';
const IMDB_ICON_PATH = 'app/assets/images/IMDB_Logo_2016.svg.png';

try {
    console.log("Loading 'vws-js-lib' npm module from Local in '../../../" + tumejortorrent_scrapper_path + "'")
    var tumejortorrent_scraper = require('../../../' + tumejortorrent_scrapper_path);
    console.log("Loading 'vws-js-lib' npm module from Local in '../../../" + omdb_path + "'")
    var omdb = require('../../../' + omdb_path);

} catch (e) {
    console.log("'vws-js-lib' not found in dir. Loading npm module from current 'node_modules/" + tumejortorrent_scrapper_path);
    var tumejortorrent_scraper = require(tumejortorrent_scrapper_path);
    console.log("'vws-js-lib' not found in dir. Loading npm module from current 'node_modules/" + omdb_path);
    var omdb = require(omdb_path);
}

/**
 * Init home
 */
function loadContent() {
    getShows(event, 'videopremieres-content');
}

/**
 * Search the show rating using omdb service
 * 
 * @param {*} showListCrawled Show objects list
 */
function searchShowRating(showList) {
    showList.forEach(show => {
        var theTitle = show.originalTitle;
        if (!theTitle) {
            theTitle = show.title;
        }
        omdb.searchShow(theTitle, show.year)
            .then(function (response) {
                /*
                console.log("The data found for title '" + theTitle + "' and year '" +
                    show.year + "' --> " + JSON.stringify(response));
                */
                var theHTMLShow = document.getElementById(getShowID(show.title, show.originalTitle, show.year));
                if (response.imdbRating) {
                    theHTMLShow.innerHTML = htmlWithIMDbPoints(response.imdbRating);
                } else {
                    theHTMLShow.innerHTML = htmlWithIMDbPoints("-");
                }
            })
            .catch(function (err) {
                console.log('Error: ' + err);
            });
    });
}

/**
 * Replace de tabcontent with name 'htmlElementID' with HTML show list
 *
 * @param evt : MouseEvent
 * @param htmlElementID: billboardfilms-content, videopremieres-content,... HTML element to replace
 */
function getShows(evt, htmlElementID) {
    console.log("getShows - Loading content .. '" + htmlElementID + "'");
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
    var modalWinow = null;

    if (htmlElementID == "billboardfilms-content") {
        modalWinow = showModalWindow("Espere por favor..", "Obteniendo los estrenos de cine ..", "");

        tumejortorrent_scraper.crawlBillboardFilms(
                showObjectCrawled => document.getElementById(htmlElementID).innerHTML += newHTMLShow(showObjectCrawled, null))
            .then(
                showListCrawled => {
                    console.log("billboardfilms length: " + showListCrawled.length);
                    closeModalWindow(modalWinow);
                    searchShowRating(showListCrawled);
                }
            ).catch(function (err) {
                console.log('Error: ' + err);
            });

    } else if (htmlElementID == "videopremieres-content") {
        modalWinow = showModalWindow("Espere por favor..", "Obteniendo los estrenos de Video ..", "");
        tumejortorrent_scraper.crawlVideoPremieres(
                showObjectCrawled => document.getElementById(htmlElementID).innerHTML += newHTMLShow(showObjectCrawled, null))
            .then(
                showListCrawled => {
                    console.log("videopremieres length: " + showListCrawled.length);
                    closeModalWindow(modalWinow);
                    searchShowRating(showListCrawled);
                }
            ).catch(function (err) {
                console.log('Error: ' + err);
            });

    } else {
        alert("ERROR!! 'main-content' not exists " + htmlElementID)
    }
}

/**
 * Create HTML TAG with show info
 * 
 * @param show: JSON Object, with the show
 * @param htmlWithEpisodeLinks: HTML text with episode links or null show is not a TV Show
 
 * @return html fragment with the show render
 */
function newHTMLShow(show, htmlWithEpisodeLinks) {
    var newHtml = "";
    newHtml += "<div class='show-container'" +
        " onmouseover='setAboutShow(" +
        '"' + show.title + '"' +
        "," + '"' + show.year + '"' +
        "," + '"' + show.description + '"' +
        "," + '"' + show.sinopsis + '"' + ")'" +
        ">";

    newHtml += '<show-box title=${show.title} originaltitle=${show.originalTitle} ' +
        'quality=${show.quality} releasedate=${show.releaseDate} size=${fileSize} urltodownload=${show.urltodownload} urlwithcover=${show.urlwithCover} imdbrating=${show.imdbRating} rottentomatoes=${show.rottenTomatoes}>'

    // TODO: Episode list
    /*
    <show-box title="Modern Family" originaltitle="Repudieitor..2" quality="HDTV 720p" releasedate="12-10-2003" urltodownload="http://tumejorjuego.com/redirect/index.php?link=descargar-torrent/100089_modern-family-temporada-9-hdtv-720p-cap-903-ac3-5-1-espaa-a-ol-castellano/"
        urlwithcover="http://localhost:8080/Logo_IMDB.png" imdbrating="6.3" rottentomatoes="50/10">
        <tvshow-link session="1" episode="6" urltodownload="http://tumejorjuego.com/redirect/index.php?link=descargar-torrent/100089_modern-family-temporada-9-hdtv-720p-cap-903-ac3-5-1-espaa-a-ol-castellano/"></tvshow-link>
        <tvshow-link session="2" episode="8" urltodownload="http://tumejorjuego.com/redirect/index.php?link=descargar-torrent/100089_modern-family-temporada-9-hdtv-720p-cap-903-ac3-5-1-espaa-a-ol-castellano/"></tvshow-link>
    </show-box>
    */
    newHtml += '</show-box>'
    newHtml += '</div>';

    console.log('newHTML: ' + newHtml);
    return newHtml;
}

function getShowID(title, originalTitle, year) {
    var theTitle = originalTitle;
    if (!theTitle) {
        theTitle = title;
    }
    return theTitle + "_" + year;
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


/**
 * Return html with IMDB icon and rating text
 * @param {*} text Text next imdb icon 
 * 
 * TODO: ¿Que hacemos con esto?
 */
function htmlWithIMDbPoints(text) {
    return "<img src=" + IMDB_ICON_PATH + " width=\"35\" height=\"16\">" +
        "<span>" + text + "</span>"
}