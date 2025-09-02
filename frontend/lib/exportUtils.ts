import jsPDF from 'jspdf';
import ExcelJS from 'exceljs';
import { ESGResponse, SummaryData } from '@/types';

export const exportToPDF = (responses: ESGResponse[], summary: SummaryData, userName: string) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('ESG Questionnaire Report', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Generated for: ${userName}`, 105, 30, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });

  let yPosition = 60;

  // Summary Section
  doc.setFontSize(16);
  doc.text('Summary', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(`Total Records: ${summary.totalRecords}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Years Covered: ${summary.years.join(', ')}`, 20, yPosition);
  yPosition += 15;

  // Environmental Summary
  doc.setFontSize(14);
  doc.text('Environmental Performance', 20, yPosition);
  yPosition += 10;
  doc.setFontSize(12);
  doc.text(`Average Carbon Intensity: ${summary.environmental.avgCarbonIntensity?.toFixed(2) || 'N/A'} T CO2e/INR`, 20, yPosition);
  yPosition += 7;
  doc.text(`Average Renewable Ratio: ${summary.environmental.avgRenewableRatio?.toFixed(2) || 'N/A'}%`, 20, yPosition);
  yPosition += 7;
  doc.text(`Total Emissions: ${summary.environmental.totalEmissions?.toFixed(2) || 'N/A'} T CO2e`, 20, yPosition);
  yPosition += 15;

  // Add more sections as needed...

  // Detailed Data
  doc.addPage();
  yPosition = 20;
  doc.setFontSize(16);
  doc.text('Detailed Responses', 20, yPosition);
  yPosition += 15;

  responses.forEach((response, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text(`Year: ${response.year}`, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.text(`Carbon Emissions: ${response.carbonEmissions || 'N/A'} T CO2e`, 20, yPosition);
    yPosition += 7;
    doc.text(`Renewable Ratio: ${response.renewableElectricityRatio?.toFixed(2) || 'N/A'}%`, 20, yPosition);
    yPosition += 7;
    doc.text(`Diversity Ratio: ${response.diversityRatio?.toFixed(2) || 'N/A'}%`, 20, yPosition);
    yPosition += 15;
  });

  doc.save('esg-questionnaire-report.pdf');
};

export const exportToExcel = (responses: ESGResponse[], summary: SummaryData, userName: string) => {
  const workbook = new ExcelJS.Workbook();

  // Summary Sheet
  const summarySheet = workbook.addWorksheet('Summary');
  summarySheet.addRow(['ESG Questionnaire Report']);
  summarySheet.addRow(['Generated for:', userName]);
  summarySheet.addRow(['Generated on:', new Date().toLocaleDateString()]);
  summarySheet.addRow([]);
  summarySheet.addRow(['Summary']);
  summarySheet.addRow(['Total Records', summary.totalRecords]);
  summarySheet.addRow(['Years Covered', summary.years.join(', ')]);
  summarySheet.addRow([]);
  summarySheet.addRow(['Environmental Performance']);
  summarySheet.addRow(['Average Carbon Intensity', summary.environmental.avgCarbonIntensity]);
  summarySheet.addRow(['Average Renewable Ratio', summary.environmental.avgRenewableRatio]);
  summarySheet.addRow(['Total Emissions', summary.environmental.totalEmissions]);
  summarySheet.addRow([]);
  summarySheet.addRow(['Social Responsibility']);
  summarySheet.addRow(['Average Diversity Ratio', summary.social.avgDiversityRatio]);
  summarySheet.addRow(['Average Community Spend', summary.social.avgCommunitySpend]);
  summarySheet.addRow(['Total Community Spend', summary.social.totalCommunitySpend]);

  // Detailed Data Sheet
  const detailedSheet = workbook.addWorksheet('Detailed Data');
  detailedSheet.columns = [
    { header: 'Year', key: 'year' },
    { header: 'Total Electricity (kWh)', key: 'totalElectricity' },
    { header: 'Renewable Electricity (kWh)', key: 'renewableElectricity' },
    { header: 'Total Fuel (liters)', key: 'totalFuel' },
    { header: 'Carbon Emissions (T CO2e)', key: 'carbonEmissions' },
    { header: 'Total Employees', key: 'totalEmployees' },
    { header: 'Female Employees', key: 'femaleEmployees' },
    { header: 'Average Training Hours', key: 'averageTrainingHours' },
    { header: 'Community Investment (INR)', key: 'communityInvestment' },
    { header: 'Independent Board %', key: 'independentBoard' },
    { header: 'Has Data Privacy Policy', key: 'hasDataPrivacyPolicy' },
    { header: 'Total Revenue (INR)', key: 'totalRevenue' },
    { header: 'Carbon Intensity', key: 'carbonIntensity' },
    { header: 'Renewable Ratio %', key: 'renewableRatio' },
    { header: 'Diversity Ratio %', key: 'diversityRatio' },
    { header: 'Community Spend Ratio %', key: 'communitySpendRatio' },
  ];

  responses.forEach(response => {
    detailedSheet.addRow({
      year: response.year,
      totalElectricity: response.totalElectricityConsumption,
      renewableElectricity: response.renewableElectricityConsumption,
      totalFuel: response.totalFuelConsumption,
      carbonEmissions: response.carbonEmissions,
      totalEmployees: response.totalEmployees,
      femaleEmployees: response.femaleEmployees,
      averageTrainingHours: response.averageTrainingHours,
      communityInvestment: response.communityInvestmentSpend,
      independentBoard: response.independentBoardMembersPercent,
      hasDataPrivacyPolicy: response.hasDataPrivacyPolicy ? 'Yes' : 'No',
      totalRevenue: response.totalRevenue,
      carbonIntensity: response.carbonIntensity,
      renewableRatio: response.renewableElectricityRatio,
      diversityRatio: response.diversityRatio,
      communitySpendRatio: response.communitySpendRatio,
    });
  });

  // Save the workbook
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'esg-questionnaire-report.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  });
};