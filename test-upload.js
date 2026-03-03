import fs from 'fs';

const uploadImage = async () => {
    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnslvmaep';
    const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'editai_uploads_new';

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();

    const blob = new Blob(['dummy content'], { type: 'text/plain' });
    formData.append('file', blob, 'dummy.txt');
    formData.append('upload_preset', uploadPreset);

    console.log(`Uploading to: ${url}`);
    console.log(`Using preset: ${uploadPreset}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);
    } catch (err) {
        console.error('Error:', err);
    }
};

uploadImage();
