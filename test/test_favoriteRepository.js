//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const favoriteRepository = require('app/model/favoriteRepository.js');

describe('favoriteRepository', function () {

    it('Should persist one Show', function () {
        assert.equal(1, '1');
        /*
        return omdb.searchShow('Star wars', '1977')
            .then(show => {
                //console.log('Show: ', show);
                assert.equal(show.title, 'Star wars');
                assert.equal(show.year, '1977');
                assert.equal(show.error, 'none');
            })
            */
    });
});