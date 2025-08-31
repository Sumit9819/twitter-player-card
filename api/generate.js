module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Set content type
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  // Get query parameters
  const {
    url: videoUrl,
    title = 'Video Content',
    description = 'Watch this video',
    image = '',
    width = '640',
    height = '360',
    username = '@yourusername'
  } = req.query;
  
  // Validate required parameters
  if (!videoUrl) {
    res.status(400).send('Missing required parameter: url');
    return;
  }
  
  // Generate domain-based placeholder image if none provided
  let imageUrl = image;
  if (!imageUrl) {
    try {
      const urlObj = new URL(videoUrl);
      const domain = urlObj.hostname.replace('www.', '');
      imageUrl = `https://placehold.co/${width}x${height}/000000/FFFFFF?text=${encodeURIComponent(domain)}`;
    } catch (e) {
      imageUrl = `https://placehold.co/${width}x${height}/000000/FFFFFF?text=Video`;
    }
  }
  
  // Generate HTML with Twitter Card meta tags
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="player">
    <meta name="twitter:site" content="${username}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:player" content="${videoUrl}">
    <meta name="twitter:player:width" content="${width}">
    <meta name="twitter:player:height" content="${height}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:image:alt" content="${title} preview">
    
    <!-- Open Graph tags for better sharing -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="video.other">
    <meta property="og:url" content="${videoUrl}">
    <meta property="og:image" content="${imageUrl}">
</head>
<body>
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1>${title}</h1>
        <p>${description}</p>
        
        <div style="margin: 20px 0;">
            <iframe 
                src="${videoUrl}" 
                width="${width}" 
                height="${height}" 
                frameborder="0" 
                allowfullscreen
                style="max-width: 100%; height: auto;">
            </iframe>
        </div>
        
        <p><a href="${videoUrl}" target="_blank">Watch video directly</a></p>
        
        <div style="margin-top: 40px; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
            <h3>How to use this Player Card:</h3>
            <ol>
                <li>Copy this page's URL</li>
                <li>Paste it into a Twitter post</li>
                <li>Twitter will automatically generate a player card</li>
            </ol>
            <p><strong>Note:</strong> For first-time use, Twitter may need to approve your domain.</p>
        </div>
    </div>
</body>
</html>`;
  
  res.status(200).send(html);
};
