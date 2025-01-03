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
// app.use(express.static('routes'));

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

const generatedPdfDir = 'E:/FIR/BTech-eFIR-Management/Backend/generated_pdf';
app.post('/uploadToIPFS', async (req, res) => {
    try {
        const fileName = 'partialReport.pdf'; // Replace with the actual file name
        const filePath = path.join(generatedPdfDir, fileName);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            console.log('File does not exist:', filePath);
            return res.status(400).json({ error: `File not found: ${filePath}` });
        }

        // Read the file content
        const fileContent = fs.readFileSync(filePath);

        // Add the file to IPFS
        const fileResult = await ipfs.add({ path: fileName, content: fileContent });

        if (!fileResult.cid) {
            console.log('Failed to add file to IPFS');
            return res.status(500).json({ error: 'Failed to add file to IPFS' });
        }

        console.log('File added to IPFS:', fileResult);

        // Delete the file after adding it to IPFS
        try {
            fs.unlinkSync(filePath); // Delete the file from the local directory
            console.log(`Deleted file: ${filePath}`);
        } catch (error) {
            console.error(`Failed to delete file: ${filePath}`, error.message);
        }

        // Simulate a folder by adding the file with a folder-like structure
        const folderResult = await ipfs.addAll([
            { path: `generated_pdf/${fileName}`, content: fileContent }
        ], { wrapWithDirectory: true });

        // The folderCID will be the CID of the directory structure
        let folderCID = '';
        for await (const result of folderResult) {
            if (result.cid) {
                folderCID = result.cid.toString();
            }
        }

        if (!folderCID) {
            console.log('Failed to create folder in IPFS');
            return res.status(500).json({ error: 'Failed to create folder in IPFS' });
        }

        console.log('Folder and file added to IPFS:', folderCID);

        // Respond with both the file CID and the folder CID
        res.json({
            folderCID: folderCID,
            fileCID: fileResult.cid.toString(),
            path: fileResult.path,
        });
    } catch (error) {
        console.error('Error adding file to IPFS:', error);
        res.status(500).json({ error: 'Error adding file to IPFS', details: error.message });
    }
});

// app.post('/upload', async (req, res) => {
//     try {
//         // Specify the file name and path in the generated_pdf folder
//         const fileName = 'FIR.pdf'; // Replace with the actual file name
//         const filePath = path.join(generatedPdfDir, fileName);

//         // Check if the file exists
//         if (!fs.existsSync(filePath)) {
//             console.log('File does not exist:', filePath);
//             return res.status(400).json({ error: `File not found: ${fileName}` });
//         }

//         // Read the file content
//         const fileContent = fs.readFileSync(filePath);

//         // Add the file to IPFS
//         const result = await ipfs.add({ path: fileName, content: fileContent });

//         if (!result.cid) {
//             console.log('Failed to add file to IPFS');
//             return res.status(500).json({ error: 'Failed to add file to IPFS' });
//         }

//         console.log('File added to IPFS:', result);

//         // Respond with the file's CID
//         res.json({ cid: result.cid.toString(), path: result.path });
//     } catch (error) {
//         console.error('Error adding file to IPFS:', error);
//         res.status(500).json({ error: 'Error adding file to IPFS', details: error.message });
//     }
// });


// app.post('/update-folder', upload.array('files'), async (req, res) => {
//     try {
//         const existingFolderCID = req.body.existingFolderCID; // Retrieve the CID of the existing folder

//         if (!existingFolderCID) {
//             console.log('No existing folder CID provided'); // Debug log
//             return res.status(400).json({ error: 'No existing folder CID provided' });
//         }

//         console.log('Existing Folder CID:', existingFolderCID); // Debug log

//         // Retrieve the content of the existing folder using CID
//         const existingFolderContent = [];
//         for await (const file of ipfs.ls(existingFolderCID)) {
//             existingFolderContent.push({ path: file.name, cid: file.cid });
//         }

//         console.log('Existing Folder Content:', existingFolderContent); // Debug log

//         // Prepare the new files to be added to IPFS
//         const files = req.files;
//         const filesToAdd = [];

//         for (const file of files) {
//             const fileContent = fs.readFileSync(file.path); // Read file content
//             filesToAdd.push({ path: file.originalname, content: fileContent });
//         }

//         console.log('New Files to Add:', filesToAdd); // Debug log

//         // Add new files to IPFS
//         const addedFiles = [];
//         for await (const result of ipfs.addAll(filesToAdd, { pin: false })) {
//             if (result.cid) {
//                 addedFiles.push({ path: result.path, cid: result.cid.toString() });
//             }
//         }

//         if (addedFiles.length === 0) {
//             console.log('No files were added to IPFS'); // Debug log
//             return res.status(500).json({ error: 'No files were added to IPFS' });
//         }

//         console.log('Added Files:', addedFiles); // Debug log

//         // Delete uploaded files from the uploads folder
//         files.forEach(file => {
//             try {
//                 fs.unlinkSync(file.path);
//                 console.log(`Deleted file: ${file.path}`);
//             } catch (error) {
//                 console.error(`Failed to delete file: ${file.path}`, error.message);
//             }
//         });

//         // Combine existing folder content and new files
//         const combinedFiles = [...existingFolderContent, ...addedFiles];

//         // Add the combined files to IPFS as a new folder
//         const updatedFolderResult = [];
//         for await (const result of ipfs.addAll(combinedFiles, { wrapWithDirectory: true })) {
//             updatedFolderResult.push(result);
//         }

//         const newFolderCID = updatedFolderResult.pop().cid.toString(); // Get the CID of the updated folder

//         console.log('Updated Folder CID:', newFolderCID); // Debug log

//         res.json({ updatedFolderCID: newFolderCID, files: addedFiles }); // Sending the new folder CID and newly added files
//     } catch (error) {
//         console.error('Error updating folder:', error);
//         res.status(500).json({ error: 'Error updating folder', details: error.message });
//     }
// });

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});