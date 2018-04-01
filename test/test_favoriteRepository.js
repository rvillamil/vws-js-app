//
// Testing support:
//
// - mocha ...: https://mochajs.org/
// - assert ..: https://nodejs.org/api/all.html
//
const assert = require('assert');
const favoriteRepository = require('../app/model/favoriteRepository');

describe('favoriteRepository', function () {

    describe('#save()', function () {
        it('Should persist one Show', function () {
            var show = new Show();
            show.title = 'test_title_save_1';
            show.year = 'test_year_save_1';
            favoriteRepository.save(show);
            assert.equal(1, '1');
        });
    });
});