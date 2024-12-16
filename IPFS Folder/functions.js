
async function uploadFiles(event) {
    event.preventDefault(); // Prevent form default behavior
    const formData = new FormData(document.getElementById('uploadForm'));

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload files to IPFS');

        const result = await response.json();

        // Display results in the page
        const uploadResultDiv = document.getElementById('uploadResult');
        uploadResultDiv.innerHTML = `
            <h3>Folder Uploaded Successfully!</h3>
            <p><strong>Folder CID:</strong> ${result.folderCID}</p>
            <h4>Uploaded Files:</h4>
            <ul>${result.files.map(file => `<li>${file.path} (${file.cid})</li>`).join('')}</ul>
        `;
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error: Unable to upload files.');
    }
}

// Retrieve folder contents from IPFS and display them on the page
async function retrieveFolder(event) {
    event.preventDefault(); // Prevent form default behavior
    const folderCID = document.getElementById('folderCIDInput').value;

    if (!folderCID) {
        alert('Please enter a valid Folder CID');
        return;
    }

    try {
        const response = await fetch(`/folder/${folderCID}`);
        if (!response.ok) throw new Error('Failed to retrieve folder contents');

        const result = await response.json();

        // Display folder contents on the page
        const folderContentsDiv = document.getElementById('folderContents');
        folderContentsDiv.innerHTML = `
            <h3>Folder Contents</h3>
            <p><strong>Folder CID:</strong> ${result.folderCID}</p>
            <h4>Files:</h4>
            <ul>${result.files.map(file => `<li>${file.name} (${file.cid})</li>`).join('')}</ul>
        `;
    } catch (error) {
        console.error('Error retrieving folder contents:', error);
        alert('Error: Unable to retrieve folder contents.');
    }
}

async function updateFolder(event) {
    event.preventDefault(); // Prevent form default behavior
    const formData = new FormData(document.getElementById('updateFolderForm'));

    try {
        const response = await fetch('/update-folder', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to update folder');

        const result = await response.json();

        // Display updated folder CID and files on the page
        const updatedFolderResultDiv = document.getElementById('updatedFolderResult');
        updatedFolderResultDiv.innerHTML = `
            <h3>Folder Updated Successfully!</h3>
            <p><strong>Updated Folder CID:</strong> ${result.updatedFolderCID}</p>
            <h4>Uploaded Files:</h4>
            <ul>${result.files.map(file => `<li>${file.path} (${file.cid})</li>`).join('')}</ul>
        `;
    } catch (error) {
        console.error('Error updating folder:', error);
        alert('Error: Unable to update folder.');
    }
}

