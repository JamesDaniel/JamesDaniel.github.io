(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function getYearLabels(numOfYears) {
    const years = [];
    for (let i=0; i<numOfYears; i++) {
        years.push(`Year ${i}`);
    }
    return years;
}
function calculateCumulativeInterest(initialInvestment, monthlyContribution, numOfYears, interestRate) {
    const endOfYearInterest = [initialInvestment];
    for (let i=1; i<numOfYears+1; i++) {
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
    const deemedDisposalAdjustment = [initialInvestment];
    for (let i=1; i<numOfYears+1; i++) {
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
function loadChart(data) {
    const ctx = document.getElementById('chart');

    const chart = Chart.getChart('chart');
    if (typeof chart !== 'undefined') {
        chart.destroy();
    }

    let labels = getYearLabels(data.endOfYearInterest.length);
    new Chart(ctx, {
        type: 'line',
        data: {
        labels: labels,
        datasets: [{
            label: `Future Value`,
            data: data.endOfYearInterest,
            borderWidth: 3
        },{
            label: `Deemed Disposal Adjustment`,
            data: data.deemedDisposalAdjustment,
            borderWidth: 3
        },{
            label: `Total Contribution`,
            data: data.totalContributions,
            borderWidth: 3
        }]
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
function submit() {
    document.getElementsByClassName('chart')[0].style.display='block';
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    const years = parseFloat(document.getElementById('years').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const endOfYearInterest = calculateCumulativeInterest(initialInvestment, monthlyContribution, years, interestRate);
    const interestAmounts = [];
    const deemedDisposalAdjustment = calculateDeemedDisposalOffset(initialInvestment, monthlyContribution, years, interestRate, interestAmounts);
    const amountAfterTax = calculateAmountAfterTax(interestAmounts, deemedDisposalAdjustment[deemedDisposalAdjustment.length - 1]);
    const totalContributions = calculateTotalContributions(initialInvestment, monthlyContribution, years);
    document.getElementById('amountAfterTax').style.display='block';
    document.getElementById('amountAfterTax').innerHTML=`In ${years} years, you will have &euro;${formatNumber(amountAfterTax)} after tax`;
    const data = {
        endOfYearInterest,
        deemedDisposalAdjustment,
        amountAfterTax,
        totalContributions
    }
    loadChart(data);
}

module.exports.getYearLabels = getYearLabels;
module.exports.formatNumber = formatNumber;
module.exports.calculateCumulativeInterest = calculateCumulativeInterest;
module.exports.calculateDeemedDisposalOffset = calculateDeemedDisposalOffset;
module.exports.calculateAmountAfterTax = calculateAmountAfterTax;
module.exports.calculateTotalContributions = calculateTotalContributions;
module.exports.loadChart = loadChart;
module.exports.submit = submit;

if (typeof document !== 'undefined') {
    var submitBtn = document.getElementById('submit');
    submitBtn.onclick = function() {
        submit();
    };
}

},{}]},{},[1]);
