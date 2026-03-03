import React, { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';
import { getUserImages } from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ImageGallery = ({ refreshTrigger }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const userImages = await getUserImages(currentUser.uid);
                setImages(userImages);
            } catch (err) {
                setError(`Failed to load images (Firebase Error): ${err.message}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [currentUser, refreshTrigger]);

    if (loading) {
        return (
            <div className="card" style={{ minHeight: '300px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Your Gallery</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} style={{ height: '200px', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="card" style={{ minHeight: '300px' }}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Your Gallery</h2>
                <span className="text-sm text-muted">{images.length} image{images.length !== 1 ? 's' : ''}</span>
            </div>

            {images.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)' }}>
                    <ImageIcon size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>No images yet</h3>
                    <p className="text-muted text-sm" style={{ maxWidth: '300px' }}>
                        Upload an image above to start your creative journey.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {images.map((img) => (
                        <div
                            key={img.id}
                            onClick={() => navigate(`/dashboard/editor/${img.imageId}`)}
                            style={{ position: 'relative', height: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', backgroundColor: 'var(--bg-main)', cursor: 'pointer' }}
                        >
                            <img
                                src={img.originalImageURL}
                                alt={img.fileName || 'Uploaded image'}
                                loading="lazy"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                                className="gallery-image"
                            />
                            <div
                                className="gallery-overlay"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'linear-gradient(to top, rgba(45,34,53,0.85), transparent)',
                                    padding: '1rem',
                                    color: 'white',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <p className="text-sm truncate" style={{ fontWeight: 500, color: 'white', margin: 0 }}>{img.fileName || 'Image'}</p>
                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                    {img.createdAt?.toDate ? img.createdAt.toDate().toLocaleDateString() : 'New'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
