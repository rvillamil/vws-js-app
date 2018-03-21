// Tengo que ser capaz de almacenar mis series favoritas y de recuperaras
// -- ver https://www.techiediaries.com/electron-data-persistence/ --> 
// NeDB stands for Node.js Embedded Database, it's a
// pure JavaScript module with no binary dependency and its API is a subset of MongoDB. NeDB can be used as in-memory or as a persistent database.

	/**
	 * Find by account user name.
	 *
	 * @param userName the user name
	 * @return the collection
	 */
	// SELECT f from Favorite f WHERE f.account.username = :username
//	Collection<Favorite> findByAccountUserName(String userName);

	/**
	 * Find by account user name and title.
	 *
	 * @param userName the user name
	 * @param title the title
	 * @return the optional
	 */
	// SELECT f from Favorite f WHERE f.account.username = :username AND f.title = :title
//	Optional<Favorite> findByAccountUserNameAndTitle(String userName, String title);

/**
 * Managment all favorites
 */
class FavoriteRepository {
    constructor() {      
    }
    findAllFavorites(){
        
    }
  }
  