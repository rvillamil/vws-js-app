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

	findAllFavoritesShows() {
		return new Promise((resolve, reject) => {
			db.find({}, function (err, records) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findAllFavoritesShows ${err}`));
				} else {
					resolve(records);
				}
			});
		});
	}

	findShowByTittle(theTitle) {
		return new Promise((resolve, reject) => {
			db.find({
				title: theTitle
			}, function (err, record) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - findShowByTittle ${err}`));
				} else {
					resolve(record);
				}
			});
		});
	}

	save(show) {
		return new Promise((resolve, reject) => {
			db.insert(show, function (err, newShow) {
				if (err) {
					reject(Error(`ERROR! FavoriteRepository - insert error:  ${err}`));
				} else {
					resolve(newShow);
				}
			});
		});
	}
}


//
// NPM modules: https://goo.gl/Z5Ry3J
//
module.exports = FavoriteRepository;

// --- Examples --
/*
const favoriteRepository = new FavoriteRepository();

var show1 = new Show();
show1.title = 'titulo1';
show1.year = '2012';
favoriteRepository.save(show1).then(
	newShow => console.log(newShow));

var show2 = new Show();
show2.title = 'titulo2';
show2.year = '4012';
favoriteRepository.save(show2);
*/

/*
favoriteRepository.findAllFavoritesShows()
	.then(records => console.log("Favorites: " + JSON.stringify(records)));
*/

/*
favoriteRepository.findShowByTittle('titulo2').then(show => console.log("Shows" + JSON.stringify(show)));
*/