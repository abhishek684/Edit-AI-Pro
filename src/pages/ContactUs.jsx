import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Mail, MessageCircle, MapPin, Clock, Send } from 'lucide-react';

const ContactUs = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

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
                        <MessageCircle size={14} />
                        <span>Get in Touch</span>
                    </div>
                    <h1 className="legal-title">
                        Contact <span className="landing-gradient-text">Us</span>
                    </h1>
                    <p className="legal-subtitle">
                        Have a question, suggestion, or need help? We're here for you.
                    </p>
                </div>

                <div className="contact-grid">
                    {/* Contact Info Cards */}
                    <div className="contact-info">
                        <div className="contact-card">
                            <div className="contact-card-icon" style={{ background: 'linear-gradient(135deg, #E84393, #FD79A8)' }}>
                                <Mail size={22} color="white" />
                            </div>
                            <div>
                                <h4>Email</h4>
                                <p>support@editaipro.com</p>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-card-icon" style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}>
                                <Clock size={22} color="white" />
                            </div>
                            <div>
                                <h4>Response Time</h4>
                                <p>Within 24 hours</p>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-card-icon" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                                <MapPin size={22} color="white" />
                            </div>
                            <div>
                                <h4>Location</h4>
                                <p>India</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-wrap">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <h3>Send us a message</h3>

                            {submitted && (
                                <div className="contact-success">
                                    ✅ Thank you! Your message has been sent. We'll get back to you within 24 hours.
                                </div>
                            )}

                            <div className="contact-form-row">
                                <div className="contact-field">
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="contact-field">
                                    <label>Your Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="contact-field">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="How can we help?"
                                    required
                                    className="form-input"
                                />
                            </div>

                            <div className="contact-field">
                                <label>Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us more about your question or feedback..."
                                    required
                                    className="form-input"
                                    rows={5}
                                    style={{ resize: 'vertical' }}
                                />
                            </div>

                            <button type="submit" className="landing-btn-cta landing-btn-full">
                                <Send size={16} /> Send Message
                            </button>
                        </form>
                    </div>
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

export default ContactUs;
