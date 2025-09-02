// backend/utils/export.js
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Generate Excel export
const generateExcel = async (responses, userName) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ESG Questionnaire');
  
  // Add company name and date
  worksheet.mergeCells('A1:D1');
  worksheet.getCell('A1').value = `ESG Questionnaire - ${userName}`;
  worksheet.getCell('A1').font = { bold: true, size: 16 };
  
  worksheet.mergeCells('A2:D2');
  worksheet.getCell('A2').value = `Generated on: ${new Date().toLocaleDateString()}`;
  worksheet.getCell('A2').font = { italic: true };
  
  // Add headers
  const headers = [
    'Year',
    'Total Electricity (kWh)',
    'Renewable Electricity (kWh)',
    'Renewable Ratio (%)',
    'Total Fuel (liters)',
    'Carbon Emissions (T CO2e)',
    'Carbon Intensity (T CO2e/INR)',
    'Total Employees',
    'Female Employees',
    'Diversity Ratio (%)',
    'Avg Training Hours',
    'Community Investment (INR)',
    'Community Spend Ratio (%)',
    'Independent Board Members (%)',
    'Data Privacy Policy',
    'Total Revenue (INR)'
  ];
  
  worksheet.addRow(headers);
  
  // Style headers
  const headerRow = worksheet.getRow(3);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  
  // Add data rows
  responses.forEach(response => {
    worksheet.addRow([
      response.year,
      response.totalElectricityConsumption,
      response.renewableElectricityConsumption,
      response.renewableElectricityRatio,
      response.totalFuelConsumption,
      response.carbonEmissions,
      response.carbonIntensity,
      response.totalEmployees,
      response.femaleEmployees,
      response.diversityRatio,
      response.avgTrainingHours,
      response.communityInvestmentSpend,
      response.communitySpendRatio,
      response.independentBoardMembersPercent,
      response.hasDataPrivacyPolicy ? 'Yes' : 'No',
      response.totalRevenue
    ]);
  });
  
  // Auto-fit columns
  worksheet.columns.forEach(column => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, cell => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });
  
  return workbook;
};

// Generate PDF export
const generatePDF = async (responses, userName) => {
  const doc = new PDFDocument();
  
  // Add title
  doc.fontSize(20).text('ESG Questionnaire', 50, 50);
  doc.fontSize(12).text(`Company: ${userName}`, 50, 80);
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 100);
  
  let yPosition = 140;
  
  responses.forEach(response => {
    // Add year heading
    doc.fontSize(16).text(`Financial Year: ${response.year}`, 50, yPosition);
    yPosition += 30;
    
    // Environmental metrics
    doc.fontSize(14).text('Environmental Metrics', 50, yPosition);
    yPosition += 20;
    
    doc.fontSize(12).text(`Total Electricity Consumption: ${response.totalElectricityConsumption || 'N/A'} kWh`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Renewable Electricity Consumption: ${response.renewableElectricityConsumption || 'N/A'} kWh`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Renewable Electricity Ratio: ${response.renewableElectricityRatio ? response.renewableElectricityRatio.toFixed(2) + '%' : 'N/A'}`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Total Fuel Consumption: ${response.totalFuelConsumption || 'N/A'} liters`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Carbon Emissions: ${response.carbonEmissions || 'N/A'} T CO2e`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Carbon Intensity: ${response.carbonIntensity ? response.carbonIntensity.toFixed(6) + ' T CO2e/INR' : 'N/A'}`, 70, yPosition);
    yPosition += 30;
    
    // Social metrics
    doc.fontSize(14).text('Social Metrics', 50, yPosition);
    yPosition += 20;
    
    doc.fontSize(12).text(`Total Employees: ${response.totalEmployees || 'N/A'}`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Female Employees: ${response.femaleEmployees || 'N/A'}`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Diversity Ratio: ${response.diversityRatio ? response.diversityRatio.toFixed(2) + '%' : 'N/A'}`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Average Training Hours: ${response.avgTrainingHours || 'N/A'}`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Community Investment Spend: ${response.communityInvestmentSpend || 'N/A'} INR`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Community Spend Ratio: ${response.communitySpendRatio ? response.communitySpendRatio.toFixed(2) + '%' : 'N/A'}`, 70, yPosition);
    yPosition += 30;
    
    // Governance metrics
    doc.fontSize(14).text('Governance Metrics', 50, yPosition);
    yPosition += 20;
    
    doc.fontSize(12).text(`Independent Board Members: ${response.independentBoardMembersPercent || 'N/A'}%`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Data Privacy Policy: ${response.hasDataPrivacyPolicy ? 'Yes' : response.hasDataPrivacyPolicy === false ? 'No' : 'N/A'}`, 70, yPosition);
    yPosition += 20;
    
    doc.text(`Total Revenue: ${response.totalRevenue || 'N/A'} INR`, 70, yPosition);
    yPosition += 40;
    
    // Add page break if needed
    if (yPosition > 700) {
      doc.addPage();
      yPosition = 50;
    }
  });
  
  return doc;
};

module.exports = { generateExcel, generatePDF };

