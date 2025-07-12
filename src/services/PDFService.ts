// ============================================================================
// PDF GENERATION SERVICE
// ============================================================================

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { TicketData, AppError, ErrorType } from '../types';
import { logger } from '../utils/logger';

/**
 * PDFService class handles all PDF generation operations
 * This modernizes the original PDF generation with better structure and error handling
 */
export class PDFService {
  private logoPath: string;

  constructor() {
    this.logoPath = path.join(process.cwd(), 'assets', 'logo.png');
  }

  /**
   * Generate a ticket PDF for a passenger
   * This improves the original PDF generation with better structure
   */
  public async generateTicket(ticketData: TicketData): Promise<string> {
    try {
      logger.info(`Generating PDF ticket for: ${ticketData.passengerName}`);
      
      // Create output directory if it doesn't exist
      const outputDir = path.join(process.cwd(), 'tickets');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Generate filename
      const filename = `${ticketData.passengerName.replace(/\s+/g, '_')}_ticket.pdf`;
      const filePath = path.join(outputDir, filename);

      // Create PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });

      // Pipe to file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Generate PDF content
      await this.generatePDFContent(doc, ticketData);

      // Finalize PDF
      doc.end();

      // Wait for stream to finish
      await new Promise<void>((resolve, reject) => {
        stream.on('finish', () => {
          logger.success(`PDF ticket generated: ${filename}`);
          resolve();
        });
        stream.on('error', reject);
      });

      return filePath;
    } catch (error) {
      logger.error('Failed to generate PDF ticket', error as Error);
      throw new AppError(
        'PDF generation failed',
        ErrorType.UNKNOWN_ERROR,
        error as Error
      );
    }
  }

  /**
   * Generate the PDF content with proper formatting
   * This improves the original PDF content generation
   */
  private async generatePDFContent(doc: PDFDocument, ticketData: TicketData): Promise<void> {
    try {
      // Add logo if exists
      if (fs.existsSync(this.logoPath)) {
        doc.image(this.logoPath, 50, 45, { width: 50 });
      }

      // Header
      doc
        .fillColor('#444444')
        .fontSize(20)
        .text('IRCTC e-Ticketing Service', 110, 57)
        .fontSize(16)
        .text('Electronic Reservation Slip', 110, 80)
        .fontSize(10);

      // Transaction details
      doc
        .text(`Transaction ID: ${ticketData.transactionId}`, 400, 65, { align: 'right' })
        .text(`PNR No: ${ticketData.pnrNumber}`, 400, 80, { align: 'right' })
        .moveDown();

      // Passenger table
      const tableData = {
        headers: ['Name', 'Age', 'Gender', 'Booking Status'],
        rows: [[
          ticketData.passengerName,
          ticketData.age,
          ticketData.gender,
          'CONFIRMED'
        ]]
      };

      // Generate table
      this.generateTable(doc, tableData, 50, 150);

      // Important information
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

      // Footer
      doc
        .moveDown(2)
        .fontSize(8)
        .text('Generated on: ' + new Date().toLocaleString(), { align: 'center' });

    } catch (error) {
      logger.error('Failed to generate PDF content', error as Error);
      throw new AppError(
        'PDF content generation failed',
        ErrorType.UNKNOWN_ERROR,
        error as Error
      );
    }
  }

  /**
   * Generate a table in the PDF
   * This improves the original table generation
   */
  private generateTable(doc: PDFDocument, data: { headers: string[], rows: string[][] }, x: number, y: number): void {
    const columnCount = data.headers.length;
    const columnSpacing = 15;
    const rowSpacing = 5;
    const usableWidth = 500;
    const columnContainerWidth = usableWidth / columnCount;
    const columnWidth = columnContainerWidth - columnSpacing;

    let currentY = y;

    // Headers
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

    // Header separator line
    doc
      .moveTo(x, currentY - rowSpacing * 0.5)
      .lineTo(x + usableWidth, currentY - rowSpacing * 0.5)
      .lineWidth(2)
      .stroke();

    // Rows
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

      // Row separator line
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

  /**
   * Get important information text
   * This centralizes the important information text
   */
  private getImportantInformation(): string {
    return `
    • One of the passengers booked on an E-ticket is required to present any of the five identity cards noted below in original during the train journey and same will be accepted as a proof of identity failing which all the passengers will be treated as travelling without ticket and shall be dealt as per extant Railway Rules. Valid IDs: Voter Identity Card / Passport / PAN Card / Driving License / Photo ID card issued by Central / State Govt. for their employees.
    
    • The accommodation booked is not transferable and is valid only if one of the ID card noted above is presented during the journey. The passenger should carry with him the Electronic Reservation Slip print out. In case the passenger does not carry the electronic reservation slip, a charge of Rs.50/- per ticket shall be recovered by the ticket checking staff and an excess fare ticket will be issued in lieu of that.
    
    • E-ticket cancellations are permitted through www.irctc.co.in by the user. In case e-ticket is booked through an agent, please contact respective agent for cancellations.
    
    • Just dial 139 from your landline, mobile & CDMA phones for railway enquiries.
    
    Contact us on: 24*7 Hrs. Customer Support at 011-23340000, MON - SAT(10 AM - 6 PM) 011-23345500/4787/4773/5800/8539/8543, Chennai Customer Care 044 - 25300000 or Mail To: care@irctc.co.in
    `;
  }

  /**
   * Generate multiple tickets for all passengers
   */
  public async generateMultipleTickets(ticketsData: TicketData[]): Promise<string[]> {
    const generatedFiles: string[] = [];

    for (const ticketData of ticketsData) {
      try {
        const filePath = await this.generateTicket(ticketData);
        generatedFiles.push(filePath);
      } catch (error) {
        logger.error(`Failed to generate ticket for ${ticketData.passengerName}`, error as Error);
        // Continue with other tickets even if one fails
      }
    }

    return generatedFiles;
  }
} 