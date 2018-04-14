IMDB_ICON_PATH = 'app/components/show/Logo_IMDB.svg'
TMDB_ICON_PATH = 'app/components/show/Logo_TMDB.svg'
ROTTEN_ICON_PATH = 'app/components/show/Logo_rottentomatoes.svg'
NULL_RATING_STRING = "----"

/**
 * Render Show object
 * 
 * @param show: JSON Object, with the show
 * @return html fragment
 */
function renderShowBox(show) {
    var htmlShow = "";


    // Tooltip text
    var tooltiptext = show.title;
    if (show.originalTitle != null) {
        if (show.originalTitle.trim().toUpperCase() != show.title.trim().toUpperCase()) {
            tooltiptext = show.title + "(" + show.originalTitle + ")";
        }
    }

    htmlShow += `<div class='show-container' 
                     ondblclick='saveFavoriteTVshow ("${show.collectionName}")' 
                     onmouseover='renderAboutShowSection("${show.title}", 
                                                         "${show.year}",
                                                         "${show.description}",
                                                         "${show.sinopsis}")'>
    <!-- cover and tooltip -->
    <div class='show-box-img'>
        <a href='${show.urltodownload}'>
            <img src='${show.urlwithCover}' alt='cover'/>
        </a>
        <span class='tooltiptext'>${tooltiptext}</span>
    </div>
    
    <!-- Title -->
    <div class='show-box-title'>${show.title}</div>`

    // Quality --> e.g. HDTV 720p
    var quality = show.quality;
    if (quality == null) {
        quality = "Desconocida";
    }
    htmlShow += `<div class='show-box-quality'>${quality}</div>`

    // Releasedate and filesize -->  e.g. 29-10-2017 - 700 MBar date = this.getAttribute('releasedate');
    var date = show.releaseDate;
    if (date == null) {
        date = 'unknow';
    }
    var size = show.fileSize;
    if (size == null) {
        size = 'unknow';
    }
    htmlShow += `<div class='show-box-text'>${date} - ${size}</div>`

    // Ratings            
    htmlShow += `<div class='show-box-ratings'>`
    //const imdbrating = 5.3;
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

    // ------- TV Shows ------
    // Session
    if (show.session != null) {
        htmlShow += `<div class='show-box-session'>Temporada ${show.session}</div>`
    }

    htmlShow += "</div>";

    return htmlShow;
}


/**
 * Render Rating
 * 
 * @param {*} rating Text with rating 
 * @param {*} iconPath Icon logo 
 * @param {*} className css clasname 
 */
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