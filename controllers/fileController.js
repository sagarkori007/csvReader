const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Singleton object to store uploaded files
const fileStorage = {
  uploadedFiles: [],
};

// Display home page with file content or file list
module.exports.home = async (req, res) => {
  try {
    console.log('home started');
    return res.render('home', { files: fileStorage.uploadedFiles, fileContent: [] });
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
      .on('end', () => {
        // Save the data and file information to the singleton object
        fileStorage.uploadedFiles.push({ filename: file.originalname, data });

        console.log('Parsed Data:', data);
        return res.redirect('back');
      });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.displayFile = async (req, res) => {
    try {
      // Get the filename from the route parameter
      const filename = req.params.filename; 
      
      // Find the selected file in the uploadedFiles array
      const selectedFile = fileStorage.uploadedFiles.find(file => file.filename === filename);
  
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
