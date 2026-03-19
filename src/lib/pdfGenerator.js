import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId, filename = 'resume.pdf') => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const element = document.getElementById(elementId);
        if (!element) {
          throw new Error('Resume element not found. Please try again.');
        }

        const originalScrollTop = window.scrollY;
        const originalScrollLeft = window.scrollX;
        
        element.scrollIntoView({ behavior: 'instant', block: 'start' });
        
        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById(elementId);
            if (clonedElement) {
              clonedElement.style.transform = 'none';
              clonedElement.style.width = '210mm';
            }
          }
        });

        window.scrollTo(originalScrollLeft, originalScrollTop);
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        const ratio = pdfWidth / imgWidth;
        const scaledHeight = imgHeight * ratio;
        
        if (scaledHeight <= pdfHeight) {
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
        } else {
          let heightLeft = scaledHeight;
          let position = 0;
          let pageNum = 0;
          
          while (heightLeft > 0) {
            if (pageNum > 0) {
              pdf.addPage();
            }
            
            pdf.addImage(
              imgData, 
              'PNG', 
              0, 
              position, 
              pdfWidth, 
              scaledHeight
            );
            
            heightLeft -= pdfHeight;
            position -= pdfHeight;
            pageNum++;
          }
        }
        
        pdf.save(filename);
        resolve();
      } catch (error) {
        console.error('PDF generation failed:', error);
        reject(error);
      }
    }, 200);
  });
};

export const generatePDFMultiPage = async (elementIds, filename = 'resume.pdf') => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        for (let i = 0; i < elementIds.length; i++) {
          const element = document.getElementById(elementIds[i]);
          if (!element) continue;
          
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
          });
          
          const imgData = canvas.toDataURL('image/png', 1.0);
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          
          const ratio = pdfWidth / imgWidth;
          const scaledHeight = imgHeight * ratio;
          
          if (i > 0) {
            pdf.addPage();
          }
          
          if (scaledHeight <= pdfHeight) {
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
          } else {
            let heightLeft = scaledHeight;
            let position = 0;
            let firstPage = i === 0;
            
            while (heightLeft > 0) {
              if (!firstPage || heightLeft < scaledHeight) {
                pdf.addPage();
              }
              pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
              heightLeft -= pdfHeight;
              position -= pdfHeight;
              firstPage = false;
            }
          }
        }
        
        pdf.save(filename);
        resolve();
      } catch (error) {
        console.error('PDF generation failed:', error);
        reject(error);
      }
    }, 200);
  });
};
