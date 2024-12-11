
// document.addEventListener('DOMContentLoaded', () => {
//     // Ensure you are targeting the correct form
//     document.querySelector('form').addEventListener('submit', uploadFiles);
//     document.getElementById('retrieveForm').addEventListener('submit', retrieveFolder);
// });

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadForm').addEventListener('submit', uploadFiles);
    document.getElementById('retrieveForm').addEventListener('submit', retrieveFolder);
     document.getElementById('updateFolderForm').addEventListener('submit', updateFolder);
});
