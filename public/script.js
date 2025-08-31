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
});
