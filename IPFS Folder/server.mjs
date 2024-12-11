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

// Route: Upload files to IPFS and create a folder
// app.post('/upload', upload.array('files'), async (req, res) => {
//     try {
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ error: 'No files uploaded' });
//         }

//         // Prepare the files to be added to IPFS
//         const files = req.files;
//         const filesToAdd = [];

//         for (const file of files) {
//             const fileContent = fs.readFileSync(file.path); // Read file content
//             filesToAdd.push({ path: file.originalname, content: fileContent });
//         }

//         // Use ipfs.addAll to add files
//         const addedFiles = [];
//         for await (const result of ipfs.addAll(filesToAdd, { wrapWithDirectory: true })) {
//             // Check if result has 'cid'
//             if (result.cid) {
//                 addedFiles.push({ path: result.path, cid: result.cid.toString() });
//             }
//         }

//         if (addedFiles.length === 0) {
//             return res.status(500).json({ error: 'No files were added to IPFS' });
//         }

//         // After adding all files, the CID of the directory (folder) is returned by ipfs.addAll
//         const folderCID = addedFiles[0].cid; // Assuming folder CID is the same for all files in the directory

//         // Send response with the folder CID and files' CIDs
//         res.json({ folderCID, files: addedFiles });

//     } catch (error) {
//         console.error('Error adding files to IPFS:', error);
//         res.status(500).json({ error: 'Error adding files to IPFS', details: error.message });
//     }
// });



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
            return res.status(500).json({ error: 'No files were added to IPFS' });
        }

        // Assuming folder CID is the same for all files in the directory
        const folderCID = addedFiles[0].cid;

        res.json({ folderCID, files: addedFiles });
    } catch (error) {
        console.error('Error adding files to IPFS:', error);
        res.status(500).json({ error: 'Error adding files to IPFS', details: error.message });
    }
});

// Route: Update an existing folder with new files
// app.post('/update-folder', upload.array('files'), async (req, res) => {
//     try {
//         const existingFolderCID = req.body.existingFolderCID; // Retrieve the CID of the existing folder

//         if (!existingFolderCID) {
//             return res.status(400).json({ error: 'No existing folder CID provided' });
//         }

//         console.log('Existing Folder CID:', existingFolderCID);  // Debug log

//         // Prepare the files to be added to IPFS
//         const files = req.files;
//         const filesToAdd = [];

//         for (const file of files) {
//             const fileContent = fs.readFileSync(file.path); // Read file content
//             filesToAdd.push({ path: file.originalname, content: fileContent });
//         }

//         // Add files to IPFS
//         const addedFiles = [];
//         for await (const result of ipfs.addAll(filesToAdd, { pin: false })) {
//             if (result.cid) {
//                 addedFiles.push({ path: result.path, cid: result.cid.toString() });
//             }
//         }

//         if (addedFiles.length === 0) {
//             return res.status(500).json({ error: 'No files were added to IPFS' });
//         }

//         console.log('Added Files:', addedFiles);  // Debug log

//         // Return the same folder CID for now (can later be updated with new folder CID logic)
//         const updatedFolderCID = existingFolderCID;  // Ideally, here you should handle folder update logic

//         res.json({ updatedFolderCID, files: addedFiles });  // Sending the updated folder CID and the newly added files
//     } catch (error) {
//         console.error('Error updating folder:', error);
//         res.status(500).json({ error: 'Error updating folder', details: error.message });
//     }
// });

app.post('/update-folder', upload.array('files'), async (req, res) => {
    try {
        const existingFolderCID = req.body.existingFolderCID; // Retrieve the CID of the existing folder

        if (!existingFolderCID) {
            return res.status(400).json({ error: 'No existing folder CID provided' });
        }

        console.log('Existing Folder CID:', existingFolderCID);  // Debug log

        // Retrieve the content of the existing folder using CID
        const existingFolderContent = [];
        for await (const file of ipfs.ls(existingFolderCID)) {
            existingFolderContent.push({ path: file.name, cid: file.cid });
        }

        console.log('Existing Folder Content:', existingFolderContent);  // Debug log

        // Prepare the new files to be added to IPFS
        const files = req.files;
        const filesToAdd = [];

        for (const file of files) {
            const fileContent = fs.readFileSync(file.path); // Read file content
            filesToAdd.push({ path: file.originalname, content: fileContent });
        }

        // Add new files to IPFS
        const addedFiles = [];
        for await (const result of ipfs.addAll(filesToAdd, { pin: false })) {
            if (result.cid) {
                addedFiles.push({ path: result.path, cid: result.cid.toString() });
            }
        }

        if (addedFiles.length === 0) {
            return res.status(500).json({ error: 'No files were added to IPFS' });
        }

        console.log('Added Files:', addedFiles);  // Debug log

        // Combine existing folder content and new files
        const combinedFiles = [...existingFolderContent, ...addedFiles];

        // Add the combined files to IPFS as a new folder
        const updatedFolderResult = [];
        for await (const result of ipfs.addAll(combinedFiles, { wrapWithDirectory: true })) {
            updatedFolderResult.push(result);
        }

        const newFolderCID = updatedFolderResult.pop().cid.toString();  // Get the CID of the updated folder

        res.json({ updatedFolderCID: newFolderCID, files: addedFiles });  // Sending the new folder CID and newly added files
    } catch (error) {
        console.error('Error updating folder:', error);
        res.status(500).json({ error: 'Error updating folder', details: error.message });
    }
});



// Start the server
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

