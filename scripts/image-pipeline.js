const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'images', 'optimized');

async function optimizeImages() {
  console.log('Starting image optimization pipeline...');
  
  // Create optimized directory if it doesn't exist
  await fs.ensureDir(OPTIMIZED_DIR);
  
  // Define source directories to check
  const sourceDirs = [
    path.join(PUBLIC_DIR, 'images'),
    path.join(PUBLIC_DIR, 'assets', 'images')
  ];
  
  let processedCount = 0;
  
  for (const sourceDir of sourceDirs) {
    if (!await fs.pathExists(sourceDir)) {
      console.log(`Skipping ${sourceDir} - directory not found`);
      continue;
    }
    
    const files = await fs.readdir(sourceDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );
    
    for (const file of imageFiles) {
      const inputPath = path.join(sourceDir, file);
      const outputPath = path.join(OPTIMIZED_DIR, file);
      
      try {
        await sharp(inputPath)
          .resize(1920, 1080, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ quality: 80, progressive: true })
          .toFile(outputPath);
        
        console.log(`✓ Optimized: ${file}`);
        processedCount++;
      } catch (err) {
        console.error(`✗ Failed to optimize ${file}:`, err.message);
      }
    }
  }
  
  console.log(`\n✅ Image optimization complete! Processed ${processedCount} images.`);
  console.log(`Optimized images saved to: ${OPTIMIZED_DIR}`);
}

// Run the optimization
optimizeImages().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});