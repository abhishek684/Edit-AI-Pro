import React, { useState, useEffect } from 'react';
import { Download, Clock, Image as ImageIcon, Wand2, Loader2 } from 'lucide-react';
import { getEditHistory } from '../services/imageService';
import { useAuth } from '../context/AuthContext';

const EditHistory = ({ imageId }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            if (!imageId || !currentUser) return;
            try {
                setLoading(true);
                const edits = await getEditHistory(imageId);
                setHistory(edits);
            } catch (err) {
                console.error("Failed to load history:", err);
                setError("Could not load edit history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [imageId, currentUser]);

    // Format a Firestore timestamp to a readable string
    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        }).format(date);
    };

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `editai_${filename}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading image', error);
            alert('Failed to download image.');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                <Loader2 size={24} style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (error) {
        return <div style={{ padding: '1rem', color: 'var(--error)' }}>{error}</div>;
    }

    if (history.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Clock size={32} style={{ margin: '0 0 1rem', opacity: 0.5 }} />
                <p>No edits saved yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {history.map((edit) => (
                <div key={edit.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{
                        aspectRatio: '16/9',
                        backgroundColor: 'var(--bg-main)',
                        borderRadius: 'var(--radius)',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 0 0 1px var(--border)'
                    }}>
                        <img
                            src={edit.editedImageUrl}
                            alt="Edited"
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <div className="flex-between">
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '12px',
                                backgroundColor: edit.editType === 'prompt_edit' ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-main)',
                                color: edit.editType === 'prompt_edit' ? 'var(--primary)' : 'var(--text-main)',
                                border: '1px solid',
                                borderColor: edit.editType === 'prompt_edit' ? 'var(--primary)' : 'var(--border)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                textTransform: 'capitalize'
                            }}>
                                {edit.editType === 'prompt_edit' ? <Wand2 size={12} /> : <ImageIcon size={12} />}
                                {edit.editType.replace(/_/g, ' ')}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {formatDate(edit.createdAt)}
                            </span>
                        </div>

                        {edit.promptText && (
                            <p style={{ fontSize: '0.875rem', margin: '0.5rem 0', fontStyle: 'italic', color: 'var(--text-main)' }}>
                                "{edit.promptText}"
                            </p>
                        )}

                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                -{edit.creditsUsed} Credits
                            </span>
                            <button
                                className="btn-outline"
                                onClick={() => handleDownload(edit.editedImageUrl, edit.id.slice(0, 8))}
                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                <Download size={14} /> Download
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EditHistory;
