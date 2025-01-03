import express from 'express';
import multer from 'multer';
import { create } from 'ipfs-http-client';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

// Initialize IPFS client
const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Route: Retrieve folder contents from IPFS
app.get('/folder/:cid', async (req, res) => {
    try {
        const folderCID = req.params.cid;
        const files = [];
        for await (const file of ipfs.ls(folderCID)) {
            files.push({ name: file.name, cid: file.cid.toString() });
        }
        res.json({ folderCID, files });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve folder contents.' });
    }
});

// Route: Upload files to IPFS and create a folder
app.post('/upload', upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            console.log('No files uploaded');
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Prepare the files to be added to IPFS
        const files = req.files;
        const filesToAdd = [];

        for (const file of files) {
            const fileContent = fs.readFileSync(file.path); // Read file content
            filesToAdd.push({ path: file.originalname, content: fileContent });
        }

        // Use ipfs.addAll to add files
        const addedFiles = [];
        for await (const result of ipfs.addAll(filesToAdd, { wrapWithDirectory: true })) {
            if (result.cid) {
                addedFiles.push({ path: result.path, cid: result.cid.toString() });
            }
        }

        if (addedFiles.length === 0) {
            console.log('No files were added to IPFS');
            return res.status(500).json({ error: 'No files were added to IPFS' });
        }

        // Log file addition to IPFS
        console.log('Files added to IPFS:', addedFiles);

        // Delete files from the uploads folder
        files.forEach(file => {
            try {
                fs.unlinkSync(file.path);
                console.log(`Deleted file: ${file.path}`);
            } catch (error) {
                console.error(`Failed to delete file: ${file.path}`, error.message);
            }
        });

        // Assuming folder CID is the same for all files in the directory
        const folderCID = addedFiles[0].cid;

        res.json({ folderCID, files: addedFiles });
    } catch (error) {
        console.error('Error adding files to IPFS:', error);
        res.status(500).json({ error: 'Error adding files to IPFS', details: error.message });
    }
});


app.post('/update-folder', upload.array('files'), async (req, res) => {
    try {
        const existingFolderCID = req.body.existingFolderCID; // Retrieve the CID of the existing folder

        if (!existingFolderCID) {
            console.log('No existing folder CID provided'); // Debug log
            return res.status(400).json({ error: 'No existing folder CID provided' });
        }

        console.log('Existing Folder CID:', existingFolderCID); // Debug log

        // Retrieve the content of the existing folder using CID
        const existingFolderContent = [];
        for await (const file of ipfs.ls(existingFolderCID)) {
            existingFolderContent.push({ path: file.name, cid: file.cid });
        }

        console.log('Existing Folder Content:', existingFolderContent); // Debug log

        // Prepare the new files to be added to IPFS
        const files = req.files;
        const filesToAdd = [];

        for (const file of files) {
            const fileContent = fs.readFileSync(file.path); // Read file content
            filesToAdd.push({ path: file.originalname, content: fileContent });
        }

        console.log('New Files to Add:', filesToAdd); // Debug log

        // Add new files to IPFS
        const addedFiles = [];
        for await (const result of ipfs.addAll(filesToAdd, { pin: false })) {
            if (result.cid) {
                addedFiles.push({ path: result.path, cid: result.cid.toString() });
            }
        }

        if (addedFiles.length === 0) {
            console.log('No files were added to IPFS'); // Debug log
            return res.status(500).json({ error: 'No files were added to IPFS' });
        }

        console.log('Added Files:', addedFiles); // Debug log

        // Delete uploaded files from the uploads folder
        files.forEach(file => {
            try {
                fs.unlinkSync(file.path);
                console.log(`Deleted file: ${file.path}`);
            } catch (error) {
                console.error(`Failed to delete file: ${file.path}`, error.message);
            }
        });

        // Combine existing folder content and new files
        const combinedFiles = [...existingFolderContent, ...addedFiles];

        // Add the combined files to IPFS as a new folder
        const updatedFolderResult = [];
        for await (const result of ipfs.addAll(combinedFiles, { wrapWithDirectory: true })) {
            updatedFolderResult.push(result);
        }

        const newFolderCID = updatedFolderResult.pop().cid.toString(); // Get the CID of the updated folder

        console.log('Updated Folder CID:', newFolderCID); // Debug log

        res.json({ updatedFolderCID: newFolderCID, files: addedFiles }); // Sending the new folder CID and newly added files
    } catch (error) {
        console.error('Error updating folder:', error);
        res.status(500).json({ error: 'Error updating folder', details: error.message });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});