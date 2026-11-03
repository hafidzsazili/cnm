import { jsPDF } from 'jspdf';
import { Letter } from '../types';

export class PdfGeneratorService {
  static generateOfficialLetterPdf(letter: Letter): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // --- KOP SURAT RESMI CINEMIND ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(10, 10, 10);
    doc.text('HIMPUNAN MAHASISWA KAJIAN FILM, TELEVISI, DAN MEDIA', pageWidth / 2, 22, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(229, 9, 20); // Cinemind Red
    doc.text('CINEMIND', pageWidth / 2, 29, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('KABINET SINEMA LENTERA 2026/2027', pageWidth / 2, 34, { align: 'center' });
    doc.text('Gedung Pusat Kegiatan Mahasiswa Lt. 2, Kampus Terpadu | Surel: sekretariat@cinemind.ac.id', pageWidth / 2, 39, { align: 'center' });

    // Double Kop Border Lines
    doc.setDrawColor(229, 9, 20);
    doc.setLineWidth(0.8);
    doc.line(margin, 43, pageWidth - margin, 43);

    doc.setDrawColor(10, 10, 10);
    doc.setLineWidth(0.3);
    doc.line(margin, 44.5, pageWidth - margin, 44.5);

    // --- INFORMASI NOMOR & TANGGAL SURAT ---
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 30);

    const letterDateFormatted = new Date(letter.letterDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Right-aligned Date
    doc.text(`Jakarta, ${letterDateFormatted}`, pageWidth - margin, 53, { align: 'right' });

    // Left-aligned Meta
    doc.text('Nomor', margin, 53);
    doc.text(`:  ${letter.letterNumber}`, margin + 25, 53);

    doc.text('Lampiran', margin, 58);
    doc.text(':  -', margin + 25, 58);

    doc.text('Perihal', margin, 63);
    doc.setFont('helvetica', 'bold');
    doc.text(`:  ${letter.subject}`, margin + 25, 63);

    // --- PENERIMA (RECIPIENT) ---
    doc.setFont('helvetica', 'normal');
    let currentY = 75;
    doc.text('Kepada Yth.', margin, currentY);
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(letter.recipient, margin, currentY);
    currentY += 5;

    if (letter.recipientAddress) {
      doc.setFont('helvetica', 'normal');
      doc.text(letter.recipientAddress, margin, currentY);
      currentY += 5;
    }
    doc.setFont('helvetica', 'normal');
    doc.text('di Tempat', margin, currentY);
    currentY += 10;

    // --- SALAM PEMBUKA ---
    doc.text('Dengan hormat,', margin, currentY);
    currentY += 7;

    // --- ISI SURAT (BODY CONTENT) ---
    doc.setFont('helvetica', 'normal');
    const splitContent = doc.splitTextToSize(letter.content, pageWidth - (margin * 2));
    doc.text(splitContent, margin, currentY, {
      align: 'justify',
      lineHeightFactor: 1.4
    });

    currentY += (splitContent.length * 5) + 10;

    // --- SALAM PENUTUP ---
    if (currentY > 230) {
      doc.addPage();
      currentY = 30;
    }

    doc.text('Demikian surat ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama yang baik, kami ucapkan terima kasih.', margin, currentY, {
      maxWidth: pageWidth - (margin * 2)
    });
    currentY += 15;

    // --- TANDA TANGAN & LEGALITAS ---
    if (currentY > 230) {
      doc.addPage();
      currentY = 30;
    }

    const signX = pageWidth - margin - 60;
    doc.text('Hormat kami,', signX, currentY);
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(letter.signerRole, signX, currentY);
    
    // Stamp box simulation
    currentY += 8;
    doc.setDrawColor(229, 9, 20);
    doc.setLineWidth(0.4);
    doc.rect(signX - 5, currentY - 3, 24, 18);
    doc.setFontSize(7);
    doc.setTextColor(229, 9, 20);
    doc.text('TERVERIFIKASI', signX + 7, currentY + 3, { align: 'center' });
    doc.text('SIM-CINEMIND', signX + 7, currentY + 8, { align: 'center' });

    currentY += 22;
    doc.setFontSize(10);
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.text(letter.signerName, signX, currentY);
    
    if (letter.signerNim) {
      currentY += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.text(`NIM. ${letter.signerNim}`, signX, currentY);
    }

    // Bottom official watermark footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Dokumen ini sah dan diterbitkan secara resmi melalui Sistem Informasi Manajemen (SIM) CINEMIND KFTM.', pageWidth / 2, 285, { align: 'center' });

    return doc;
  }

  static downloadLetterPdf(letter: Letter): void {
    const doc = this.generateOfficialLetterPdf(letter);
    const safeFilename = `Surat_${letter.classificationCode}_${letter.sequenceNumber}_CINEMIND.pdf`.replace(/[\/\\:*?"<>|]/g, '_');
    doc.save(safeFilename);
  }
}
