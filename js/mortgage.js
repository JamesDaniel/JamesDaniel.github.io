const main = require('./main');

function submit() {
    document.getElementsByClassName('chart')[0].style.display='block';
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    let monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    const years = parseFloat(document.getElementById('years').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value);
    const propertyValue = parseFloat(document.getElementById('propertyValue').value);
    const mortgageRepayments = parseFloat(document.getElementById('mortgageRepayments').value);
    const mortgageDuration = parseFloat(document.getElementById('mortgageDuration').value);
    const rentalIncome = parseFloat(document.getElementById('rentalIncome').value);
    monthlyContribution = monthlyContribution + rentalIncome;
    const interestAmounts = [];
    const monthlyContributions = main.getMonthlyContributions(monthlyContribution, years, mortgageDuration, mortgageRepayments);
    const deemedDisposalAdjustment = main.calculateDeemedDisposalOffset(initialInvestment, monthlyContributions, years, interestRate, interestAmounts);
    let amountAfterTax = main.calculateAmountAfterTax(interestAmounts, deemedDisposalAdjustment[deemedDisposalAdjustment.length - 1]);
    amountAfterTax = amountAfterTax + propertyValue;
    document.getElementById('amountAfterTax').style.display='block';
    document.getElementById('amountAfterTax').innerHTML=`In ${years} years, you will have &euro;${main.formatNumber(amountAfterTax)} after tax including the value of your property`;
    
    const data = [{
        label: `Portfolio after tax`,
        data: deemedDisposalAdjustment,
        borderWidth: 3
    }]
    main.loadChart(data, main.getYearLabels(years+1));
}

module.exports.submit = submit;
