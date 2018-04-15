//
// npm modules required
//
//var Show = require('vws-js-lib/lib/showcollection');

IMDB_ICON_PATH = 'app/components/show/Logo_IMDB.svg'
TMDB_ICON_PATH = 'app/components/show/Logo_TMDB.svg'
ROTTEN_ICON_PATH = 'app/components/show/Logo_rottentomatoes.svg'
NULL_RATING_STRING = "----"

/**
 * Render Show with film or video information
 * 
 * @param show: JSON Object, with the show
 * @return html fragment
 */
function renderFilm(show) {
    return `
    <div class='show-container' onmouseover='renderAboutShowSection("${show.title}", 
                                                         "${show.year}",
                                                         "${show.description}",
                                                         "${show.sinopsis}")'>
        ${_renderCoverWithToolTipText(show)}
        ${_renderTitle(show)}
        ${_renderQuality(show)} 
        ${_renderReleaseDateAndFileSize(show)}        
        ${_renderAllRatingPoints(show)}
    </div>`
}

/**
 * Render Show with TVShow information
 * 
 * @param show: JSON Object, with the show
 * @return html fragment
 */
function renderTVShow(show) {
    return `
    <div class='show-container' 
                    ondblclick='saveFavoriteTVshow ("${show.collectionName}")' 
                    onmouseover='renderAboutShowSection("${show.title}", 
                                                         "${show.year}",
                                                         "${show.description}",
                                                         "${show.sinopsis}")'>
        ${_renderCoverWithToolTipText(show)}
        ${_renderTitle(show)}
        ${_renderQuality(show)} 
        ${_renderReleaseDateAndFileSize(show)}        
        ${_renderAllRatingPoints(show)}
        ${_renderSession(show)}
    </div>`
}

/**
 * Render ShowCollection object
 * 
 * @param showCollection: JSON Object, with the showCollection
 * @return html fragment
 */
function renderShowCollectionBox(showCollection) {
    var firstShow = showCollection.shows[0]

    return `
    <div class='showcollection-container'
                    onmouseover='renderAboutShowSection("${firstShow.title}", 
                                                         "${firstShow.year}",
                                                         "${firstShow.description}",
                                                         "${firstShow.sinopsis}")'>
        ${_renderCoverWithToolTipText(firstShow)}
        ${_renderTitle(firstShow)}
        ${_renderQuality(firstShow)}
        ${_renderReleaseDateAndFileSize(firstShow)}
        ${_renderSessionsCollection(showCollection)}
    </div>`
}



// ----------------------------------------------------------------------------
// 
// Private functions
function _renderCoverWithToolTipText(show) {
    return `
        <div class='show-box-img'>
            <a href='${show.urltodownload}'>
                <img src='${show.urlwithCover}' alt='cover'/>
            </a>
            <span class='tooltiptext'>${this._newToolTipTex(show)}</span>
        </div>
    `
}

function _renderTitle(show) {
    return `<div class='show-box-title'>${show.title}</div>`
}

function _renderQuality(show) {
    var quality = show.quality;
    if (quality == null) {
        quality = "Desconocida";
    }
    return `<div class='show-box-quality'>${quality}</div>`
}

function _renderReleaseDateAndFileSize(show) {

    var date = show.releaseDate;
    if (date == null) {
        date = 'unknow';
    }
    var size = show.fileSize;
    if (size == null) {
        size = 'unknow';
    }
    return `<div class='show-box-text'>${date} - ${size}</div>`
}

function _renderAllRatingPoints(show) {
    var htmlShow = `<div class='show-box-ratings'>`

    var imdbrating = show.imdbRating;
    if (imdbrating == null) {
        imdbrating = NULL_RATING_STRING;
    }
    htmlShow += this._renderRatingPoints(imdbrating, IMDB_ICON_PATH, "show-box-rating-imdb");

    var rottentomatoes = show.rottenTomatoes;
    if (rottentomatoes == null) {
        rottentomatoes = NULL_RATING_STRING;
    }
    htmlShow += this._renderRatingPoints(rottentomatoes, ROTTEN_ICON_PATH, "show-box-rating-rottentomatoes");

    var tmdbrating = show.tmdbRating;
    if (tmdbrating == null) {
        tmdbrating = NULL_RATING_STRING;
    }
    htmlShow += this._renderRatingPoints(tmdbrating, TMDB_ICON_PATH, "show-box-rating-tmdb");

    htmlShow += "</div>" // </div> show-box-ratings
    return htmlShow
}

function _renderRatingPoints(rating, iconPath, className) {
    var ratingFilled = rating + "";
    if (ratingFilled.length < 2) {
        ratingFilled = rating + '.0'
    }
    return `<div class="${className}">    
                 <img src="${iconPath}" width="50" height="16">
                 <span>${ratingFilled}</span>
            </div>`
}

function _renderSession(show) {
    var htmlShow = ""
    if (show.session != null) {
        htmlShow += `<div class='show-box-session'>Temporada ${show.session}</div>`
    }
    return htmlShow
}

function _renderSessionAndEpisode(show) {
    return `<div class='show-box-session'>
                <a href='${show.urltodownload}'>
                    Temp.${show.currentSession} - Cap.${show.currentEpisode} 
                </a>
            </div>`
}

function _renderSessionsCollection(showCollection) {
    var htmlFragment = "<div class='show-box-session'>"
    showCollection.getShows().forEach(show => {
        htmlFragment += _renderSessionAndEpisode(show)
    })
    htmlFragment += "</div>"
    return htmlFragment
}

function _newToolTipTex(show) {
    var tooltiptext = show.title;
    if (show.originalTitle != null) {
        if (show.originalTitle.trim().toUpperCase() != show.title.trim().toUpperCase()) {
            tooltiptext = show.title + "(" + show.originalTitle + ")";
        }
    }
    return tooltiptext
}