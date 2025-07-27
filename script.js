const fileInput = document.getElementById('fileInput');
const compressButton = document.getElementById('compressButton');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');

compressButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    originalImage.src = event.target.result;
    originalSize.textContent = `Original Size: ${(file.size / 1024).toFixed(2)} KB`;
    const quality = 0.8; // Adjust quality for compression level (0 - 1)

    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 800; // Adjust for desired maximum width
      const MAX_HEIGHT = 600; // Adjust for desired maximum height

      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratioX = MAX_WIDTH / width;
        const ratioY = MAX_HEIGHT / height;
        const ratio = Math.min(ratioX, ratioY);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0, width, height);
      const compressedData = canvas.toDataURL('image/jpeg', quality);

      compressedImage.src = compressedData;

      fetch(compressedData)
        .then(res => res.blob())
        .then(blob => {
          const compressedSizeBytes = blob.size;
          compressedSize.textContent = `Compressed Size: ${(compressedSizeBytes / 1024).toFixed(2)} KB`;

          // Automatically initiate download
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'compressed_image.jpg';
          link.click();
        })
        .catch(error => {
          console.error('Error fetching compressed data:', error);
        });
    };
    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});
