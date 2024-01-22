// Import necessary modules
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const FileDetails = require('../models/FileDetails'); // Import the Mongoose model

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Singleton object to store uploaded files
const fileStorage = {
  uploadedFiles: [],
};

// Display home page with file content or file list
module.exports.home = async (req, res) => {
  try {
    // Retrieve file details from MongoDB
    const filesFromDB = await FileDetails.find();
    return res.render('home', { files: filesFromDB, fileContent: [] });
  } catch (error) {
    console.error('Error in loading the home', error);
    res.status(500).send('Internal Server Error');
  }
};

// Middleware for file upload
module.exports.uploadCSV = upload.single('csvFile');

// Process uploaded CSV file
module.exports.processCSV = async (req, res) => {
  try {
    const file = req.file;
    const filePath = file.path;

    const data = [];

    fs.createReadStream(filePath, { encoding: 'utf-8' })
      .pipe(csvParser())
      .on('data', (row) => {
        data.push(row);
      })
      .on('end', async () => {
        // Save the data and file information to MongoDB
        const fileDetails = new FileDetails({
          filename: file.originalname,
          data: data,
        });

        await fileDetails.save();

        console.log('Parsed Data:', data);
        return res.redirect('back');
      });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Display content of a specific file
module.exports.displayFile = async (req, res) => {
  try {
    const filename = req.params.filename;

    // Find the selected file in the MongoDB collection
    const selectedFile = await FileDetails.findOne({ filename });

    if (selectedFile) {
      const fileContent = selectedFile.data;
      console.log(fileContent);

      // Render a new page to display the file content
      res.render('fileDisplay', { filename, fileContent });
    } else {
      console.log('Selected file not found');
      return res.status(404).send('File not found');
    }
  } catch (error) {
    console.error('Error in displaying file content', error);
    res.status(500).send('Internal Server Error');
  }
};
