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
    it('should calculate cumulative interest', function () {
        const initialInvestment = 1000;
        const monthlyContribution = 1200;
        const years = 17;
        const interestRate = 10;
        const actual = main.calculateCumulativeInterest(initialInvestment,monthlyContribution,years,interestRate);
        const expected = [
            1000,               15500,
            31450,              48995,
            68294.5,            89523.95,
            112876.345,         138563.97950000002,
            166820.37745000003, 197902.41519500004,
            232092.65671450004, 269701.92238595005,
            311072.11462454504, 356579.32608699956,
            406637.2586956995,  461700.98456526943,
            522271.08302179637, 588898.191323976
        ];
        assertArrayEqual(expected, actual);
    });
    it('should calculate deemed disposal adjustment', function () {
        const initialInvestment = 1000;
        const monthlyContribution = 1200;
        const years = 17;
        const interestRate = 10;
        const interestAmounts = [];
        let expected = [
            1000,               15500,
            31450,              48995,
            68294.5,            89523.95,
            112876.345,         138563.97950000002,
            166820.37745000003, 197861.41519500004,
            231412.05671450004, 267663.81238595006,
            306821.3986245451,  349103.4639869996,
            394743.3284356996,  443989.73113426956,
            497107.5810881965,  554378.7037215661
        ];
        let actual = main.calculateDeemedDisposalOffset(initialInvestment,monthlyContribution,years,interestRate,interestAmounts);
        assertArrayEqual(expected, actual);
        expected = [
            19786.141519500005,
            23141.205671450007,
            26766.381238595008,
            30682.13986245451,
            34910.34639869996,
            39474.33284356996,
            44398.97311342696,
            49710.75810881965
        ];
        assertArrayEqual(expected, interestAmounts);
    });
    it('should calculate deemed disposal adjustment less than 9 years', function () {
        const initialInvestment = 1000;
        const monthlyContribution = 1200;
        const years = 6;
        const interestRate = 10;
        const interestAmounts = [];
        let expected = [ 1000, 15500, 31450, 48995, 68294.5, 89523.95, 112876.345 ];
        let actual = main.calculateDeemedDisposalOffset(initialInvestment,monthlyContribution,years,interestRate,interestAmounts);
        assertArrayEqual(expected, actual);
        expected = [ 100, 1550, 3145, 4899.5, 6829.450000000001, 8952.395 ];
        assertArrayEqual(expected, interestAmounts);
    });
    it('should calculate deemed disposal adjustment less than 2 years', function () {
        const initialInvestment = 1000;
        const monthlyContribution = 1000;
        const years = 2;
        const interestRate = 10;
        const interestAmounts = [];
        let expected = [ 1000, 13100, 26410 ];
        let actual = main.calculateDeemedDisposalOffset(initialInvestment,monthlyContribution,years,interestRate,interestAmounts);
        assertArrayEqual(expected, actual);
        expected = [ 100, 1310 ];
        assertArrayEqual(expected, interestAmounts);
    });
    it('should calculate final amount after tax', function () {
        const interestAmounts = [
            19786.141519500005,
            23141.205671450007,
            26766.381238595008,
            30682.13986245451,
            34910.34639869996,
            39474.33284356996,
            44398.97311342696,
            49710.75810881965
        ];
        const finalAmount = 554378.7037215661;
        const expected = 444141.8894313945;
        const actual = main.calculateAmountAfterTax(interestAmounts, finalAmount);
        assert.equal(expected, actual)
    });
    it('should calculate final amount after tax for 2 years', function () {
        const interestAmounts = [ 100, 1310 ];
        const finalAmount = 26410;
        const expected = 25831.9;
        const actual = main.calculateAmountAfterTax(interestAmounts, finalAmount);
        assert.equal(expected, actual)
    });
    function assertArrayEqual(expected, actual) {
        for (let i=0; i<expected; i++) {
            assert.equal(expected[i], actual[i])
        }
    }
});
