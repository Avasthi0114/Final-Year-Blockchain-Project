import express from 'express';
import multer from 'multer';
import { create } from 'ipfs-http-client';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import * as IPFS from 'ipfs-core';
import axios from 'axios';

//global declaration of authToken
const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNheWFsaSIsIm9yZ05hbWUiOiJPcmcxIiwiaWF0IjoxNzQxMDE4MDk4fQ.7spluXvixrwmIFtgM_uVmhxRjjaBHK2nl6RwG8derJI";

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static('routes'));

// Initialize IPFS client
const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });


// Middleware
app.use(cors());
app.use(bodyParser.json());
// app.use(express.static('routes'));

async function startNewIPFSNode(port, dataDirectory) {
    try {
        const ipfs = await IPFS.create({
            repo: dataDirectory, // New directory for the node's data
            config: {
                Addresses: {
                    Swarm: [
                        `/ip4/0.0.0.0/tcp/${port}`,
                        `/ip6/::/tcp/${port + 1}`,
                        `/ip4/0.0.0.0/udp/${port + 2}/quic`,
                        `/ip6/::/udp/${port + 3}/quic`
                    ]
                }
            }
        });
        console.log(`New IPFS node running on port ${port}`);
        return ipfs;
    } catch (error) {
        console.error(`Error starting new IPFS node on port ${port}:`, error);
        throw error;
    }
}

// Define port and directory for the new IPFS node
const newIPFSPort = 4501;
const newIPFSDataDirectory = '\\wsl.localhost\Ubuntu\home\avasthi\FIR\BTech-eFIR-Management\Backend\ipfs_data'; // Directory for new node's data

// Start the new IPFS node
const newIPFSNode = await startNewIPFSNode(newIPFSPort, newIPFSDataDirectory);


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

// // Route: Upload files to IPFS and create a folder

// const generatedPdfDir =  '/home/avasthi/FIR-Project/BTech-eFIR-Management/Backend/generated_pdf';
// app.post('/uploadToIPFS', async (req, res) => {
//     try {
//         const fileName = 'partialReport.pdf'; // Replace with the actual file name
//         const filePath = path.join(generatedPdfDir, fileName);

//         // Check if the file exists
//         if (!fs.existsSync(filePath)) {
//             console.log('File does not exist:', filePath);
//             return res.status(400).json({ error: `File not found: ${filePath}` });
//         }

//         // Read the file content
//         const fileContent = fs.readFileSync(filePath);

//         // Add the file to IPFS
//         const fileResult = await ipfs.add({ path: fileName, content: fileContent });

//         if (!fileResult.cid) {
//             console.log('Failed to add file to IPFS');
//             return res.status(500).json({ error: 'Failed to add file to IPFS' });
//         }

//         console.log('File added to IPFS:', fileResult);

//         // Delete the file after adding it to IPFS
//         // try {
//         //     fs.unlinkSync(filePath); // Delete the file from the local directory
//         //     console.log(`Deleted file: ${filePath}`);
//         // } catch (error) {
//         //     console.error(`Failed to delete file: ${filePath}`, error.message);
//         // }

//         // Simulate a folder by adding the file with a folder-like structure
//         const folderResult = await ipfs.addAll([
//             { path: `generated_pdf/${fileName}`, content: fileContent }
//         ], { wrapWithDirectory: true });

//         // The folderCID will be the CID of the directory structure
//         let folderCID = '';
//         for await (const result of folderResult) {
//             if (result.cid) {
//                 folderCID = result.cid.toString();
//             }
//         }

//         if (!folderCID) {
//             console.log('Failed to create folder in IPFS');
//             return res.status(500).json({ error: 'Failed to create folder in IPFS' });
//         }

//         console.log('Folder and file added to IPFS:', folderCID);

//         // Respond with both the file CID and the folder CID
//         res.json({
//             folderCID: folderCID,
//             fileCID: fileResult.cid.toString(),
//             path: fileResult.path,
//         });
//     } catch (error) {
//         console.error('Error adding file to IPFS:', error);
//         res.status(500).json({ error: 'Error adding file to IPFS', details: error.message });
//     }
// });


// Route: Upload files to IPFS and create a folder

const generatedPdfDir = '/home/avasthi/FIR/BTech-eFIR-Management/Backend/generated_pdf';
app.post('/uploadToIPFS', async (req, res) => {

    const { complaintID } = req.body; // Extract ComplaintID from the request body

    if (!complaintID) {
        return res.status(400).json({ error: 'ComplaintID is required' });
    }

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

        // Get the CID of the file (this is the dynamic partialFIRHash)
        const partialFIRHash = fileResult.cid.toString();

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

        // Blockchain API call (awaited to ensure it completes before sending the response)
        try {
            const blockchainPayload = {
                peers: ["peer0.org1.example.com", "peer0.org2.example.com"],
                fcn: "addComplaint",
                args: [
                    complaintID,  // Use dynamic ComplaintID here
                    partialFIRHash, // Use dynamic partialFIRHash here (CID of the PDF file)
                    folderCID // Use folderCID from IPFS
                ]
            };

            const blockchainResponse = await axios.post(
                'http://localhost:4000/channels/fir-channel/chaincodes/FIRManagement',
                blockchainPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            // Send only one response after blockchain is invoked
            return res.json({
                folderCID,
                partialFIRHash, 
                blockchainResponse: blockchainResponse.data
            });

        } catch (error) {
            console.error('Error invoking blockchain:', error);
            return res.status(500).json({
                error: 'Error invoking blockchain',
                details: error.message,
                folderCID
            });
        }

    } catch (error) {
        console.error('Error adding file to IPFS:', error);
        return res.status(500).json({ error: 'Error adding file to IPFS', details: error.message });
    }
});

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

// app.post('/process-evidences', async (req, res) => {
//     try {
//       const folderCID = req.body.folderCID; // Get existing folder CID from the request
//       const folderPath = '/home/avasthi/FIR/BTech-eFIR-Management/Backend/routes/Evidences';
  
//       // Read all files in the folder
//       const filesInFolder = fs.readdirSync(folderPath);
  
//       // Prepare files for IPFS
//       const filesToAdd = filesInFolder.map((fileName) => {
//         const filePath = path.join(folderPath, fileName);
//         const fileContent = fs.readFileSync(filePath); // Read file content
//         return { path: fileName, content: fileContent };
//       });
  
//       console.log('Prepared files for IPFS:', filesToAdd);

//       // Use IPFS to add/update files
//       const addedFiles = [];
//       for await (const result of ipfs.addAll(filesToAdd)) {
//         addedFiles.push({ path: result.path, cid: result.cid.toString() });
//       }
  
//       // Update the folder in IPFS
//       const updatedFolderCID = await updateFolderInIPFS(folderCID, addedFiles);
  
//       // Delete files from the local folder
//       filesInFolder.forEach((fileName) => {
//         const filePath = path.join(folderPath, fileName);
//         try {
//           fs.unlinkSync(filePath); // Delete the file
//           console.log(`Deleted local file: ${filePath}`);
//         } catch (error) {
//           console.error(`Failed to delete local file: ${filePath}`, error.message);
//         }
//       });

//       // Blockchain API call (awaited to ensure it completes before sending the response)
//       try {
//         const blockchainPayload = {
//             peers: ["peer0.org1.example.com", "peer0.org2.example.com"],
//             fcn: "updateFolderHash",
//             args: [
//                 complaintID,  // Use dynamic ComplaintID here
//                 updatedFolderCID // Use dynamic updatedFolderCID here 
//             ]
//         };

//         const blockchainResponse = await axios.post(
//             'http://localhost:4000/channels/fir-channel/chaincodes/FIRManagement',
//             blockchainPayload,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${authToken}`
//                 }
//             }
//         );

//         // Send only one response after blockchain is invoked
//         return res.json({
//             updatedFolderCID,
//             blockchainResponse: blockchainResponse.data
//         });

//     } catch (error) {
//         console.error('Error invoking blockchain:', error);
//         return res.status(500).json({
//             error: 'Error invoking blockchain',
//             details: error.message,
//             updatedFolderCID
//         });
//     }
  
//       // Respond with the updated folder CID and added files
//     //   res.json({ updatedFolderCID, addedFiles });
//     } catch (error) {
//       console.error('Error processing evidences:', error);
//       res.status(500).json({ error: 'Error processing evidences' });
//     }
//   });
  
//   async function updateFolderInIPFS(existingFolderCID, filesToAdd) {
//     const existingFolderContent = [];
//     for await (const file of ipfs.ls(existingFolderCID)) {
//       existingFolderContent.push({ path: file.name, cid: file.cid });
//     }
  
//     const combinedFiles = [...existingFolderContent, ...filesToAdd];
//     const updatedFolderResult = [];
//     for await (const result of ipfs.addAll(combinedFiles, { wrapWithDirectory: true })) {
//       updatedFolderResult.push(result);
//     }
//     console.log("Updated CID :",updatedFolderResult.pop().cid.toString());
//     return updatedFolderResult.pop().cid.toString();
//   }

app.post('/process-evidences', async (req, res) => {
    try {
        const folderCID = req.body.folderCID; // Get existing folder CID from the request
        const folderPath = '/home/avasthi/FIR/BTech-eFIR-Management/Backend/routes/Evidences';

        console.log('Received folderCID:', folderCID);

        // Read all files in the folder
        const filesInFolder = fs.readdirSync(folderPath);
        console.log('Files found in folder:', filesInFolder);

        // Prepare files for IPFS
        const filesToAdd = filesInFolder.map((fileName) => {
            const filePath = path.join(folderPath, fileName);
            const fileContent = fs.readFileSync(filePath); // Read file content
            return { path: fileName, content: fileContent };
        });

        console.log('Prepared files for IPFS:', filesToAdd);

        // Use IPFS to add/update files
        const addedFiles = [];
        for await (const result of ipfs.addAll(filesToAdd)) {
            console.log('Added file to IPFS:', result.path, result.cid.toString());
            addedFiles.push({ path: result.path, cid: result.cid.toString() });
        }

        console.log('Added files to IPFS:', addedFiles);

        // Update the folder in IPFS
        const updatedFolderCID = await updateFolderInIPFS(folderCID, addedFiles);
        console.log('Updated folder CID:', updatedFolderCID);

        // Delete files from the local folder
        filesInFolder.forEach((fileName) => {
            const filePath = path.join(folderPath, fileName);
            try {
                fs.unlinkSync(filePath); // Delete the file
                console.log(`Deleted local file: ${filePath}`);
            } catch (error) {
                console.error(`Failed to delete local file: ${filePath}`, error.message);
            }
        });

        // Blockchain API call (awaited to ensure it completes before sending the response)
        try {
            console.log('Preparing blockchain payload with complaintID and updatedFolderCID...');
            const blockchainPayload = {
                peers: ["peer0.org1.example.com", "peer0.org2.example.com"],
                fcn: "updateFolderHash",
                args: [
                    req.body.complaintID,  // Ensure complaintID is passed in the request body
                    updatedFolderCID // Use dynamic updatedFolderCID here 
                ]
            };

            console.log('Sending request to blockchain at http://localhost:4000/channels/fir-channel/chaincodes/FIRManagement');
            const blockchainResponse = await axios.post(
                'http://localhost:4000/channels/fir-channel/chaincodes/FIRManagement',
                blockchainPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`  // Ensure authToken is correctly set
                    }
                }
            );

            console.log('Blockchain response:', blockchainResponse.data);

            // Send only one response after blockchain is invoked
            return res.json({
                updatedFolderCID,
                blockchainResponse: blockchainResponse.data
            });

        } catch (error) {
            console.error('Error invoking blockchain:', error.message);
            return res.status(500).json({
                error: 'Error invoking blockchain',
                details: error.message,
                updatedFolderCID
            });
        }

    } catch (error) {
        console.error('Error processing evidences:', error.message);
        res.status(500).json({ error: 'Error processing evidences', details: error.message });
    }
});

// Function to update the folder in IPFS and return the updated folder CID
async function updateFolderInIPFS(existingFolderCID, filesToAdd) {
    try {
        console.log('Updating folder in IPFS with existing folder CID:', existingFolderCID);

        const existingFolderContent = [];
        for await (const file of ipfs.ls(existingFolderCID)) {
            existingFolderContent.push({ path: file.name, cid: file.cid });
        }
        console.log('Existing folder content:', existingFolderContent);

        const combinedFiles = [...existingFolderContent, ...filesToAdd];
        console.log('Combined files to add to IPFS:', combinedFiles);

        const updatedFolderResult = [];
        for await (const result of ipfs.addAll(combinedFiles, { wrapWithDirectory: true })) {
            updatedFolderResult.push(result);
        }

        const updatedFolderCID = updatedFolderResult.pop().cid.toString();
        console.log("Updated folder CID in IPFS:", updatedFolderCID);

        return updatedFolderCID;

    } catch (error) {
        console.error('Error adding files to IPFS:', error.message);
        throw new Error('Failed to update folder in IPFS');
    }
}

export async function getFile(hash) {
    try {
        const fileData = [];
        console.log('Fetching file from IPFS...');

        // Check if IPFS node is initialized and accessible
        for await (const chunk of newIPFSNode.cat(hash)) {
            fileData.push(chunk);
        }

        const fileBuffer = Buffer.concat(fileData);
        const fileType = 'application/pdf';

        return { status: "success", fileBuffer: fileBuffer.toString('base64'), fileType };
    } catch (error) {
        console.error('Error retrieving file from IPFS:', error); // Log detailed error
        throw error;
    }
}

app.get('/get-file/:hash', async (req, res) => {
    try {
        const hash = req.params.hash; // Extract CID from the URL
        const fileResponse = await getFile(hash); // Get the file from IPFS
        res.status(200).json(fileResponse); // Send back the file in base64
    } catch (error) {
        console.error('Error fetching file:', error); // Log the error
        res.status(500).json({ error: 'Failed to fetch file from IPFS' }); // Respond with error
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

