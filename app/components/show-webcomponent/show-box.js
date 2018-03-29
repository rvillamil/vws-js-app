/**
 * Webcomponent to show info about films or TV-shows.
 * 
 * https://www.codementor.io/ayushgupta/vanilla-js-web-components-chguq8goz 
 */
class ShowBox extends HTMLElement {
    constructor() {
        super();
        // this.importDocument = document.currentScript.ownerDocument;
        // Events            
        this.addEventListener('click', e => {
            console.log("Element was clicked..!");
        });

        this.IMDB_ICON_PATH = 'Logo_IMDB.png';
        this.TMDB_ICON_PATH = 'Logo_TMDB.png';
        this.ROTTEN_ICON_PATH = 'Logo_rottentomatoes.jpg';
    }

    /**
     * Se llama cada vez que el elemento se inserta en el DOM.
     * Aquí podemos hacer llamadas AJAX para pedir datos, configurar cosas, etc..
     * Funcionaría similar al componentWillMount de React.js
     */
    connectedCallback() {

        const ownerDocument = document.currentScript.ownerDocument;
        const template = ownerDocument.querySelector('#showBox');
        const instance = template.content.cloneNode(true);

        let shadowRoot = this.attachShadow({
            mode: 'open'
        });
        shadowRoot.appendChild(instance);

        // Titulo --> Modern Family
        const title = this.getAttribute('title');
        this.shadowRoot.querySelector('.show-box-title').innerHTML = title;

        // Imagen
        const image = this.getAttribute('show-box-img');
        const urltodownload = this.getAttribute("urltodownload");
        const urlwithcover = this.getAttribute("urlwithcover");
        const originaltitle = this.getAttribute('originaltitle');
        var tooltiptext = title;

        var htmlWithImage = "";
        if (urltodownload) {
            htmlWithImage += "<a href='" + urltodownload + "'>";
            if (urlwithcover) {
                htmlWithImage += "<img src='" + urlwithcover + "'" +
                    " alt='cover' " + "/>";
            }
            htmlWithImage += "</a>";
        }
        // Tooltip text
        if (originaltitle) {
            tooltiptext = title + "(" + originaltitle + ")";
        }
        htmlWithImage += "<span class='tooltiptext'>" + tooltiptext + "</span>";
        this.shadowRoot.querySelector('.show-box-img').innerHTML = htmlWithImage;

        // Quality --> e.g. HDTV 720p
        const quality = this.getAttribute('quality');
        if (quality) {
            this.shadowRoot.querySelector('.show-box-quality').innerHTML = quality;
        }
        // Releasedate and filesize -->  e.g. 29-10-2017 - 700 MB            
        var date = this.getAttribute('releasedate');
        if (date == null) {
            date = 'unknow';
        }
        var size = this.getAttribute('size');
        if (size == null) {
            size = 'unknow';
        }
        this.shadowRoot.querySelector('.show-box-date-and-size').innerHTML = date + " - " + size;

        // Ratings            
        const imdbrating = this.getAttribute('imdbrating');
        if (imdbrating) {
            this.shadowRoot.querySelector('.show-box-rating-imdb').innerHTML = this._renderRatingPoints(
                imdbrating, this.IMDB_ICON_PATH);
        }
        const rottentomatoes = this.getAttribute('rottentomatoes');
        if (rottentomatoes) {
            this.shadowRoot.querySelector('.show-box-rating-rottentomatoes').innerHTML = this._renderRatingPoints(
                imdbrating, this.TMDB_ICON_PATH);
        }
        const tmdbrating = this.getAttribute('tmdbrating');
        if (tmdbrating) {
            this.shadowRoot.querySelector('.show-box-rating-tmdb').innerHTML = this._renderRatingPoints(
                imdbrating, this.ROTTEN_ICON_PATH);
        }
        // Episode list : tvshow-link tags
        this.shadowRoot.querySelector('.showtv-episodes-container').innerHTML = this.shadowRoot.host.innerHTML;
    }

    /**
     * Return html with IMDB icon and rating text
     * @param {*} text Text next imdb icon 
     */
    _renderRatingPoints(text, icon) {
        return "<img src=" + icon + " width=\"35\" height=\"16\">" +
            "<span>" + text + "</span>";
    }
}

window.customElements.define('show-box', ShowBox);