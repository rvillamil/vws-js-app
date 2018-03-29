const CRAWL_LIMIT = 3; // Number of shows to crawl
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
 * Search the show rating using omdb service
 * 
 * @param {*} showListCrawled Show objects list
 */
/*
function searchShowRating(showList) {
    showList.forEach(show => {
        var theTitle = show.originalTitle;
        if (!theTitle) {
            theTitle = show.title;
        }
        omdb.searchShow(theTitle, show.year)
            .then(function (response) {
                
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
*/

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
                show => document.getElementById(htmlElementID).innerHTML += newHTMLShow(show, null), CRAWL_LIMIT)
            .then(
                showList => {
                    console.log("crawler - Billboardfilms length: " + showList.length);
                    closeModalWindow(modalWindow);
                }
            ).catch(function (err) {
                console.log('Error: ' + err);
            });


    } else if (htmlElementID == "videopremieres-content") {
        modalWindow = showModalWindow("Espere por favor..", "Obteniendo los estrenos de Video ..", "");

        crawler.crawlVideoPremieres(
                show => document.getElementById(htmlElementID).innerHTML += newHTMLShow(show, null), CRAWL_LIMIT)
            .then(
                showList => {
                    console.log("crawler - VideoPremieres length: " + showList.length);
                    closeModalWindow(modalWindow);
                }
            ).catch(function (err) {
                console.log('Error: ' + err);
            });

    } else {
        alert(`ERROR!! 'main-content' not exists ${htmlElementID}`)
    }
}

/**
 * Create HTML TAG with show info
 * 
 * @param show: JSON Object, with the show
 * @param htmlWithEpisodeLinks: HTML text with episode links or null show is not a TV Show
 
 * @return html fragment with the show render
 */
function newHTMLShow(jsonShow, htmlWithEpisodeLinks) {
    var newHtml = "";
    newHtml += "<div class='show-container'" +
        " onmouseover='setAboutShow(" + '"' + jsonShow["title"] + '"' +
        "," + '"' + jsonShow["year"] + '"' +
        "," + '"' + jsonShow["description"] + '"' +
        "," + '"' + jsonShow["sinopsis"] + '"' + ")'" +
        ">";
    //console.log("Titulo: " + jsonShow["title"] + "- descr" + jsonShow["description"] + "- sinopsis: " + jsonShow["sinopsis"]);

    // Filmaffinity Points
    if (jsonShow["filmaffinityPoints"] != null) {
        newHtml += "<div class='show-box-text'>" + " Filmaffinity " +
            jsonShow["filmaffinityPoints"] + "</div>";
    }
    // Cover            
    newHtml += "<div class='show-box-img'>";
    newHtml += "<a href='" + jsonShow["urltodownload"] + "'>";
    newHtml += "<img src='" + jsonShow["urlwithCover"] + "'" +
        " alt='cover' " + "/>";
    newHtml += "</a>";
    newHtml += "<span class='tooltiptext'>" + jsonShow["title"] +
        "</span>";
    newHtml += "</div>";

    // Title
    newHtml += "<div class='show-box-title'>" + jsonShow["title"] +
        "</div>";

    // Session
    if (jsonShow["session"] != null) {
        newHtml += "<div class='show-box-session'>" + "Temporada " +
            jsonShow["session"] + "</div>";
    }
    // Quality
    var quality = jsonShow["quality"];
    //console.log ("Quality:'" + quality + "'");
    if (quality == null) {
        quality = "Undetermined";
    }
    newHtml += "<div class='show-box-quality'>" + quality + "</div>";

    // Releasedate and filesize
    newHtml += "<div class='show-box-text'>" + jsonShow["releaseDate"] +
        " - " + jsonShow["fileSize"] + "</div>";

    // Add html with episode list
    if (htmlWithEpisodeLinks != null) {
        newHtml += htmlWithEpisodeLinks;
    }
    newHtml += "</div>";

    return newHtml;
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

/*
function getShowID(title, originalTitle, year) {
    var theTitle = originalTitle;
    if (!theTitle) {
        theTitle = title;
    }
    return theTitle + "_" + year;
}
*/

/**
 * Return html with IMDB icon and rating text
 * @param {*} text Text next imdb icon 
 * 
 * TODO: ¿Que hacemos con esto?
 */
/*
function htmlWithIMDbPoints(text) {
    return "<img src=" + IMDB_ICON_PATH + " width=\"35\" height=\"16\">" +
        "<span>" + text + "</span>"
}
*/