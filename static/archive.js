document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('archiveForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const fileInput = document.getElementById('fileInput').files[0];
        const archiveMode = document.getElementById('archiveMode').value; // Get archive mode
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
            const fileBuffer = await fileInput.arrayBuffer();

            const now = new Date();
            const tanggal = now.getDate();
            const bulan = now.getMonth() + 1;
            const tahun = now.getFullYear();
            const jam = now.toLocaleTimeString();

            const fileName = fileInput.name;

            if (archiveMode === "zip") {
                const zip = new JSZip();
                zip.file(fileName, fileBuffer);
                zip.comment = `CREATED BY HASYIM56, tanggal (${tanggal}), bulan (${bulan}), tahun (${tahun}), pada jam (${jam})`;

                const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
                handleDownload(blob, "archive_HASYIM56.zip");
            } else if (archiveMode === "7z") {
                // Simulate 7z compression
                const sevenZipContent = new Blob([fileBuffer], { type: "application/x-7z-compressed" });
                const txtFile = `CREATED BY HASYIM56, pada (${tanggal}, ${bulan}, ${tahun}, ${jam})`;

                const zip = new JSZip();
                zip.file(fileName, sevenZipContent);
                zip.file("HASYIM56.txt", txtFile);

                const blob = await zip.generateAsync({ type: "blob" });
                handleDownload(blob, "archive_HASYIM56.7z");
            }

            loadingContainer.style.display = 'none';
            statusMessage.innerText = "File compressed and archived successfully.";
            downloadContainer.style.display = 'block';

        } catch (error) {
            loadingContainer.style.display = 'none';
            statusMessage.innerText = "Error during compression.";
            console.error('Error:', error);
        }
    });

    function handleDownload(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }
});