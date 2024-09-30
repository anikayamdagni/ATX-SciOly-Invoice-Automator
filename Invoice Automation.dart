// for creating invoice google docs
const docTemplateLink = "1NbMvYSLCNu37oIxBTDkyHvR9rXP_3pKPr3SiDd4pISU";
const googleDocTemplate = DriveApp.getFileById(docTemplateLink);
const docDestinationFolderLink = "13y_31oDpjjqHpZkn-fEl_IXo18yEgqw4";
const docDestinationFolder = DriveApp.getFolderById(docDestinationFolderLink);
const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1');
const rows = sheet.getDataRange().getValues();
const docLinkRow = 18;
var responsenumber = 1;

// for creating invoice PDFs
const pdfFolderLink = "1RT4StKDPXapcdi5vBBL_3cckKoENnu0T";

// for creating and sending the emails with invoices
emailTemplateLink = "1hYsBAvChOpKjIWNHk2rU2wHbGCdtKqHrNmjDLweFbeA";
const emailTemplate = DriveApp.getFileById(emailTemplateLink);

function onOpen() {

  // createInvoiceDocs();
  // createPDF();  
  createEmailDrafts();
}