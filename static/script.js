document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('archiveForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('fileInput').files[0];
        if (!fileInput) {
            alert("Please select a file.");
            return;
        }

        document.getElementById('loadingContainer').style.display = 'block';
        document.getElementById('loadingBar').style.width = '0%';
        document.getElementById('loadingText').innerText = 'Processing...';

        try {
            // Convert file to Blob
            const formData = new FormData();
            formData.append("uploaded_file", fileInput);

            const response = await fetch('/mnt/data/archive-max-compress', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to compress file.");
            }

            const blob = await response.blob();
            document.getElementById('loadingContainer').style.display = 'none';
            document.getElementById('statusMessage').innerText = "File compressed and archived successfully.";
            document.getElementById('downloadContainer').style.display = 'block';

            // Add download functionality
            document.getElementById('downloadButton').addEventListener('click', function () {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'files_H56.zip'; // Nama file yang diinginkan
                a.click();
                window.URL.revokeObjectURL(url);
            });
        } catch (error) {
            document.getElementById('loadingContainer').style.display = 'none';
            document.getElementById('statusMessage').innerText = "Error during compression.";
            console.error('Error:', error);
        }
    });
});