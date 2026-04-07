document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const pdfInput = document.getElementById('pdfInput');
    const processBtn = document.getElementById('processBtn');
    const progress = document.getElementById('progress');
    const result = document.getElementById('result');
    const timeTaken = document.getElementById('timeTaken');
    const downloadLink = document.getElementById('downloadLink');

    // Drag & drop functionality
    uploadArea.addEventListener('click', () => pdfInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#764ba2';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#667eea';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#667eea';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            pdfInput.files = files;
            handleFileSelect();
        }
    });

    pdfInput.addEventListener('change', handleFileSelect);

    function handleFileSelect() {
        if (pdfInput.files.length > 0) {
            processBtn.disabled = false;
            processBtn.innerHTML = `<i class="fas fa-magic"></i> Generate PPT from ${pdfInput.files[0].name}`;
        }
    }

    processBtn.addEventListener('click', async function() {
        const formData = new FormData();
        formData.append('pdf', pdfInput.files[0]);

        progress.style.display = 'block';
        result.style.display = 'none';
        processBtn.disabled = true;
        processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                progress.style.display = 'none';
                timeTaken.textContent = `Generated in ${data.processing_time}ms! 🎉`;
                downloadLink.href = data.ppt_url;
                result.style.display = 'block';
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            processBtn.disabled = false;
            processBtn.innerHTML = '<i class="fas fa-magic"></i> Generate PPT';
        }
    });
});
