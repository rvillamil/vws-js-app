IMDB_ICON_PATH = 'app/components/show/Logo_IMDB.png'
TMDB_ICON_PATH = 'app/components/show/Logo_TMDB.png'
ROTTEN_ICON_PATH = 'app/components/show/Logo_rottentomatoes.jpg'

/**
 * Create HTML TAG with show info
 * 
 * @param show: JSON Object, with the show
 * @param htmlWithEpisodeLinks: HTML text with episode links or null show is not a TV Show
 
 * @return html fragment with the show render
 */
function newHTMLShow(show, htmlWithEpisodeLinks) {
    var newHtml = "";

    // Tooltip text
    var tooltiptext = show.title;
    if (show.originaltitle != null) {
        tooltiptext = show.title + "(" + show.originaltitle + ")";
    }

    newHtml += `<div class='show-container' 
                     onmouseover='setAboutShow("${show.title}", 
                                                "${show.year}",
                                                "${show.description}",
                                                "${show.sinopsis}")'>
    <!-- cover -->
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
    newHtml += `<div class='show-box-quality'>${quality}</div>`

    // Releasedate and filesize -->  e.g. 29-10-2017 - 700 MBar date = this.getAttribute('releasedate');
    var date = show.releaseDate;
    if (date == null) {
        date = 'unknow';
    }
    var size = show.fileSize;
    if (size == null) {
        size = 'unknow';
    }
    newHtml += `<div class='show-box-text'>${date} - ${size}</div>`

    // Ratings            
    const imdbrating = 5;
    if (imdbrating) {
        newHtml += this._renderRatingPoints(imdbrating, IMDB_ICON_PATH);
    }
    const rottentomatoes = show.rottentomatoes;
    if (rottentomatoes) {
        newHtml += this._renderRatingPoints(rottentomatoes, TMDB_ICON_PATH);
    }
    const tmdbrating = show.tmdbrating;
    if (tmdbrating) {
        newHtml += this._renderRatingPoints(tmdbrating, ROTTEN_ICON_PATH);
    }

    // ------- TV Shows ------
    // Session
    if (show.session != null) {
        newHtml += `<div class='show-box-session'>Temporada ${show.session}</div>`
    }
    // Add html with episode list
    if (htmlWithEpisodeLinks != null) {
        newHtml += htmlWithEpisodeLinks;
    }
    newHtml += "</div>";

    console.log("newHTML: " + newHtml);
    return newHtml;
}


/**
 * Return html with IMDB icon and rating text
 * @param {*} text Text next imdb icon 
 */
function _renderRatingPoints(text, icon) {
    return "<img src=" + icon + " width=\"35\" height=\"16\">" +
        "<span>" + text + "</span>";
}