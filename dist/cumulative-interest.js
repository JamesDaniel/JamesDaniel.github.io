(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.module = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const main = require('./main');

function submit() {
    document.getElementsByClassName('chart')[0].style.display='block';
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    const years = parseFloat(document.getElementById('years').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const endOfYearInterest = main.calculateCumulativeInterest(initialInvestment, monthlyContribution, years, interestRate);
    const interestAmounts = [];
    const deemedDisposalAdjustment = main.calculateDeemedDisposalOffset(initialInvestment, monthlyContribution, years, interestRate, interestAmounts);
    const amountAfterTax = main.calculateAmountAfterTax(interestAmounts, deemedDisposalAdjustment[deemedDisposalAdjustment.length - 1]);
    const totalContributions = main.calculateTotalContributions(initialInvestment, monthlyContribution, years);
    document.getElementById('amountAfterTax').style.display='block';
    document.getElementById('amountAfterTax').innerHTML=`In ${years} years, you will have &euro;${main.formatNumber(amountAfterTax)} after tax`;
    
    const data = [{
        label: `Future Value`,
        data: endOfYearInterest,
        borderWidth: 3
    },{
        label: `Deemed Disposal Adjustment`,
        data: deemedDisposalAdjustment,
        borderWidth: 3
    },{
        label: `Total Contribution`,
        data: totalContributions,
        borderWidth: 3
    }]
    main.loadChart(data, main.getYearLabels(years+1));
}

module.exports.submit = submit;

},{"./main":2}],2:[function(require,module,exports){
function getYearLabels(numOfYears) {
    const years = [];
    for (let i=0; i<numOfYears; i++) {
        years.push(`Year ${i}`);
    }
    return years;
}
function getMonthlyContributions(monthlyContribution, numOfYears, mortgageDuration, mortgageRepayments) {
    monthlyContribution = typeof monthlyContribution !== 'undefined' && monthlyContribution > 0 ? monthlyContribution : 0;
    const contributions = [];
    for (let i=0; i<numOfYears; i++) {
        if (typeof mortgageDuration === 'undefined' || i<mortgageDuration) {
            contributions.push(monthlyContribution);
        } else {
            contributions.push(monthlyContribution + mortgageRepayments);
        }
    }
    return contributions;
}
function calculateCumulativeInterest(initialInvestment, monthlyContribution, numOfYears, interestRate) {
    const monthlyContributions = getMonthlyContributions(monthlyContribution, numOfYears);
    const endOfYearInterest = [initialInvestment];
    for (let i=1; i<numOfYears+1; i++) {
        monthlyContribution = monthlyContributions.shift();
        let total=0;
        const prev = endOfYearInterest[i-1];
        total = ((interestRate/100.0)*prev)+prev;

        if (monthlyContribution>0) {
            total += monthlyContribution*12;
        }
        endOfYearInterest.push(total);
    }
    return endOfYearInterest;
}
function calculateDeemedDisposalOffset(initialInvestment, monthlyContribution, numOfYears, interestRate, interestAmounts) {
    const monthlyContributions = getMonthlyContributions(monthlyContribution, numOfYears);
    const deemedDisposalAdjustment = [initialInvestment];
    for (let i=1; i<numOfYears+1; i++) {
        monthlyContribution = monthlyContributions.shift();
        let total=0;
        const prev = deemedDisposalAdjustment[i-1];
        const inter = interestRate/100.0;
        const interest = prev*inter;
        interestAmounts.push(interest);
        total = prev+interest;

        if (monthlyContribution>0) {
            total += monthlyContribution*12;
        }

        if (i>8) {
            const amountGained = interestAmounts.shift();
            const fourtyPercentOfInterest = amountGained*0.41;
            deemedDisposalAdjustment.push(total - fourtyPercentOfInterest);
        } else {
            deemedDisposalAdjustment.push(total);
        }
    }
    return deemedDisposalAdjustment;
}
function calculateAmountAfterTax(gainedInterestAmounts, finalAmount) {
    let totalInterestGainedNotYetTaxed=0;
    for (let i = 0; i<gainedInterestAmounts.length; i++) {
        totalInterestGainedNotYetTaxed += gainedInterestAmounts[i];
    }
    let taxDue = totalInterestGainedNotYetTaxed*0.41;
    const amountAfterTax = finalAmount - taxDue;
    return amountAfterTax;
}
function calculateTotalContributions(initialInvestment, monthlyContribution, years) {
    const contributions = [];
    contributions.push(initialInvestment);
    for (let i=1; i<years + 1; i++) {
        contributions.push((monthlyContribution*12) + contributions[i-1]);
    }
    return contributions;
}
function loadChart(data, labels) {
    const ctx = document.getElementById('chart');

    const chart = Chart.getChart('chart');
    if (typeof chart !== 'undefined') {
        chart.destroy();
    }

    new Chart(ctx, {
        type: 'line',
        data: {
        labels: labels,
        datasets: data
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
function formatNumber(floatNum) {
    let num = Intl.NumberFormat('en-IE').format(floatNum.toFixed(2)) + "";
    if (num.indexOf(".") > -1) {
        if (num.split('.')[1].length === 1){
            return `${num}0`;
        }
    } else {
        return `${num}.00`;
    }
    return num;
}

module.exports.getYearLabels = getYearLabels;
module.exports.formatNumber = formatNumber;
module.exports.calculateCumulativeInterest = calculateCumulativeInterest;
module.exports.calculateDeemedDisposalOffset = calculateDeemedDisposalOffset;
module.exports.calculateAmountAfterTax = calculateAmountAfterTax;
module.exports.calculateTotalContributions = calculateTotalContributions;
module.exports.getMonthlyContributions = getMonthlyContributions;
module.exports.loadChart = loadChart;

},{}]},{},[1])(1)
});
