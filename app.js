const express = require("express");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const pdf2html = require('pdf2html');
const app = express();
const gmailRouter = require("./routers/gmail");
const formsRouter = require("./routers/forms");

const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

app.use(gmailRouter);
app.use(formsRouter);

app.post("/pdftohtml", fileUpload(), async (req, res) => {
  const sampleFile = req.files.uploadedFile;
  const html = await pdf2html.html(sampleFile);
  // do something with file
  res.send({
    message: 'File converted success',
    data: html,
  });
});

// app.post("/htmltopdf", async (req, res) => {
//   const sampleFile = req.files.uploadedFile;
//   const html = await pdf2html.html(sampleFile);
//   // do something with file
//   res.send({
//     message: 'File converted success',
//     data: html,
//   });
// });

app.listen(port, () => {
  console.log(`Connection started on ${port}`);
});
