import React, { useState, useRef } from 'react';
import { UploadCloud, X, FileImage, AlertCircle } from 'lucide-react';
import { uploadImage } from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ImageUpload = ({ onUploadSuccess }) => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const inputRef = useRef(null);

    const hasCredits = userProfile?.subscriptionPlan === 'premium' || userProfile?.credits > 0;

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateFile = (selectedFile) => {
        setError('');

        if (!hasCredits) {
            setError('You have 0 credits remaining. Please upgrade your plan to upload images.');
            return false;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Invalid file type. Please upload a JPG, PNG, or WEBP.');
            return false;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError('File is too large. Maximum size is 10MB.');
            return false;
        }

        return true;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (validateFile(droppedFile)) {
                handleFileSelection(droppedFile);
            }
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (validateFile(selectedFile)) {
                handleFileSelection(selectedFile);
            }
        }
    };

    const handleFileSelection = (selectedFile) => {
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
    };

    const clearSelection = () => {
        setFile(null);
        setPreviewUrl(null);
        setError('');
        setProgress(0);
        if (inputRef.current) inputRef.current.value = '';
    };

    const onButtonClick = () => {
        if (hasCredits) {
            inputRef.current.click();
        } else {
            setError('You have 0 credits remaining. Please upgrade your plan to upload images.');
        }
    };

    const handleUpload = async () => {
        if (!file || !currentUser || !hasCredits) return;

        setUploading(true);
        setError('');

        // Timeout to detect stuck uploads (e.g. Storage rules blocking silently)
        const timeoutId = setTimeout(() => {
            setUploading(false);
            setProgress(0);
            setError('Upload timed out. Please check your Firebase Storage rules. Go to Firebase Console > Storage > Rules and make sure "allow read, write: if true;" is set, then try again.');
        }, 15000);

        try {
            const result = await uploadImage(file, currentUser.uid, (prog) => {
                setProgress(prog);
            });

            clearTimeout(timeoutId);
            clearSelection();
            if (onUploadSuccess) onUploadSuccess(result);
            // Redirect to editor page after successful upload
            if (result?.imageId) {
                navigate(`/dashboard/editor/${result.imageId}`);
            }

        } catch (err) {
            clearTimeout(timeoutId);
            console.error('Upload error details:', err);
            setError(`Upload failed: ${err.message || err.code || 'Unknown error'}. Check browser console (F12) for more details.`);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Upload Image</h2>

            {!hasCredits && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={20} />
                    <span>You're out of credits! Upgrade to continue using EditAI Pro.</span>
                </div>
            )}

            {error && !hasCredits === false && (
                <div className="error-message" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {!file ? (
                <div
                    className={`upload-dropzone ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    style={{
                        border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        backgroundColor: dragActive ? 'rgba(232, 67, 147, 0.05)' : 'transparent',
                        transition: 'all 0.2s',
                        cursor: hasCredits ? 'pointer' : 'not-allowed',
                        opacity: hasCredits ? 1 : 0.6
                    }}
                    onClick={onButtonClick}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleChange}
                        style={{ display: 'none' }}
                        disabled={!hasCredits}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(232,67,147,0.1), rgba(249,115,22,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E84393' }}>
                            <UploadCloud size={24} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                                <span style={{ color: 'var(--primary)' }}>Click to upload</span> or drag and drop
                            </p>
                            <p className="text-sm text-muted">JPG, PNG, WEBP (max. 10MB)</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', color: 'var(--primary)' }}>
                                <FileImage size={24} />
                            </div>
                            <div>
                                <p style={{ fontWeight: 500, fontSize: '0.875rem' }} className="truncate">{file.name}</p>
                                <p className="text-sm text-muted">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button onClick={clearSelection} style={{ padding: '0.5rem', color: 'var(--text-muted)', background: 'transparent' }} disabled={uploading}>
                            <X size={20} />
                        </button>
                    </div>

                    <div style={{ width: '100%', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.5rem', backgroundColor: 'var(--bg-main)' }}>
                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>

                    {uploading ? (
                        <div>
                            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                <span className="text-sm font-medium">Uploading...</span>
                                <span className="text-sm text-muted">{Math.round(progress)}%</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--primary)', transition: 'width 0.2s' }}></div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button className="btn-outline" onClick={clearSelection}>Cancel</button>
                            <button className="btn-primary" onClick={handleUpload}>Confirm Upload</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
