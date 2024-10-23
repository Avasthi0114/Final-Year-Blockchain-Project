import express from 'express';
import { storeFile, getFile } from './Functions.mjs';
import cors from 'cors';
import multer from 'multer'; // Import multer for file uploads
import bodyParser from 'body-parser';

const app = express();
const port = 4300; // New port number for the server

app.use(cors('*'));
app.use(bodyParser.json({ limit: '50mb' })); // Set maximum payload size to 50MB

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }); // Configure multer with memory storage

app.get('/', (req, res) => {
    res.send('Welcome to the IPFS CMS!');
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('File:', req.file);
        
        const fileContent = req.file.buffer; // Get the file content from multer's buffer

        // Store the file using the IPFS function
        const evidenceCID = await storeFile(fileContent);
        console.log(evidenceCID);

        res.send(evidenceCID); // Send the response with the CID
    } catch (error) {
        console.error('Error adding file:', error);
        res.status(500).send(error);
    }
});

app.post('/getFile', async (req, res) => {
    try {
        const evidenceCID = req.body.evidenceCID;
        const data = await getFile(evidenceCID);

        // Send the base64 encoded buffer to the client
        res.send({ fileBuffer: data.fileBuffer });
    } catch (error) {
        console.error('Error getting file:', error);
        res.status(500).send(error);
    }
});


app.listen(port, () => {
    console.log('Server is running on port ',{port});
});