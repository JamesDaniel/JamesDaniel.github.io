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
