const show_path = 'vws-js-lib/lib/show';
try {
	console.log(`Loading 'Show' object from Local from '../../../${show_path}'`)
	var Show = require('../../../' + show_path);

} catch (e) {
	console.log("'Show' object not found in dir. Loading from current 'node_modules/" + show_path);
	var Show = require(show_path);
}

var Datastore = require('nedb') // https://github.com/louischatriot/nedb
var db = new Datastore({
	filename: 'vws-db',
	autoload: true
});

// ------------------------------------------------------------
/**
 * Repository for my favorites show objects
 * https://www.todojs.com/introduccion-a-nedb-una-base-de-datos-javascript-embebida/
 */
class FavoriteRepository {
	constructor() {}

	findAllFavoritesShows(favoritesShows, onShowFound) {
		//favoritesShows = [];
		db.find({}, function (err, record) {
			if (err) {
				console.error("ERROR! FavoriteRepository - findAllFavoritesShows: " + err);
				process.exit(0);
			} else {
				favoritesShows[0] = 'ala;';
				onShowFound(record);
			}
		});
		return favoritesShows;
	}

	findShowByTittle(theTitle, onShowFound) {
		db.find({
			title: theTitle
		}, function (err, record) {
			if (err) {
				console.error("ERROR! FavoriteRepository - findShowByTittle: " + err);
				process.exit(0);
			} else {
				onShowFound(record);
			}
		});
	}
	save(show) {
		db.insert(show, function (err, newShow) {
			if (err) {
				console.error("ERROR! FavoriteRepository - insert error: " + err);
				return;
			}
			console.log("Persisted favorite show with title '" +
				newShow.title + "'" + " and year '" + newShow.year + "'");
		});
	}
}

// --- Examples --

const favoriteRepository = new FavoriteRepository();

var show1 = new Show();
show1.title = 'titulo1';
show1.year = '2012';
favoriteRepository.save(show1);

var show2 = new Show();
show2.title = 'titulo2';
show2.year = '4012';
favoriteRepository.save(show2);

/*
favoriteRepository.findShowByTittle('titulo2', show => {
	console.log('Found ' + JSON.stringify(show));
})
*/
favoritesShows = [];
favoritesShows.push('a')
favoriteRepository.findAllFavoritesShows(favoritesShows, show => {
	//console.log('Found ' + JSON.stringify(show));
	//favoritesShows[0] = show.title;
})

console.log('Favoritos: ' + favoritesShows);