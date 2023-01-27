const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const pdf2html = require('pdf2html');
const app = express();
require("./src/db/conn");
const gmailRouter = require("./src/routers/gmail");
const formsRouter = require("./src/routers/forms");

const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

app.use(gmailRouter);
app.use(formsRouter);


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
