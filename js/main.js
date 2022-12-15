function getYearLabels(numOfYears) {
    const years = [];
    for (let i=0; i<numOfYears; i++) {
        years.push(`Year ${i}`);
    }
    return years;
}
function calculateInterest(initialInvestment, monthlyContribution, numOfYears, interestRate) {
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

    const deemedDisposalAdjustment = [initialInvestment];
    const interestAmounts = [];
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
    const end = deemedDisposalAdjustment[numOfYears];
    let totalInterestGainedNotYetTaxed=0;
    for (let i = 0; i<interestAmounts.length; i++) {
        totalInterestGainedNotYetTaxed += interestAmounts[i];
    }
    let taxDue = totalInterestGainedNotYetTaxed*0.41;
    const amountAfterTax = end - taxDue;
    return {
        endOfYearInterest,
        deemedDisposalAdjustment,
        amountAfterTax
    };
}
function loadChart(data, interest) {
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
            label: `Future Value (${interest}%)`,
            data: data.endOfYearInterest,
            borderWidth: 3
        },{
            label: `Deemed Disposal Adjustment`,
            data: data.deemedDisposalAdjustment,
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
    const data = calculateInterest(initialInvestment, monthlyContribution, years, interestRate);
    document.getElementById('amountAfterTax').style.display='block';
    document.getElementById('amountAfterTax').innerHTML=`In ${years} years, you will have &euro;${formatNumber(data.amountAfterTax)} after tax`;
    loadChart(data, interestRate);
}

module.exports.getYearLabels = getYearLabels;
module.exports.calculateInterest = calculateInterest;
module.exports.loadChart = loadChart;
module.exports.formatNumber = formatNumber;
module.exports.submit = submit;

if (typeof document !== 'undefined') {
    var submitBtn = document.getElementById('submit');
    submitBtn.onclick = function() {
        submit();
    };
}
