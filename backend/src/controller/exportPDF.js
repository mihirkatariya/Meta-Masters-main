import PDFDocument from 'pdfkit';

export async function exportEventPDF(req, res) {
  const doc = new PDFDocument({ margin: 50 });
  const filename = `${req.event.name.replace(/\s+/g, '_')}_details.pdf`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/pdf');
  
  doc.pipe(res);

  // Title Section
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(`Event Details`, { align: 'center' })
    .moveDown(1);

  // Event Information
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(`Event: ${req.event.name}`)
    .moveDown(0.5)
    .font('Helvetica')
    .text(`Location: ${req.event.location}`)
    .text(`Start Date: ${new Date(req.event.startDate).toDateString()}`)
    .text(`End Date: ${new Date(req.event.endDate).toDateString()}`)
    .moveDown(1);

  // Checklist Section
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(`Checklist`, { underline: true })
    .moveDown(0.5);

  if (req.event.checklist.length > 0) {
    req.event.checklist.forEach((item, index) => {
      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`${index + 1}. ${item.name} [${item.status}]`);
    });
  } else {
    doc.fontSize(12).text(`No checklist items available.`);
  }

  doc.moveDown(1);

  // Members Section
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(`Members`, { underline: true })
    .moveDown(0.5);

  if (req.event.members.length > 0) {
    req.event.members.forEach((member, index) => {
      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`${index + 1}. ${member.user.name || 'N/A'} (${member.user.email}) - Role: ${member.role}`);
    });
  } else {
    doc.fontSize(12).text(`No members available.`);
  }

  // Footer
  doc
    .moveDown(2)
    .fontSize(10)
    .font('Helvetica-Oblique')
    .text(`Generated on: ${new Date().toDateString()}`, { align: 'center' });

  doc.end();
}