const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const { Octokit } = require("@octokit/rest");

async function generatePDF() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  // Fetch issues opened and closed yesterday
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - 1);
  const since = sinceDate.toISOString();

  const { data: issuesOpened } = await octokit.issues.listForRepo({
    owner: 'YOUR-REPO-OWNER',
    repo: 'YOUR-REPO-NAME',
    since,
    state: 'open',
  });

  const { data: issuesClosed } = await octokit.issues.listForRepo({
    owner: 'YOUR-REPO-OWNER',
    repo: 'YOUR-REPO-NAME',
    since,
    state: 'closed',
  });

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  // Add text to the PDF
  const fontSize = 12;
  page.drawText(`Issues opened since yesterday: ${issuesOpened.length}\nIssues closed since yesterday: ${issuesClosed.length}`, {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Write the PDF to a file
  fs.writeFileSync('issue-report.pdf', pdfBytes);
}

generatePDF().catch(console.error);
