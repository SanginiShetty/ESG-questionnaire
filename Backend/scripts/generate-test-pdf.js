const htmlPdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

const htmlContent = `
<!DOCTYPE html>
<html>
<head>    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        h1 {
            color: #2c5282;
            text-align: center;
            margin-bottom: 30px;
        }
        h2 {
            color: #4a5568;
            margin-top: 30px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }
        .metric {
            margin: 15px 0;
        }
        .notes {
            margin-top: 30px;
            padding: 20px;
            background-color: #f7fafc;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <h1>ESG Performance Report 2025</h1>

    <h2>Environmental Metrics</h2>
    <div class="metric">Carbon Emissions: 125.3 tonnes CO2e</div>
    <div class="metric">Water Consumption: 45,670 cubic meters</div>
    <div class="metric">Energy Usage: 890,450 kWh</div>
    <div class="metric">Waste Generated: 34.2 tonnes</div>

    <h2>Social Metrics</h2>
    <div class="metric">Employee Turnover Rate: 12.5%</div>
    <div class="metric">Workplace Accidents: 3 incidents</div>
    <div class="metric">Diversity and Inclusion:</div>
    <div class="metric">• Female Representation: 38.7%</div>
    <div class="metric">• Minority Representation: 25.4%</div>

    <h2>Governance Metrics</h2>
    <div class="metric">Board Independence: 75.8%</div>
    <div class="metric">Executive Compensation Ratio: 24:1</div>

    <div class="notes">
        <h2>Additional Notes</h2>
        <div class="metric">• Carbon emissions decreased by 15% from previous year</div>
        <div class="metric">• Water consumption optimization programs implemented</div>
        <div class="metric">• New safety protocols resulted in 40% reduction in workplace accidents</div>
        <div class="metric">• Diversity initiatives showing positive trends</div>
        <div class="metric">• Board restructuring improved independence metrics</div>
    </div>
</body>
</html>
`;

const options = {
    format: 'A4',
    border: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
    }
};

// Create the test data directory if it doesn't exist
const testDataDir = path.join(__dirname, '..', 'test-data');
if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true });
}

const outputPath = path.join(testDataDir, 'sample-esg-report.pdf');

htmlPdf.create(htmlContent, options).toFile(outputPath, function(err, res) {
    if (err) {
        console.error('Error generating PDF:', err);
        return;
    }
    console.log('PDF successfully created:', res);
});
