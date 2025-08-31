export default function handler(request, response) {
  // Enable CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }
  
  // Set content type
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  // Get query parameters (works for both GET and POST)
  let queryParams = {};
  
  if (request.method === 'GET') {
    queryParams = request.query;
  } else if (request.method === 'POST') {
    queryParams = request.body || request.query;
  }
  
  const {
    url: videoUrl,
    title = 'Video Content',
    description = 'Watch this video',
    image = '',
    width = '640',
    height = '360',
    username = '@yourusername'
  } = queryParams;
  
  console.log('Received parameters:', queryParams); // Debug log
  
  // Validate required parameters
  if (!videoUrl) {
    response.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Error - Missing URL</title>
      </head>
      <body>
        <h1>Error: Missing required parameter</h1>
        <p>Required parameter 'url' is missing.</p>
        <p>Received parameters: ${JSON.stringify(queryParams)}</p>
        <a href="/">Go back to form</a>
      </body>
      </html>
    `);
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
    </div>
</body>
</html>`;
  
  response.status(200).send(html);
}
