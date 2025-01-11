document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('archiveForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('fileInput').files[0];
        if (!fileInput) {
            alert("Please select a file.");
            return;
        }

        const loadingContainer = document.getElementById('loadingContainer');
        const loadingBar = document.getElementById('loadingBar');
        const loadingText = document.getElementById('loadingText');
        const downloadContainer = document.getElementById('downloadContainer');
        const statusMessage = document.getElementById('statusMessage');

        loadingContainer.style.display = 'block';
        loadingBar.style.width = '0%';
        loadingText.innerText = 'Processing...';

        try {
            // Convert file to binary data
            const fileBuffer = await fileInput.arrayBuffer();

            // Get current date and time
            const now = new Date();
            const tanggal = now.getDate();
            const bulan = now.getMonth() + 1;
            const tahun = now.getFullYear();
            const jam = now.toLocaleTimeString();

            // Create ZIP file
            const zip = new JSZip();
            zip.file(fileInput.name, fileBuffer);
            zip.comment = `CREATED BY HASYIM56, tanggal (${tanggal}), bulan (${bulan}), tahun (${tahun}), pada jam (${jam})`;

            // Generate ZIP file blob
            const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });

            loadingContainer.style.display = 'none';
            statusMessage.innerText = "File compressed and archived successfully.";
            downloadContainer.style.display = 'block';

            // Add download functionality
            document.getElementById('downloadButton').addEventListener('click', function () {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'files_H56.zip'; // Desired file name
                a.click();
                window.URL.revokeObjectURL(url);
            });
        } catch (error) {
            loadingContainer.style.display = 'none';
            statusMessage.innerText = "Error during compression.";
            console.error('Error:', error);
        }
    });
});