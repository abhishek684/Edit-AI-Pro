import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const uploadImage = (file, userId, onProgress) => {
    return new Promise((resolve, reject) => {
        const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return reject(new Error('Invalid file type. Only JPG, PNG, and WEBP are allowed.'));
        }

        if (file.size > 10 * 1024 * 1024) {
            return reject(new Error('File size exceeds the 10MB limit.'));
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        if (import.meta.env.VITE_CLOUDINARY_API_KEY) {
            formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
        }
        formData.append('folder', `users/${userId}/original`);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', CLOUDINARY_URL, true);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                const progress = (e.loaded / e.total) * 100;
                onProgress(progress);
            }
        };

        xhr.onload = async () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    const downloadURL = response.secure_url;
                    const imageId = crypto.randomUUID();

                    // Save metadata to Firestore instead of Firebase Storage link
                    const docRef = await addDoc(collection(db, 'images'), {
                        imageId,
                        userId,
                        originalImageURL: downloadURL,
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                        cloudinaryPublicId: response.public_id,
                        createdAt: serverTimestamp()
                    });

                    resolve({
                        id: docRef.id,
                        imageId,
                        downloadURL
                    });
                } catch (error) {
                    console.error('Error saving image metadata:', error);
                    reject(error);
                }
            } else {
                reject(new Error(`Upload failed: ${xhr.responseText}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network error occurred during Cloudinary upload'));
        xhr.send(formData);
    });
};

export const getUserImages = async (userId) => {
    try {
        const imagesRef = collection(db, 'images');
        const q = query(
            imagesRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const images = [];
        querySnapshot.forEach((doc) => {
            images.push({ id: doc.id, ...doc.data() });
        });

        return images;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
};

export const getImageById = async (imageId) => {
    try {
        const imagesRef = collection(db, 'images');
        const q = query(imagesRef, where('imageId', '==', imageId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error fetching image by ID:', error);
        throw error;
    }
};

export const saveEditedImage = async (blob, userId, originalImageId, originalImageUrl, editType, creditsUsed = 1, promptText = null) => {
    return new Promise((resolve, reject) => {
        const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
        const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', UPLOAD_PRESET);
        if (import.meta.env.VITE_CLOUDINARY_API_KEY) {
            formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);
        }
        formData.append('folder', `users/${userId}/edited`);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', CLOUDINARY_URL, true);

        xhr.onload = async () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    const editedImageUrl = response.secure_url;
                    const editId = crypto.randomUUID();

                    const docRef = await addDoc(collection(db, 'edits'), {
                        editId,
                        userId,
                        originalImageId,
                        originalImageUrl,
                        editedImageUrl,
                        editType,
                        creditsUsed,
                        promptText, // Will be null for non-prompt edits
                        cloudinaryPublicId: response.public_id,
                        createdAt: serverTimestamp()
                    });

                    // Also deduct a credit here or in a separate function. We'll do it via authService.
                    resolve({
                        id: docRef.id,
                        editId,
                        editedImageUrl
                    });
                } catch (error) {
                    console.error('Error saving edit history:', error);
                    reject(error);
                }
            } else {
                reject(new Error(`Edit upload failed: ${xhr.responseText}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network error occurred during Cloudinary upload'));
        xhr.send(formData);
    });
};
export const getEditHistory = async (imageId) => {
    try {
        const editsRef = collection(db, 'edits');
        const q = query(
            editsRef,
            where('originalImageId', '==', imageId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const edits = [];
        querySnapshot.forEach((doc) => {
            edits.push({ id: doc.id, ...doc.data() });
        });

        return edits;
    } catch (error) {
        console.error('Error fetching edit history:', error);
        throw error;
    }
};
