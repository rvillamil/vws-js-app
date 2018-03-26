var Datastore = require('nedb') // https://github.com/louischatriot/nedb
var db = new Datastore({ filename: 'vws-db', 
						 autoload: true });

const show_path = 'vws-js-lib/lib/show';
try {
    console.log("Loading 'vws-js-lib' npm module from Local in '../../../" + show_path + "'");
    var Show = require('../../../' + show_path);

} catch (e) {
    console.log("'vws-js-lib' not found in dir. Loading npm module from current 'node_modules/" + show_path);
    var Show = require(show_path);    
}
// ------------------------------------------------------------
// Config repo
//
/**
 * Repository for my favorites show obejcts
 */
class FavoriteRepository {
    constructor() {
    }
    findAllFavoritesShows(){
        return "TODO: findAllFavoritesShows";
	}
	
	findShowByTittle(theTitle){		
		return db.find({title: theTitle}, function(err, record) {
			if (err) {
				console.error("Error: " + err);
			//	process.exit(0);
			} else{
				//console.log("record: " + JSON.stringify (record));
				//return record;
			}			
			
		});
	}	
	save (show){
		db.insert(show, function (err, newShow) {
			if (err) {				
				console.error("Insert error: " + err);
				return;
			}
			console.log ("Persisted favorite show with title '" +
						 newShow.title + "'" + " and year '" + newShow.year + "'");			
		  });
	}
  }

  // https://www.todojs.com/introduccion-a-nedb-una-base-de-datos-javascript-embebida/
const favoriteRepository = new FavoriteRepository();

var show = new Show();
show.title='titulo1';

favoriteRepository.save ( show )
console.log("Show:  " +favoriteRepository.findShowByTittle ('titulo1'));
