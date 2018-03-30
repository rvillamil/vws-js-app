IMDB_ICON_PATH = 'app/components/show/Logo_IMDB.svg'
TMDB_ICON_PATH = 'app/components/show/Logo_TMDB.svg'
ROTTEN_ICON_PATH = 'app/components/show/Logo_rottentomatoes.svg'
NULL_RATING_STRING = "----"

/**
 * Render Show
 * 
 * @param show: JSON Object, with the show
 * @param htmlWithEpisodeLinks: HTML text with episode links or null show is not a TV Show
 
 * @return html fragment
 */
function renderShowBox(show, htmlWithEpisodeLinks) {
    var htmlShow = "";

    // Tooltip text
    var tooltiptext = show.title;
    if (show.originaltitle != null) {
        tooltiptext = show.title + "(" + show.originaltitle + ")";
    }

    htmlShow += `<div class='show-container' 
                     onmouseover='setAboutShow("${show.title}", 
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
    var imdbrating = show.imdbrating;
    if (imdbrating == null) {
        imdbrating = NULL_RATING_STRING;
    }
    htmlShow += this._renderRatingPoints(imdbrating, IMDB_ICON_PATH, "show-box-rating-imdb");

    var rottentomatoes = show.rottentomatoes;
    if (rottentomatoes == null) {
        rottentomatoes = NULL_RATING_STRING;
    }
    htmlShow += this._renderRatingPoints(rottentomatoes, TMDB_ICON_PATH, "show-box-rating-rottentomatoes");

    var tmdbrating = show.tmdbrating;
    if (tmdbrating == null) {
        tmdbrating = NULL_RATING_STRING;
    }
    htmlShow += this._renderRatingPoints(tmdbrating, ROTTEN_ICON_PATH, "show-box-rating-tmdb");

    htmlShow += `</div>` // </div> show-box-ratings

    // ------- TV Shows ------
    // Session
    if (show.session != null) {
        htmlShow += `<div class='show-box-session'>Temporada ${show.session}</div>`
    }
    // Add html with episode list
    if (htmlWithEpisodeLinks != null) {
        htmlShow += htmlWithEpisodeLinks;
    }
    htmlShow += "</div>";

    //console.log("htmlShow: " + htmlShow);
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
    return `<div class="${className}">    
                 <img src="${iconPath}" width="50" height="16">
                 <span>${rating}</span>
            </div>`
}