const tumejortorrent_scrapper_path = 'vws-js-lib/lib/tumejortorrent';
const omdb_path = 'vws-js-lib/lib/omdb';
const IMDB_ICON_PATH = 'app/assets/images/IMDB_Logo_2016.svg.png';

try {
    console.log("Loading 'vws-js-lib' npm module from Local in '../" + tumejortorrent_scrapper_path + "'")
    var tumejortorrent_scraper = require('../' + tumejortorrent_scrapper_path);
    var omdb = require('../' + omdb_path);

} catch (e) {
    console.log("'vws-js-lib' not found in dir. Loading npm module from current 'node_modules/" + tumejortorrent_scrapper_path);
    var tumejortorrent_scraper = require(tumejortorrent_scrapper_path);
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
 * Create HTML text with show
 * 
 * @param jsonShow: JSON Object, with the show
 * @param htmlWithEpisodeLinks: HTML text with episode links or null show is not a TV Show
 * @return html text with the show
 */
function newHTMLShow(jsonShow, htmlWithEpisodeLinks) {
    var newHtml = "";
    newHtml += "<div class='show-container'" +
        " onmouseover='setAboutShow(" +
        '"' + jsonShow.title + '"' +
        "," + '"' + jsonShow.year + '"' +
        "," + '"' + jsonShow.description + '"' +
        "," + '"' + jsonShow.sinopsis + '"' + ")'" +
        ">";

    // console.log("TITULO->'" + jsonShow.title + "' DESCRIPTION ->'" + jsonShow.description + "' SINOPSIS ->" + jsonShow.sinopsis);

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

    var tooltiptexttitle = jsonShow.title;
    if (jsonShow.originalTitle) {
        tooltiptexttitle = jsonShow.title + "(" + jsonShow.originalTitle + ")";
    }
    newHtml += "<span class='tooltiptext'>" + tooltiptexttitle + "</span>";
    newHtml += "</div>";

    // Title
    newHtml += "<div class='show-box-title'>" + jsonShow.title + "</div>";

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

    // Rating
    var showID = getShowID(jsonShow.title, jsonShow.originalTitle, jsonShow.year);
    newHtml += "<div class='show-box-rating' id='" + showID + "'>" + "Searching.." + "</div>";

    // Add html with episode list
    if (htmlWithEpisodeLinks != null) {
        newHtml += htmlWithEpisodeLinks;
    }
    newHtml += "</div>";

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
 * @param {*} text String with the text 
 * @returns html <div> to write the text in the middle of the screen
 */
function htmlWithTextInTheMiddle(text) {
    return "<div class=\"center\">" + text + "<div>"
}

/**
 * Return html with IMDB icon and rating text
 * @param {*} text Text next imdb icon 
 */
function htmlWithIMDbPoints(text) {
    return "<img src=" + IMDB_ICON_PATH + " width=\"35\" height=\"16\">" +
        "<span>" + text + "</span>"
}