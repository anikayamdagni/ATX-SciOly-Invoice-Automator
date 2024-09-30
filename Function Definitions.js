function createInvoiceDocs(){  // for creating invoice google docs
  rows.forEach(function(row, index){
    console.log("New Invoice Started");
    if(index === 0) return;
    if(row[0] === "") return;

    const docscopy = googleDocTemplate.makeCopy(`${row[2]} Div ${row[7]} Invoice`, docDestinationFolder);
    const doc = DocumentApp.openById(docscopy.getId());
    const body = doc.getBody();
    const now = new Date().toLocaleString();
    var numOfTeams = 0;
    var amt = 225;

    if (row[8] !== "") numOfTeams++;
    if (row[9] !== "") numOfTeams++;
    if (row[10] !== "") numOfTeams++;

    body.replaceText('{{School Name}}', row[2]);
    body.replaceText('{{Address}}', row[4]);
    body.replaceText('{{City}}', row[5]);
    body.replaceText('{{State}}', row[3]);
    body.replaceText('{{ZIP Code}}', row[6]);
    body.replaceText('{{Coach Name}}', row[11] + " " + row[12]);
    body.replaceText('{{Response Number}}', responsenumber)
    body.replaceText('{{Response Date}}', now);
    body.replaceText('{{How many teams will you be bringing}}', numOfTeams);
    if (row[2] === "Cypress Creek High School" || row[2] === "Cypress Falls High School") amt = 125;
    body.replaceText('{{amt}}', amt); //cannot add to template bc special cases for some schools
    body.replaceText('{{total}}', numOfTeams * amt);

    responsenumber++;

    doc.saveAndClose();
    const url = doc.getUrl();
    sheet.getRange(++index, docLinkRow + 1).setValue(url);
    console.log("Invoice URL Saved");
    //if doc w the same name exists, replace it every time it is run
    //use hasnext to send alert
  })
}

function createPDF() { // for creating invoice PDFs
    const docsInFolder = docDestinationFolder.getFiles();
    const pdfFolder = DriveApp.getFolderById(pdfFolderLink);
    console.log("Starting PDF Generation");
    
    while(docsInFolder.hasNext()){
      var nonpdfdoc = docsInFolder.next();
      var pdf = nonpdfdoc.getAs('application/pdf');
      pdfFolder.createFile(pdf.copyBlob());
    }
    console.log("Finished Generating PDFs")
    //if pdf w the same name exists, replace it every time it is run
}

function getIdFromUrl(url) { return url.match(/[-\w]{25,}/); }

function createEmailDrafts() { // for creating and sending the emails with invoices
  console.log("Starting to Send Emails");
  rows.forEach(function(row, index){
    if(index === 0) return;

    const email = DocumentApp.openById(emailTemplateLink);
    var emailBody = email.getText(); //unfortunately plain text :( could alternatively paste text directly as HTML

    emailBody = emailBody.replace('{{Coach First Name}}', row[11]);

    var toEmail = row[13]; //changed from 'anika@atxscioly.org' to row[13]
    const actualUrl = row[docLinkRow];
    Logger.log(getIdFromUrl(actualUrl));
    var file = DriveApp.getFileById(getIdFromUrl(actualUrl)); //look at note below
    GmailApp.createDraft(toEmail,'[ATX Science Olympiad] 2024 Invitational Tournament Invoice', emailBody, { 
      attachments: [file.getAs(MimeType.PDF)] //extracting ID from url in last column
    });
    sheet.getRange(++index, 20);
  })
  console.log("YAY! Finished Sending Emails");
}