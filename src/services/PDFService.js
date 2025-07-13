const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');

class PDFService {
  constructor() {
    this.logoPath = path.join(process.cwd(), 'assets', 'logo.png');
  }

  async generateTicket(ticketData) {
    try {
      logger.info(`Generating PDF ticket for: ${ticketData.passengerName}`);
      const outputDir = path.join(process.cwd(), 'tickets');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const filename = `${ticketData.passengerName.replace(/\s+/g, '_')}_ticket.pdf`;
      const filePath = path.join(outputDir, filename);
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      await this.generatePDFContent(doc, ticketData);
      doc.end();
      await new Promise((resolve, reject) => {
        stream.on('finish', () => {
          logger.success(`PDF ticket generated: ${filename}`);
          resolve();
        });
        stream.on('error', reject);
      });
      return filePath;
    } catch (error) {
      logger.error('Failed to generate PDF ticket', error);
      throw new Error('PDF generation failed');
    }
  }

  async generatePDFContent(doc, ticketData) {
    try {
      if (fs.existsSync(this.logoPath)) {
        doc.image(this.logoPath, 50, 45, { width: 50 });
      }
      doc
        .fillColor('#444444')
        .fontSize(20)
        .text('IRCTC e-Ticketing Service', 110, 57)
        .fontSize(16)
        .text('Electronic Reservation Slip', 110, 80)
        .fontSize(10);
      doc
        .text(`Transaction ID: ${ticketData.transactionId}`, 400, 65, { align: 'right' })
        .text(`PNR No: ${ticketData.pnrNumber}`, 400, 80, { align: 'right' })
        .moveDown();
      const tableData = {
        headers: ['Name', 'Age', 'Gender', 'Booking Status'],
        rows: [[
          ticketData.passengerName,
          ticketData.age,
          ticketData.gender,
          'CONFIRMED'
        ]]
      };
      this.generateTable(doc, tableData, 50, 150);
      doc
        .moveDown(2)
        .fontSize(10)
        .text('Important Information:', { underline: true })
        .moveDown(0.5)
        .fontSize(8)
        .text(this.getImportantInformation(), {
          width: 500,
          align: 'justify'
        });
      doc
        .moveDown(2)
        .fontSize(8)
        .text('Generated on: ' + new Date().toLocaleString(), { align: 'center' });
    } catch (error) {
      logger.error('Failed to generate PDF content', error);
      throw new Error('PDF content generation failed');
    }
  }

  generateTable(doc, data, x, y) {
    const columnCount = data.headers.length;
    const columnSpacing = 15;
    const rowSpacing = 5;
    const usableWidth = 500;
    const columnContainerWidth = usableWidth / columnCount;
    const columnWidth = columnContainerWidth - columnSpacing;
    let currentY = y;
    data.headers.forEach((header, i) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(header, x + i * columnContainerWidth, currentY, {
          width: columnWidth,
          align: 'left'
        });
    });
    currentY += 20;
    doc
      .moveTo(x, currentY - rowSpacing * 0.5)
      .lineTo(x + usableWidth, currentY - rowSpacing * 0.5)
      .lineWidth(2)
      .stroke();
    data.rows.forEach((row, rowIndex) => {
      row.forEach((cell, i) => {
        doc
          .font('Helvetica')
          .fontSize(9)
          .text(cell, x + i * columnContainerWidth, currentY, {
            width: columnWidth,
            align: 'left'
          });
      });
      currentY += 20;
      if (rowIndex < data.rows.length - 1) {
        doc
          .moveTo(x, currentY - rowSpacing * 0.5)
          .lineTo(x + usableWidth, currentY - rowSpacing * 0.5)
          .lineWidth(1)
          .opacity(0.7)
          .stroke()
          .opacity(1);
      }
    });
  }

  getImportantInformation() {
    return `
    • One of the passengers booked on an E-ticket is required to present any of the five identity cards noted below in original during the train journey and same will be accepted as a proof of identity failing which all the passengers will be treated as travelling without ticket and shall be dealt as per extant Railway Rules. Valid IDs: Voter Identity Card / Passport / PAN Card / Driving License / Photo ID card issued by Central / State Govt. for their employees.
    
    • The accommodation booked is not transferable and is valid only if one of the ID card noted above is presented during the journey. The passenger should carry with him the Electronic Reservation Slip print out. In case the passenger does not carry the electronic reservation slip, a charge of Rs.50/- per ticket shall be recovered by the ticket checking staff and an excess fare ticket will be issued in lieu of that.
    
    • E-ticket cancellations are permitted through www.irctc.co.in by the user. In case e-ticket is booked through an agent, please contact respective agent for cancellations.
    
    • Just dial 139 from your landline, mobile & CDMA phones for railway enquiries.
    
    Contact us on: 24*7 Hrs. Customer Support at 011-23340000, MON - SAT(10 AM - 6 PM) 011-23345500/4787/4773/5800/8539/8543, Chennai Customer Care 044 - 25300000 or Mail To: care@irctc.co.in
    `;
  }

  async generateMultipleTickets(ticketsData) {
    const generatedFiles = [];
    for (const ticketData of ticketsData) {
      try {
        const filePath = await this.generateTicket(ticketData);
        generatedFiles.push(filePath);
      } catch (error) {
        logger.error(`Failed to generate ticket for ${ticketData.passengerName}`, error);
      }
    }
    return generatedFiles;
  }
}

module.exports = { PDFService }; 