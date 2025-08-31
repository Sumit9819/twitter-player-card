document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cardForm');
    const resultSection = document.getElementById('result');
    const generatedUrl = document.getElementById('generatedUrl');
    const previewFrame = document.getElementById('previewFrame');
    const copyBtn = document.getElementById('copyBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const params = new URLSearchParams();
        
        // Add all form fields to params
        for (let [key, value] of formData.entries()) {
            if (value.trim()) {
                params.append(key, value.trim());
            }
        }
        
        // Generate the URL
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/generate?${params.toString()}`;
        
        // Display result
        generatedUrl.textContent = apiUrl;
        previewFrame.src = apiUrl;
        resultSection.style.display = 'block';
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Copy URL functionality
    copyBtn.addEventListener('click', function() {
        const text = generatedUrl.textContent;
        navigator.clipboard.writeText(text).then(function() {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });
    
    // Auto-detect common video platforms and set appropriate dimensions
    const videoUrlInput = document.getElementById('videoUrl');
    videoUrlInput.addEventListener('blur', function() {
        const url = this.value.trim();
        if (!url) return;
        
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        const titleInput = document.getElementById('title');
        
        // YouTube detection
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            widthInput.value = '640';
            heightInput.value = '360';
            if (!titleInput.value) titleInput.value = 'YouTube Video';
        }
        // Vimeo detection
        else if (url.includes('vimeo.com')) {
            widthInput.value = '640';
            heightInput.value = '360';
            if (!titleInput.value) titleInput.value = 'Vimeo Video';
        }
        // TikTok detection
        else if (url.includes('tiktok.com')) {
            widthInput.value = '320';
            heightInput.value = '568';
            if (!titleInput.value) titleInput.value = 'TikTok Video';
        }
    });
});
