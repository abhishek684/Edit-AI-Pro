import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText } from 'lucide-react';

const TermsConditions = () => {
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
                        <FileText size={14} />
                        <span>Legal</span>
                    </div>
                    <h1 className="legal-title">
                        Terms & <span className="landing-gradient-text">Conditions</span>
                    </h1>
                    <p className="legal-subtitle">
                        Last updated: March 7, 2026
                    </p>
                </div>

                <div className="legal-body">
                    <section className="legal-section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing or using Edit AI Pro ("the Service"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our Service.</p>
                    </section>

                    <section className="legal-section">
                        <h2>2. Description of Service</h2>
                        <p>Edit AI Pro is a cloud-based AI-powered image editing platform that provides tools for background removal, background replacement, object removal, face enhancement, image upscaling, prompt-based editing, and manual image adjustments.</p>
                    </section>

                    <section className="legal-section">
                        <h2>3. User Accounts</h2>
                        <ul>
                            <li>You must provide accurate and complete information when creating an account.</li>
                            <li>You are responsible for maintaining the security of your account credentials.</li>
                            <li>You must be at least 13 years old to use this Service.</li>
                            <li>One person may not maintain more than one account.</li>
                            <li>You are responsible for all activities that occur under your account.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>4. Credits & Subscription Plans</h2>
                        <h3>4.1 Free Plan</h3>
                        <ul>
                            <li>New users receive 50 credits upon registration.</li>
                            <li>Credits are non-transferable and non-refundable.</li>
                            <li>Free plan includes basic filter adjustments and standard export quality.</li>
                        </ul>

                        <h3>4.2 Pro Plan (₹9/month)</h3>
                        <ul>
                            <li>500 credits per month, refreshed on each billing cycle.</li>
                            <li>Access to advanced AI tools including background removal/replacement and object removal.</li>
                            <li>High-resolution exports.</li>
                        </ul>

                        <h3>4.3 Premium Plan (₹29/month)</h3>
                        <ul>
                            <li>Unlimited credits for all editing operations.</li>
                            <li>Unrestricted prompt-based AI editing.</li>
                            <li>Priority API processing speed.</li>
                            <li>Commercial usage rights for edited images.</li>
                        </ul>

                        <h3>4.4 Credit Usage</h3>
                        <ul>
                            <li>Basic adjustments (brightness, contrast, crop, rotate) cost 1 credit to save.</li>
                            <li>AI-powered actions (background removal, face enhancement, etc.) cost 2 credits each.</li>
                            <li>Prompt-based AI editing costs 3 credits per edit.</li>
                            <li>Credits are deducted immediately upon action execution.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>5. Payments & Billing</h2>
                        <ul>
                            <li>All prices are listed in Indian Rupees (₹) and include applicable taxes.</li>
                            <li>Payments are processed through secure third-party payment gateways.</li>
                            <li>Subscriptions auto-renew unless cancelled before the billing date.</li>
                            <li>Refunds are handled on a case-by-case basis. Contact support for refund requests.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>6. Intellectual Property</h2>
                        <h3>6.1 Your Content</h3>
                        <p>You retain all rights and ownership to the images you upload and edit on our platform. By uploading images, you grant us a limited license to process and store them solely for providing the Service.</p>

                        <h3>6.2 Our Content</h3>
                        <p>The Edit AI Pro platform, including its design, code, logos, and branding, is owned by us and protected by intellectual property laws. You may not copy, modify, or distribute our platform or its components.</p>
                    </section>

                    <section className="legal-section">
                        <h2>7. Acceptable Use</h2>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Upload illegal, harmful, or offensive content.</li>
                            <li>Use the Service to create deepfakes or deceptive media without consent.</li>
                            <li>Attempt to reverse-engineer, hack, or exploit the platform.</li>
                            <li>Use automated tools to scrape or bulk-process images beyond normal usage.</li>
                            <li>Violate any applicable laws or third-party rights.</li>
                            <li>Share your account credentials with others.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>8. Limitation of Liability</h2>
                        <p>Edit AI Pro is provided "as is" without warranties of any kind. We are not liable for:</p>
                        <ul>
                            <li>Any data loss or corruption of uploaded images.</li>
                            <li>Service interruptions, downtime, or performance issues.</li>
                            <li>Results produced by AI tools that may not meet expectations.</li>
                            <li>Any indirect, incidental, or consequential damages arising from use of the Service.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>9. Termination</h2>
                        <p>We reserve the right to suspend or terminate your account if you violate these Terms. Upon termination:</p>
                        <ul>
                            <li>Your access to the Service will be revoked.</li>
                            <li>Your uploaded images may be deleted after a 30-day grace period.</li>
                            <li>No refunds will be issued for unused credits or subscription time.</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>10. Changes to Terms</h2>
                        <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated Terms. We will notify users of significant changes via email or in-app notification.</p>
                    </section>

                    <section className="legal-section">
                        <h2>11. Governing Law</h2>
                        <p>These Terms are governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in India.</p>
                    </section>

                    <section className="legal-section">
                        <h2>12. Contact Us</h2>
                        <p>For questions about these Terms, please contact us:</p>
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

export default TermsConditions;
