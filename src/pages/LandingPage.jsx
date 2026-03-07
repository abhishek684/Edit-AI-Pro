import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Eraser, ImageIcon, Wand2, UserCheck, Maximize, MessageSquare,
    Sun, Crop, RotateCw, SlidersHorizontal, Save, Sparkles,
    Upload, Paintbrush, Download, Check, Zap, ArrowRight,
    ChevronRight, Star, Shield, Clock
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const revealRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        revealRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const addRevealRef = (el) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    const features = [
        {
            icon: Eraser,
            title: 'AI Background Removal',
            desc: 'Instantly remove backgrounds from any image with one click. Perfect for product photos, portraits, and more.',
            gradient: 'linear-gradient(135deg, #E84393, #FD79A8)'
        },
        {
            icon: ImageIcon,
            title: 'AI Background Replace',
            desc: 'Replace your background with any scene — a sunny beach, city skyline, or professional studio backdrop.',
            gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)'
        },
        {
            icon: Wand2,
            title: 'AI Object Removal',
            desc: 'Remove unwanted objects, people, or text from your photos seamlessly. AI fills in the gaps naturally.',
            gradient: 'linear-gradient(135deg, #F97316, #FB923C)'
        },
        {
            icon: UserCheck,
            title: 'AI Face Enhancement',
            desc: 'Enhance facial features, smooth skin, and sharpen details automatically for stunning portraits.',
            gradient: 'linear-gradient(135deg, #10B981, #34D399)'
        },
        {
            icon: Maximize,
            title: 'AI Image Upscaling',
            desc: 'Upscale your images to 2x resolution without losing quality. Make small images print-ready.',
            gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)'
        },
        {
            icon: MessageSquare,
            title: 'Prompt-Based AI Edit',
            desc: 'Describe your edit in plain English — "Make it cinematic", "Add beach vibes" — and watch AI do it.',
            gradient: 'linear-gradient(135deg, #EC4899, #F472B6)'
        },
        {
            icon: SlidersHorizontal,
            title: 'Manual Adjustments',
            desc: 'Fine-tune brightness, contrast, saturation, and blur with precise slider controls.',
            gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)'
        },
        {
            icon: Crop,
            title: 'Crop & Rotate',
            desc: 'Crop to any aspect ratio and rotate images with instant live preview on canvas.',
            gradient: 'linear-gradient(135deg, #14B8A6, #2DD4BF)'
        },
        {
            icon: SlidersHorizontal,
            title: 'Before / After Slider',
            desc: 'Compare your original and edited image side-by-side with an interactive before/after slider.',
            gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)'
        },
        {
            icon: Save,
            title: 'One-Click Save & Export',
            desc: 'Save your edits to the cloud and download high-resolution files instantly to your device.',
            gradient: 'linear-gradient(135deg, #EF4444, #F87171)'
        }
    ];

    const steps = [
        {
            icon: Upload,
            number: '01',
            title: 'Upload Your Image',
            desc: 'Drag & drop or browse to upload your image. Supports JPG, PNG, WEBP up to 10MB.',
        },
        {
            icon: Paintbrush,
            number: '02',
            title: 'Edit with AI or Tools',
            desc: 'Use powerful AI features or manual adjustments to transform your image exactly how you want.',
        },
        {
            icon: Download,
            number: '03',
            title: 'Save & Download',
            desc: 'Export your masterpiece in high resolution. One-click save to cloud and download to your device.',
        }
    ];

    const plans = [
        {
            name: 'Free',
            price: '₹0',
            period: '',
            highlight: false,
            features: ['50 Total Credits', 'Basic filter adjustments', 'Standard export quality', '10MB file limit']
        },
        {
            name: 'Pro',
            price: '₹9',
            period: '/month',
            highlight: true,
            badge: 'MOST POPULAR',
            features: ['500 Credits/month', 'Advanced AI Tools', 'AI Object Replacement', 'High-res exports']
        },
        {
            name: 'Premium',
            price: '₹29',
            period: '/month',
            highlight: false,
            features: ['Unlimited Credits', 'Unrestricted Prompt AI', 'Priority processing', 'Commercial rights']
        }
    ];

    return (
        <div className="landing-page">
            {/* ===== Floating Background Blobs ===== */}
            <div className="landing-blobs">
                <div className="landing-blob blob-1"></div>
                <div className="landing-blob blob-2"></div>
                <div className="landing-blob blob-3"></div>
            </div>

            {/* ===== Navbar ===== */}
            <nav className="landing-nav">
                <div className="landing-nav-inner">
                    <div className="landing-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Sparkles size={24} />
                        <span>Edit AI Pro</span>
                    </div>
                    <div className="landing-nav-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it Works</a>
                        <a href="#pricing">Pricing</a>
                    </div>
                    <div className="landing-nav-btns">
                        <button className="landing-btn-ghost" onClick={() => navigate('/login')}>Login</button>
                        <button className="landing-btn-cta-sm" onClick={() => navigate('/signup')}>Sign Up Free</button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="landing-hero">
                <div className="landing-hero-content fade-up-in">
                    <div className="landing-badge">
                        <Sparkles size={14} />
                        <span>AI-Powered Image Editing Platform</span>
                    </div>
                    <h1 className="landing-hero-title">
                        Transform Your Images<br />
                        <span className="landing-gradient-text">With the Power of AI</span>
                    </h1>
                    <p className="landing-hero-sub">
                        Remove backgrounds, replace scenes, enhance faces, upscale resolution,
                        and edit with natural language prompts — all in one powerful platform.
                    </p>
                    <div className="landing-hero-btns">
                        <button className="landing-btn-cta" onClick={() => navigate('/signup')}>
                            Get Started Free <ArrowRight size={18} />
                        </button>
                        <button className="landing-btn-outline" onClick={() => navigate('/login')}>
                            Login to Dashboard <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="landing-hero-stats">
                        <div className="landing-stat">
                            <span className="landing-stat-num">10+</span>
                            <span className="landing-stat-label">AI Tools</span>
                        </div>
                        <div className="landing-stat-divider"></div>
                        <div className="landing-stat">
                            <span className="landing-stat-num">2x</span>
                            <span className="landing-stat-label">Upscaling</span>
                        </div>
                        <div className="landing-stat-divider"></div>
                        <div className="landing-stat">
                            <span className="landing-stat-num">Free</span>
                            <span className="landing-stat-label">50 Credits</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="landing-section" id="features">
                <div className="landing-section-inner">
                    <div className="landing-section-header" ref={addRevealRef}>
                        <div className="landing-badge">
                            <Wand2 size={14} />
                            <span>Powerful Features</span>
                        </div>
                        <h2 className="landing-section-title">
                            Everything You Need to<br />
                            <span className="landing-gradient-text">Edit Like a Pro</span>
                        </h2>
                        <p className="landing-section-sub">
                            From one-click AI magic to fine-grained manual controls — Edit AI Pro has it all.
                        </p>
                    </div>

                    <div className="landing-features-grid">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="landing-feature-card scroll-reveal"
                                ref={addRevealRef}
                                style={{ transitionDelay: `${(i % 5) * 0.08}s` }}
                            >
                                <div className="landing-feature-icon" style={{ background: f.gradient }}>
                                    <f.icon size={24} color="white" />
                                </div>
                                <h3 className="landing-feature-title">{f.title}</h3>
                                <p className="landing-feature-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="landing-section landing-section-alt" id="how-it-works">
                <div className="landing-section-inner">
                    <div className="landing-section-header" ref={addRevealRef}>
                        <div className="landing-badge">
                            <Clock size={14} />
                            <span>Simple Process</span>
                        </div>
                        <h2 className="landing-section-title">
                            How It Works —<br />
                            <span className="landing-gradient-text">3 Simple Steps</span>
                        </h2>
                        <p className="landing-section-sub">
                            Get started in seconds. No learning curve, no complex tools.
                        </p>
                    </div>

                    <div className="landing-steps-grid">
                        {steps.map((s, i) => (
                            <div
                                key={i}
                                className="landing-step-card scroll-reveal"
                                ref={addRevealRef}
                                style={{ transitionDelay: `${i * 0.15}s` }}
                            >
                                <div className="landing-step-number">{s.number}</div>
                                <div className="landing-step-icon-wrap">
                                    <s.icon size={32} />
                                </div>
                                <h3 className="landing-step-title">{s.title}</h3>
                                <p className="landing-step-desc">{s.desc}</p>
                                {i < steps.length - 1 && <div className="landing-step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section className="landing-section" id="pricing">
                <div className="landing-section-inner">
                    <div className="landing-section-header" ref={addRevealRef}>
                        <div className="landing-badge">
                            <Zap size={14} />
                            <span>Affordable Plans</span>
                        </div>
                        <h2 className="landing-section-title">
                            Choose Your<br />
                            <span className="landing-gradient-text">Perfect Plan</span>
                        </h2>
                        <p className="landing-section-sub">
                            Start free, upgrade anytime. No hidden fees. Cancel whenever.
                        </p>
                    </div>

                    <div className="landing-pricing-grid">
                        {plans.map((p, i) => (
                            <div
                                key={i}
                                className={`landing-pricing-card scroll-reveal ${p.highlight ? 'landing-pricing-highlight' : ''}`}
                                ref={addRevealRef}
                                style={{ transitionDelay: `${i * 0.12}s` }}
                            >
                                {p.badge && (
                                    <div className="landing-pricing-badge">
                                        <Star size={12} /> {p.badge}
                                    </div>
                                )}
                                <h3 className="landing-pricing-name">{p.name}</h3>
                                <div className="landing-pricing-price">
                                    <span className="landing-pricing-amount">{p.price}</span>
                                    {p.period && <span className="landing-pricing-period">{p.period}</span>}
                                </div>
                                <ul className="landing-pricing-features">
                                    {p.features.map((feat, j) => (
                                        <li key={j}>
                                            <Check size={16} className="landing-pricing-check" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className={p.highlight ? 'landing-btn-cta landing-btn-full' : 'landing-btn-outline landing-btn-full'}
                                    onClick={() => navigate('/signup')}
                                >
                                    {p.highlight ? 'Get Started' : 'Sign Up Free'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="landing-cta-banner" ref={addRevealRef}>
                <div className="landing-cta-banner-inner scroll-reveal" ref={addRevealRef}>
                    <h2>Ready to Transform Your Images?</h2>
                    <p>Join thousands of creators using Edit AI Pro. Start with 50 free credits today.</p>
                    <div className="landing-hero-btns">
                        <button className="landing-btn-cta-white" onClick={() => navigate('/signup')}>
                            Start Editing Free <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="landing-footer">
                <div className="landing-footer-grid">
                    <div className="landing-footer-col">
                        <div className="landing-footer-brand">
                            <Sparkles size={20} />
                            <span>Edit AI Pro</span>
                        </div>
                        <p className="landing-footer-tagline">AI-powered image editing for everyone. Transform your photos with the click of a button.</p>
                    </div>

                    <div className="landing-footer-col">
                        <h4 className="landing-footer-heading">Product</h4>
                        <div className="landing-footer-links">
                            <button onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}>Features</button>
                            <button onClick={() => { document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }}>Pricing</button>
                            <button onClick={() => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How it Works</button>
                        </div>
                    </div>

                    <div className="landing-footer-col">
                        <h4 className="landing-footer-heading">Company</h4>
                        <div className="landing-footer-links">
                            <button onClick={() => navigate('/about')}>About Us</button>
                            <button onClick={() => navigate('/contact')}>Contact Us</button>
                        </div>
                    </div>

                    <div className="landing-footer-col">
                        <h4 className="landing-footer-heading">Legal</h4>
                        <div className="landing-footer-links">
                            <button onClick={() => navigate('/privacy')}>Privacy Policy</button>
                            <button onClick={() => navigate('/terms')}>Terms & Conditions</button>
                        </div>
                    </div>
                </div>

                <div className="landing-footer-bottom">
                    <p className="landing-footer-copy">© {new Date().getFullYear()} Edit AI Pro. All rights reserved.</p>
                    <div className="landing-footer-bottom-links">
                        <button onClick={() => navigate('/login')}>Login</button>
                        <span>•</span>
                        <button onClick={() => navigate('/signup')}>Sign Up Free</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
