//Using multer 

import express from 'express';
import {createFolder,getFolder, storeFile, getFile } from './Functions.mjs';
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

const express = require('express');
const IPFS = require('ipfs-http-client');
const archiver = require('archiver');
const fs = require('fs');


const ipfs = IPFS.create({ host: 'localhost', port: 5001, protocol: 'http' });

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


// Create an IPFS folder
app.post('/createFolder', upload.array('files'), async (req, res) => {
    try {
        console.log('Received files:', req.files);

        const files = req.files.map(file => ({
            name: file.originalname,
            content: file.buffer
        }));

        const folderCID = await createFolder(files);
        res.send(folderCID);
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).send(error);
    }
});

// Retrieve files from an IPFS folder
// app.post('/getFolder', async (req, res) => {
//     try {
//         const { folderCID } = req.body;
//         console.log('Fetching folder with CID:', folderCID);

//         const files = await getFolder(folderCID);
//         res.send(files);
//     } catch (error) {
//         console.error('Error fetching folder:', error);
//         res.status(500).send(error);
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

app.post('/getFolder', async (req, res) => {
    const { folderCID } = req.body;

    try {
        // Fetch files in the folder
        const folderContents = [];
        for await (const file of ipfs.ls(folderCID)) {
            folderContents.push({ path: file.name, cid: file.cid.toString() });
        }

        res.status(200).send({ folderCID, folderContents });
    } catch (error) {
        console.error('Error retrieving folder:', error);
        res.status(500).send({ error: 'Error retrieving folder' });
    }
});
