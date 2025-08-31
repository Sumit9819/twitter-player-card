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
            if (value && value.trim()) {
                params.append(key, value.trim());
            }
        }
        
        // Generate the URL - make sure we have a URL parameter
        const videoUrl = document.getElementById('videoUrl').value.trim();
        if (!videoUrl) {
            alert('Please enter a video URL');
            return;
        }
        
        const baseUrl = window.location.origin;
        const apiUrl = `${baseUrl}/api/generate?${params.toString()}`;
        
        console.log('Generated URL:', apiUrl); // Debug log
        
        // Display result
        generatedUrl.textContent = apiUrl;
        previewFrame.src = apiUrl;
        resultSection.style.display = 'block';
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Copy URL functionality
    copyBtn.addEventListener('click', async function() {
        const text = generatedUrl.textContent;
        try {
            await navigator.clipboard.writeText(text);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }
    });
    
    // Auto-detect common video platforms and set appropriate dimensions
    const videoUrlInput = document.getElementById('videoUrl');
    if (videoUrlInput) {
        videoUrlInput.addEventListener('blur', function() {
            const url = this.value.trim();
            if (!url) return;
            
            const widthInput = document.getElementById('width');
            const heightInput = document.getElementById('height');
            const titleInput = document.getElementById('title');
            
            // YouTube detection
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                if (widthInput) widthInput.value = '640';
                if (heightInput) heightInput.value = '360';
                if (titleInput && !titleInput.value) titleInput.value = 'YouTube Video';
            }
            // Vimeo detection
            else if (url.includes('vimeo.com')) {
                if (widthInput) widthInput.value = '640';
                if (heightInput) heightInput.value = '360';
                if (titleInput && !titleInput.value) titleInput.value = 'Vimeo Video';
            }
            // TikTok detection
            else if (url.includes('tiktok.com')) {
                if (widthInput) widthInput.value = '320';
                if (heightInput) heightInput.value = '568';
                if (titleInput && !titleInput.value) titleInput.value = 'TikTok Video';
            }
        });
    }
});
