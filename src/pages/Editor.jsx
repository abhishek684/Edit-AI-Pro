import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RotateCw, Droplet, Sun, Contrast, Activity, Loader2, Sparkles, Wand2, Eraser, UserCheck, Maximize, Image as ImageIcon, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageById, saveEditedImage } from '../services/imageService';
import { deductUserCredit } from '../services/authService';
import { removeBackground, replaceBackground, removeObject, enhanceFace, upscaleImage, processPromptEdit } from '../services/aiService';


const Editor = () => {
    const { imageId } = useParams();
    const navigate = useNavigate();
    const { currentUser, userProfile } = useAuth();

    const [originalImage, setOriginalImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [processingAI, setProcessingAI] = useState(false);
    const [aiError, setAiError] = useState(null);
    const [lastEditType, setLastEditType] = useState('basic_adjustments');
    const [lastCreditsUsed, setLastCreditsUsed] = useState(1);

    // Prompt Editing State
    const [promptText, setPromptText] = useState('');
    const [preEditImage, setPreEditImage] = useState(null);
    const [showSlider, setShowSlider] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [lastPrompt, setLastPrompt] = useState('');

    // Editing State
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);
    const [blur, setBlur] = useState(0);
    const [rotation, setRotation] = useState(0);


    const canvasRef = useRef(null);
    const imageElementRef = useRef(null);
    const containerRef = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Fetch original image metadata
    useEffect(() => {
        const fetchImage = async () => {
            if (!imageId) return;
            try {
                setLoading(true);
                const imgData = await getImageById(imageId);
                if (!imgData) {
                    setError('Image not found.');
                    return;
                }

                // Ensure the user owns this image
                if (imgData.userId !== currentUser.uid) {
                    setError('Unauthorized to edit this image.');
                    return;
                }

                setOriginalImage(imgData);

                // Load actual image for canvas
                const img = new Image();
                img.crossOrigin = 'anonymous'; // Important for canvas CORS
                img.onload = () => {
                    imageElementRef.current = img;
                    setImageLoaded(true);
                    setLoading(false);
                };
                img.onerror = () => {
                    setError('Failed to load image source.');
                    setLoading(false);
                };
                img.src = imgData.originalImageURL;
            } catch (err) {
                console.error(err);
                setError('Error fetching image details.');
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchImage();
        }
    }, [imageId, currentUser]);

    // Draw to Canvas
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = imageElementRef.current;

        if (!canvas || !ctx || !img) return;

        // Determine canvas dimensions based on rotation
        const isRotated = rotation % 180 !== 0;
        canvas.width = isRotated ? img.height : img.width;
        canvas.height = isRotated ? img.width : img.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Apply filters
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;

        // Handle rotation pivot
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        // Draw image offset by half its size to center it
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

        // Reset transform & filter for subsequent draws
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.filter = 'none';

    }, [brightness, contrast, saturation, blur, rotation]);

    // Redraw whenever state changes
    useEffect(() => {
        if (imageElementRef.current && !processingAI && !showSlider) {
            drawCanvas();
        }
    }, [drawCanvas, processingAI, showSlider, imageLoaded]);

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };


    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
        setBlur(0);
        setRotation(0);
        setShowSlider(false);
        setPreEditImage(null);
    };

    const handleAIAction = async (actionName, actionFn) => {
        if (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2) {
            setError(`You need at least 2 credits for ${actionName}.`);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        setProcessingAI(true);
        setAiError(null);
        setError(null);

        // Pre-save original state for the before/after slider
        const base64Data = canvas.toDataURL('image/jpeg', 0.9);
        setPreEditImage(base64Data);

        try {
            let resultUrl;
            if (actionName === 'Replace Background') {
                const prompt = window.prompt('Enter a prompt for the new background (e.g., "A sunny beach"):') || 'A beautiful landscape';
                resultUrl = await actionFn(originalImage.originalImageURL, prompt);
            } else if (actionName === 'Remove Object') {
                const prompt = window.prompt('What object do you want to remove? (e.g., "person", "dog", "car"):') || 'object';
                resultUrl = await actionFn(originalImage.originalImageURL, prompt);
            } else {
                resultUrl = await actionFn(originalImage.originalImageURL);
            }

            const newImg = new Image();
            newImg.crossOrigin = 'anonymous';
            newImg.onload = async () => {
                imageElementRef.current = newImg;

                // Deduct 2 credits immediately
                const deducted = await deductUserCredit(currentUser.uid, 2);
                if (!deducted) {
                    setError('Failed to deduct credits. AI action aborted.');
                    setProcessingAI(false);
                    return;
                }

                // Reset basic filters
                setRotation(0);
                setBrightness(100);
                setContrast(100);
                setSaturation(100);
                setBlur(0);

                setLastEditType(`ai_${actionName.toLowerCase().replace(/ /g, '_')}`);
                setLastCreditsUsed(2);
                setProcessingAI(false);
                drawCanvas(); // Initial redraw with new source
            };
            newImg.onerror = () => {
                setError('Failed to load the AI-processed image from Cloudinary.');
                setProcessingAI(false);
            };
            newImg.src = resultUrl;

        } catch (err) {
            console.error(err);
            setAiError(err.message || `Failed to process ${actionName}. Note: Free tier Cloudinary transformations can take 10-20 seconds to load the first time.`);
            setProcessingAI(false);
            setPreEditImage(null);
        }
    };

    const handlePromptEdit = async () => {
        if (!promptText.trim()) return;
        if (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 3) {
            setError(`You need at least 3 credits for a prompt-based edit.`);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        setProcessingAI(true);
        setAiError(null);
        setError(null);

        // Save original state for slider
        const base64Data = canvas.toDataURL('image/jpeg', 0.9);
        setPreEditImage(base64Data);

        try {
            // Pass the raw prompt to the AI service — it handles type detection internally
            const resultUrl = await processPromptEdit(originalImage.originalImageURL, promptText);

            const newImg = new Image();
            newImg.crossOrigin = 'anonymous';
            newImg.onload = async () => {
                imageElementRef.current = newImg;

                // Deduct 3 credits immediately
                const deducted = await deductUserCredit(currentUser.uid, 3);
                if (!deducted) {
                    setError('Failed to deduct credits. Edit aborted.');
                    setProcessingAI(false);
                    return;
                }

                setRotation(0);
                setBrightness(100);
                setContrast(100);
                setSaturation(100);
                setBlur(0);

                setLastEditType('prompt_edit');
                setLastCreditsUsed(3);
                setLastPrompt(promptText);
                setPromptText('');

                setProcessingAI(false);
                setShowSlider(true);
                drawCanvas();
            };
            newImg.onerror = async () => {
                // Try fetching to get the actual Cloudinary error
                try {
                    const resp = await fetch(resultUrl);
                    if (!resp.ok) {
                        const errorData = await resp.json().catch(() => null);
                        const msg = errorData?.error?.message || `Cloudinary returned status ${resp.status}`;
                        setError(`AI Edit failed: ${msg}. This feature may require a paid Cloudinary plan with AI add-ons enabled.`);
                    } else {
                        setError('Failed to load the edited image. The transformation may not be supported on your Cloudinary plan.');
                    }
                } catch {
                    setError('Failed to load the edited image from Cloudinary. Please check your Cloudinary plan supports generative AI transformations.');
                }
                setProcessingAI(false);
            };
            newImg.src = resultUrl;
        } catch (err) {
            console.error(err);
            setAiError(err.message || 'Failed to process prompt edit.');
            setProcessingAI(false);
            setPreEditImage(null);
        }
    };

    const handleSave = async () => {
        const canvas = canvasRef.current;
        if (!canvas || !currentUser || !originalImage) return;

        // Check credits
        const creditsCost = lastEditType === 'basic_adjustments' ? 1 : 0;
        if (lastEditType === 'basic_adjustments' && userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 1) {
            setError('You do not have enough credits to save this basic edit.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            // Convert Canvas to Blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));

            if (!blob) throw new Error('Failed to generate image blob');

            // 1. Upload to Cloudinary and save Edit record
            await saveEditedImage(
                blob,
                currentUser.uid,
                originalImage.imageId,
                originalImage.originalImageURL,
                lastEditType,
                lastCreditsUsed,
                lastEditType === 'prompt_edit' ? lastPrompt : null
            );

            // 2. Deduct 1 credit (if basic adjustments. AI edits already deducted 2 credits)
            if (creditsCost > 0) {
                const creditDeducted = await deductUserCredit(currentUser.uid, creditsCost);
                if (!creditDeducted) {
                    throw new Error('Failed to deduct credit, upload might be left orphaned.');
                }
            }

            // 3. Download the edited image to user's PC
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            const originalName = originalImage.fileName || 'image';
            const baseName = originalName.replace(/\.[^/.]+$/, '');
            link.download = `edited_${baseName}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

            setSaving(false);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to save edit.');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <Loader2 size={40} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                <h2>Loading Editor...</h2>
            </div>
        );
    }

    if (error && !imageElementRef.current) {
        return (
            <div style={{ padding: '2rem' }}>
                <button className="btn-outline" onClick={() => navigate('/dashboard')} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    // Sliders overlay handles mouse/touch movements
    const handleSliderChange = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let x = e.clientX;
        if (e.touches && e.touches.length > 0) {
            x = e.touches[0].clientX;
        }
        const pos = Math.max(0, Math.min(x - rect.left, rect.width));
        setSliderPosition((pos / rect.width) * 100);
    };

    return (
        <div className="editor-layout" style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-main)', overflow: 'auto' }}>
            {/* Main Canvas Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                <div className="editor-topbar" style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-card)' }}>
                    <button className="btn-outline" onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                        <ArrowLeft size={16} /> Dashboard
                    </button>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '40%', textAlign: 'center' }}>Editing: {originalImage?.fileName}</div>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={saving || (lastEditType === 'basic_adjustments' && userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem' }}
                    >
                        {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                        Save ({lastEditType === 'basic_adjustments' ? 'Cost: 1 Credit' : 'Cost: 0 Credits (AI already paid)'})
                    </button>
                </div>

                <div className="editor-canvas-area" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', overflow: 'hidden', position: 'relative', minHeight: '300px' }}>
                    {error && (
                        <div style={{ position: 'absolute', top: '1rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                            <div className="error-message">{error}</div>
                        </div>
                    )}

                    {aiError && (
                        <div style={{ position: 'absolute', top: '4rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
                            <div className="error-message" style={{ backgroundColor: 'var(--error)' }}>AI Error: {aiError}</div>
                        </div>
                    )}

                    {processingAI && (
                        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem', color: 'white' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white' }}>Processing AI Request...</h3>
                            <p style={{ opacity: 0.8, color: 'white' }}>This may take a few seconds.</p>
                        </div>
                    )}

                    {/* The Canvas wrapper is constrained to 100% of the viewport container */}
                    <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <canvas
                                ref={canvasRef}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    boxShadow: 'var(--shadow-md)',
                                    backgroundColor: 'transparent',
                                    visibility: showSlider ? 'hidden' : 'visible'
                                }}
                            />

                        {/* Feature comparison slider */}
                        {showSlider && preEditImage && (
                            <div
                                style={{
                                    position: 'absolute',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    aspectRatio: `${canvasRef.current?.width || 1} / ${canvasRef.current?.height || 1}`,
                                    height: 'auto',
                                    width: 'auto',
                                    objectFit: 'contain',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-md)'
                                }}
                                onMouseMove={handleSliderChange}
                                onTouchMove={handleSliderChange}
                            >
                                <img src={preEditImage} alt="Before" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />

                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    right: 0,
                                    width: `${100 - sliderPosition}%`,
                                    overflow: 'hidden',
                                }}>
                                    <img src={canvasRef.current?.toDataURL('image/jpeg')} alt="After" style={{
                                        position: 'absolute',
                                        height: '100%',
                                        width: 'auto',
                                        right: 0,
                                        minWidth: `${100 / (100 - sliderPosition) * 100}%`,
                                        objectFit: 'contain',
                                        objectPosition: 'right'
                                    }} />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    bottom: 0,
                                    left: `${sliderPosition}%`,
                                    width: '4px',
                                    backgroundColor: 'white',
                                    cursor: 'ew-resize',
                                    transform: 'translateX(-2px)',
                                    zIndex: 10,
                                    boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '24px',
                                        height: '24px',
                                        backgroundColor: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                                    }}>
                                        <div style={{ width: '2px', height: '12px', backgroundColor: '#aaa', margin: '0 1px' }}></div>
                                        <div style={{ width: '2px', height: '12px', backgroundColor: '#aaa', margin: '0 1px' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* Editing Tools Sidebar */}
            <div className="editor-toolbar" style={{ width: '380px', backgroundColor: 'var(--bg-card)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                {/* Prompt based Editing Section */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ paddingBottom: '0.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Wand2 size={20} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Prompt AI Edit</h2>
                    </div>
                    <textarea
                        className="input"
                        placeholder="Describe how you want to edit this image..."
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        style={{ width: '100%', minHeight: '80px', resize: 'vertical', marginBottom: '0.75rem' }}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                        {["Beach background", "Cinematic lighting", "Pixar style", "Professional headshot"].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setPromptText(suggestion)}
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', cursor: 'pointer' }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                    <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        disabled={!promptText.trim() || processingAI || (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 3)}
                        onClick={handlePromptEdit}
                    >
                        Apply AI Edit (3 Credits)
                    </button>
                    {showSlider && (
                        <button
                            className="btn-outline"
                            style={{ width: '100%', marginTop: '0.75rem' }}
                            onClick={() => setShowSlider(false)}
                        >
                            Confirm & Hide Slider
                        </button>
                    )}
                </div>

                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Adjustments</h2>
                </div>

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Action Tools */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-outline" onClick={handleRotate} style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem' }}>
                            <RotateCw size={20} />
                            <span style={{ fontSize: '0.75rem' }}>Rotate 90°</span>
                        </button>
                    </div>

                    <div className="divider"></div>

                    {/* Sliders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex-between">
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Sun size={16} /> Brightness
                            </label>
                            <span className="text-sm text-muted">{brightness}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} style={{ width: '100%' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex-between">
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Contrast size={16} /> Contrast
                            </label>
                            <span className="text-sm text-muted">{contrast}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} style={{ width: '100%' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex-between">
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Activity size={16} /> Saturation
                            </label>
                            <span className="text-sm text-muted">{saturation}%</span>
                        </div>
                        <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(e.target.value)} style={{ width: '100%' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="flex-between">
                            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Droplet size={16} /> Blur
                            </label>
                            <span className="text-sm text-muted">{blur}px</span>
                        </div>
                        <input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(e.target.value)} style={{ width: '100%' }} />
                    </div>

                    <button className="btn-outline" onClick={handleReset} style={{ marginTop: '1rem', padding: '0.5rem' }}>
                        Reset Adjustments
                    </button>

                    <div className="divider" style={{ margin: '1rem 0' }}></div>

                    {/* Advanced AI Section */}
                    <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={20} style={{ color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Advanced AI</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button
                            className="btn-outline"
                            disabled={processingAI || (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2)}
                            onClick={() => handleAIAction('Remove Background', removeBackground)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', color: (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2) ? 'var(--text-muted)' : 'inherit' }}
                        >
                            <Eraser size={16} /> Remove Background (2 Credits)
                        </button>
                        <button
                            className="btn-outline"
                            disabled={processingAI || (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2)}
                            onClick={() => handleAIAction('Replace Background', replaceBackground)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', color: (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2) ? 'var(--text-muted)' : 'inherit' }}
                        >
                            <ImageIcon size={16} /> Replace Background (2 Credits)
                        </button>
                        <button
                            className="btn-outline"
                            disabled={processingAI || (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2)}
                            onClick={() => handleAIAction('Remove Object', removeObject)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', color: (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2) ? 'var(--text-muted)' : 'inherit' }}
                        >
                            <Wand2 size={16} /> Remove Object (2 Credits)
                        </button>
                        <button
                            className="btn-outline"
                            disabled={processingAI || (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2)}
                            onClick={() => handleAIAction('Enhance Face', enhanceFace)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', color: (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2) ? 'var(--text-muted)' : 'inherit' }}
                        >
                            <UserCheck size={16} /> Enhance Face (2 Credits)
                        </button>
                        <button
                            className="btn-outline"
                            disabled={processingAI || (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2)}
                            onClick={() => handleAIAction('Upscale Image', upscaleImage)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-start', color: (userProfile?.subscriptionPlan !== 'premium' && userProfile?.credits < 2) ? 'var(--text-muted)' : 'inherit' }}
                        >
                            <Maximize size={16} /> Upscale 2x (2 Credits)
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Editor;
