/**
 * AI Image Editing Service using Cloudinary Free Tier Generative AI
 * 
 * Instead of hitting a separate AI API, this service builds Cloudinary
 * transformation URLs based on the original image's public ID.
 * The generative transformations happen on-the-fly when the new URL is loaded.
 */

// Helper to construct the base Cloudinary URL with transformations
const buildCloudinaryGenAIUrl = (originalUrl, transformationString) => {
    // A standard Cloudinary URL looks like:
    // https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>.ext

    // We need to inject the transformation between /upload/ and /v<version>
    const uploadIndex = originalUrl.indexOf('/upload/');
    if (uploadIndex === -1) {
        throw new Error('Invalid Cloudinary URL provided to AI service.');
    }

    const beforeUpload = originalUrl.substring(0, uploadIndex + 8); // includes '/upload/'
    const afterUpload = originalUrl.substring(uploadIndex + 8);

    return `${beforeUpload}${transformationString}/${afterUpload}`;
};

// --- Specific Tool Exports ---

export const removeBackground = async (originalUrl) => {
    // Cloudinary's built-in background removal feature
    const transformation = 'e_background_removal';
    return buildCloudinaryGenAIUrl(originalUrl, transformation);
};

export const replaceBackground = async (originalUrl, prompt) => {
    // Encodes the prompt to be URL safe
    const safePrompt = encodeURIComponent(prompt);
    const transformation = `e_gen_background_replace:prompt_${safePrompt}`;
    return buildCloudinaryGenAIUrl(originalUrl, transformation);
};

export const removeObject = async (originalUrl, objectPrompt) => {
    const safePrompt = encodeURIComponent(objectPrompt);
    const transformation = `e_gen_remove:prompt_${safePrompt}`;
    return buildCloudinaryGenAIUrl(originalUrl, transformation);
};

export const enhanceFace = async (originalUrl) => {
    const transformation = 'e_improve,e_sharpen';
    return buildCloudinaryGenAIUrl(originalUrl, transformation);
};

export const upscaleImage = async (originalUrl) => {
    const transformation = 'e_upscale';
    return buildCloudinaryGenAIUrl(originalUrl, transformation);
};

export const processPromptEdit = async (originalUrl, promptText) => {
    // Detect if it's a "from X to Y" style prompt
    const replaceMatch = promptText.match(/^(.+?)\s+to\s+(.+)$/i);

    if (replaceMatch) {
        // "X to Y" => use gen_replace
        const safeFrom = encodeURIComponent(replaceMatch[1].trim());
        const safeTo = encodeURIComponent(replaceMatch[2].trim());
        const transformation = `e_gen_replace:from_${safeFrom};to_${safeTo}`;
        return buildCloudinaryGenAIUrl(originalUrl, transformation);
    }

    // For general prompts like "Beach background", "Cinematic lighting", etc.
    // Use background replace as it's the most versatile gen-AI transformation
    const safePrompt = encodeURIComponent(promptText.trim());
    const transformation = `e_gen_background_replace:prompt_${safePrompt}`;
    return buildCloudinaryGenAIUrl(originalUrl, transformation);
};
