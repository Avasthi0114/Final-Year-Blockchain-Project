import * as fs from 'fs';
import * as IPFS from 'ipfs-core';

// Function to start a new IPFS node
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
const newIPFSDataDirectory = '/home/ubuntu/new_IPFS_data_CMS'; // Directory for new node's data

// Start the new IPFS node
const newIPFSNode = await startNewIPFSNode(newIPFSPort, newIPFSDataDirectory);

// Modify the storeFile function to accept content directly
export async function storeFile(fileContent) {
    try {
        console.log("Adding file to new IPFS node...");
        const fileAdded = await newIPFSNode.add({
            content: fileContent
        });

        console.log('File successfully added to IPFS');
        return { hash: fileAdded.cid.toString() }; // Return CID only
    } catch (error) {
        console.error('Error adding file to new IPFS node:', error);
        throw error;
    }
}

// Function to retrieve file from IPFS
// Function to retrieve file from IPFS without needing fileName
export async function getFile(hash) {
    try {
        const fileData = [];
        console.log('Fetching file from new IPFS node...');
        
        // Iterate over the chunks of the file content
        for await (const chunk of newIPFSNode.cat(hash)) {
            fileData.push(chunk);
        }
        
        // Concatenate all chunks into a single buffer
        const fileBuffer = Buffer.concat(fileData);
        
        // Return the buffer (optionally as a base64 string if needed for frontend)
        return { status: "success", fileBuffer: fileBuffer.toString('base64') }; 
    } catch (error) {
        console.error('Error retrieving file from new IPFS node:', error);
        throw error;
    }
}

 export async function createFolder(files) {
    try {
        console.log("Adding folder to IPFS...");
        const folder = [];

        // Prepare folder content
        for (const file of files) {
            folder.push({
                path: file.name,
                content: file.content
            });
        }

        // Add folder to IPFS
        const folderAdded = await newIPFSNode.addAll(folder, { wrapWithDirectory: true });
        let folderCID;

        for await (const entry of folderAdded) {
            if (entry.path === '') {
                folderCID = entry.cid.toString(); // Capture folder CID
            }
        }

        console.log('Folder successfully added to IPFS');
        return { folderCID };
    } catch (error) {
        console.error('Error creating IPFS folder:', error);
        throw error;
    }
}

// export async function createFolder(files) {
//     try {
//         console.log("Adding folder to IPFS...");
//         const folder = [];

//         // Prepare folder content
//         for (const file of files) {
//             folder.push({
//                 path: file.originalname, // Ensure correct file name
//                 content: file.buffer,
//             });
//         }

//         // Add folder to IPFS
//         const folderAdded = await newIPFSNode.addAll(folder, { wrapWithDirectory: true });
//         const fileCIDs = [];
//         let folderCID;

//         for await (const entry of folderAdded) {
//             if (entry.path === '') {
//                 folderCID = entry.cid.toString(); // Folder CID
//             } else {
//                 fileCIDs.push({ path: entry.path, cid: entry.cid.toString() });
//             }
//         }

//         console.log('Folder successfully added to IPFS');
//         return { folderCID, fileCIDs };
//     } catch (error) {
//         console.error('Error creating IPFS folder:', error);
//         throw error;
//     }
// }

// Function to retrieve files from an IPFS folder
export async function getFolder(folderCID) {
    try {
        console.log('Fetching folder from IPFS...');
        const files = [];

        for await (const file of newIPFSNode.ls(folderCID)) {
            const fileData = [];
            for await (const chunk of newIPFSNode.cat(file.cid)) {
                fileData.push(chunk);
            }

            files.push({
                name: file.name,
                content: Buffer.concat(fileData).toString('utf-8') // Decode file content
            });
        }

        console.log('Folder successfully retrieved');
        return files;
    } catch (error) {
        console.error('Error retrieving IPFS folder:', error);
        throw error;
    }
}


