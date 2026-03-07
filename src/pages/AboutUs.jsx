import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Target, Users, Heart, Zap, Globe } from 'lucide-react';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="legal-page">
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <div className="landing-logo" onClick={() => navigate('/')}>
                        <Sparkles size={24} />
                        <span>Edit AI Pro</span>
                    </div>
                    <div className="landing-nav-btns">
                        <button className="landing-btn-ghost" onClick={() => navigate('/login')}>Login</button>
                        <button className="landing-btn-cta-sm" onClick={() => navigate('/signup')}>Sign Up Free</button>
                    </div>
                </div>
            </nav>

            <div className="legal-content">
                <button className="legal-back-btn" onClick={() => navigate('/')}>
                    <ArrowLeft size={16} /> Back to Home
                </button>

                <div className="legal-header">
                    <div className="landing-badge">
                        <Users size={14} />
                        <span>About Us</span>
                    </div>
                    <h1 className="legal-title">
                        About <span className="landing-gradient-text">Edit AI Pro</span>
                    </h1>
                    <p className="legal-subtitle">
                        Empowering creators with AI-powered image editing tools that are accessible, affordable, and incredibly powerful.
                    </p>
                </div>

                <div className="legal-body">
                    <section className="legal-section">
                        <div className="about-hero-grid">
                            <div className="about-card">
                                <div className="about-card-icon" style={{ background: 'linear-gradient(135deg, #E84393, #FD79A8)' }}>
                                    <Target size={28} color="white" />
                                </div>
                                <h3>Our Mission</h3>
                                <p>To democratize professional image editing by making AI-powered tools available to everyone — from students and freelancers to agencies and enterprises.</p>
                            </div>
                            <div className="about-card">
                                <div className="about-card-icon" style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}>
                                    <Heart size={28} color="white" />
                                </div>
                                <h3>Our Vision</h3>
                                <p>A world where anyone can create stunning, professional-quality images without needing years of expertise or expensive software licenses.</p>
                            </div>
                            <div className="about-card">
                                <div className="about-card-icon" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                                    <Zap size={28} color="white" />
                                </div>
                                <h3>Why Edit AI Pro?</h3>
                                <p>We combine cutting-edge AI with an intuitive interface. One click to remove backgrounds, enhance faces, or upscale images — no learning curve required.</p>
                            </div>
                        </div>
                    </section>

                    <section className="legal-section">
                        <h2>What We Offer</h2>
                        <p>Edit AI Pro is a cloud-based SaaS platform that provides a comprehensive suite of AI-powered image editing tools:</p>
                        <ul>
                            <li><strong>AI Background Removal & Replacement</strong> — Instantly remove or swap backgrounds with AI-generated scenes.</li>
                            <li><strong>AI Object Removal</strong> — Seamlessly erase unwanted objects, people, or text from photos.</li>
                            <li><strong>AI Face Enhancement</strong> — Automatically enhance facial features and sharpen details for portrait perfection.</li>
                            <li><strong>AI Image Upscaling</strong> — Upscale images to 2x resolution without losing quality.</li>
                            <li><strong>Prompt-Based Editing</strong> — Describe edits in natural language, and let AI do the heavy lifting.</li>
                            <li><strong>Manual Adjustments</strong> — Fine-tune brightness, contrast, saturation, blur, crop, and rotation.</li>
                            <li><strong>Before/After Comparison</strong> — Interactive slider to compare original vs. edited images.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>Our Technology</h2>
                        <p>Edit AI Pro is built on modern web technologies and leverages industry-leading AI services:</p>
                        <ul>
                            <li><strong>Cloudinary AI</strong> — Powering our generative AI transformations including background removal/replacement, object removal, and image upscaling.</li>
                            <li><strong>React & Vite</strong> — Fast, responsive frontend for a seamless editing experience.</li>
                            <li><strong>Firebase</strong> — Secure authentication and real-time cloud database for user data.</li>
                            <li><strong>Canvas API</strong> — Real-time image manipulation with hardware-accelerated rendering.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>Contact Us</h2>
                        <p>Have questions, feedback, or partnership inquiries? We'd love to hear from you.</p>
                        <p>📧 Email: <strong>support@editaipro.com</strong></p>
                        <p>🌐 Website: <strong>www.editaipro.com</strong></p>
                    </section>
                </div>
            </div>

            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-brand">
                        <Sparkles size={20} />
                        <span>Edit AI Pro</span>
                    </div>
                    <p className="landing-footer-copy">© {new Date().getFullYear()} Edit AI Pro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;
