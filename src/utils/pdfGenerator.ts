import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { RosterEntry } from "../store/rosterStore";

interface PdfOptions {
  month: string;
  year: number;
  roster: RosterEntry[];
}

export async function generatePdf({
  month,
  year,
  roster,
}: PdfOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 50;

  let page = doc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const drawHeader = () => {
    page.drawText("Deployment Duty Roster", {
      x: margin,
      y,
      size: 20,
      font: fontBold,
      color: rgb(0.1, 0.7, 0.85),
    });
    y -= 28;
    page.drawText(`${month} ${year}`, {
      x: margin,
      y,
      size: 13,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 36;
  };

  drawHeader();

  // Table header
  const colX = [margin, margin + 100, margin + 220];
  const headers = ["Date", "Day", "Assigned Engineer"];
  headers.forEach((h, i) => {
    page.drawText(h, {
      x: colX[i],
      y,
      size: 10,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });
  });
  y -= 6;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 18;

  for (const entry of roster) {
    if (y < margin + 40) {
      page = doc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    page.drawText(entry.date, {
      x: colX[0],
      y,
      size: 9,
      font,
      color: rgb(0.25, 0.25, 0.25),
    });
    page.drawText(entry.day, {
      x: colX[1],
      y,
      size: 9,
      font,
      color: rgb(0.25, 0.25, 0.25),
    });
    page.drawText(entry.engineer, {
      x: colX[2],
      y,
      size: 9,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 20;
  }

  return doc.save();
}
