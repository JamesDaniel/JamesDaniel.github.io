var assert = require('assert');
const main = require('../js/main');

describe('Tests', function () {
    it('should format a number', function () {
        assert.equal('1,234.12', main.formatNumber(1234.123));
    });
    it('should format a whole number', function () {
        assert.equal('1,234.00', main.formatNumber(1234));
    });
    it('should format a number with single digit decimal', function () {
        assert.equal('1,234.10', main.formatNumber(1234.1));
    });
    it('should list years', function () {
        const length = 4;
        const years = main.getYearLabels(length);
        for (let i=0; i<length; i++) {
            assert.equal('Year 0', years[0]);
            assert.equal('Year 1', years[1]);
            assert.equal('Year 2', years[2]);
            assert.equal('Year 3', years[3]);
        }
    });
});
