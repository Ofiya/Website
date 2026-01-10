const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Configuration
const IMAGES_CONFIG = {
  carousel: [
    { id: '1P_SBt63Vv29UZLHGz7uPDKalwP3V-mNB', name: 'carousel-1.jpg' },
    { id: '1sjao-RrJnDIoo4v_4k76QgzIgH-TOSQG', name: 'carousel-2.jpg' },
    { id: '1MhJlAA-kwToyqnqCmL-q4CsBqIyLhUCr', name: 'carousel-3.jpg' },
    { id: '1w3qAfC69nwEdy4ZHiOG1h-BpATVxSfOg', name: 'carousel-4.jpg' }
  ],
  projects: [
    { id: '1pP8lWHS2pD04-rnL3eziF_0Zo1MOAszk', name: 'community-outreach.jpg' },
    { id: '1XpP9t_oEViSXNmwW-VTonPZsOg3HQI4N', name: 'youth-ministry.jpg' },
    { id: '12WoWQjJ1VQ-zv8O4ZFA2UAslhSZpSbqS', name: 'building-fund.jpg' }
  ]
};

async function downloadImages() {
  for (const [folder, images] of Object.entries(IMAGES_CONFIG)) {
    console.log(`Downloading ${folder} images...`);
    
    for (const image of images) {
      const url = `https://drive.google.com/uc?export=download&id=${image.id}`;
      const outputPath = path.join('public', 'images', folder, image.name);
      
      try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(buffer));
        console.log(`✓ Downloaded ${image.name}`);
      } catch (error) {
        console.error(`✗ Failed to download ${image.name}:`, error.message);
      }
    }
  }
}

downloadImages();