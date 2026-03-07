import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
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
                        <Shield size={14} />
                        <span>Privacy Policy</span>
                    </div>
                    <h1 className="legal-title">
                        Privacy <span className="landing-gradient-text">Policy</span>
                    </h1>
                    <p className="legal-subtitle">
                        Last updated: March 7, 2026
                    </p>
                </div>

                <div className="legal-body">
                    <section className="legal-section">
                        <h2>1. Introduction</h2>
                        <p>Welcome to Edit AI Pro ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered image editing platform.</p>
                        <p>By using Edit AI Pro, you agree to the collection and use of information in accordance with this policy.</p>
                    </section>

                    <section className="legal-section">
                        <h2>2. Information We Collect</h2>
                        <h3>2.1 Personal Information</h3>
                        <p>When you register for an account, we may collect:</p>
                        <ul>
                            <li>Full name and display name</li>
                            <li>Email address</li>
                            <li>Profile photo (if provided via Google Sign-In)</li>
                            <li>Payment information (processed securely via third-party payment providers)</li>
                        </ul>

                        <h3>2.2 Usage Data</h3>
                        <p>We automatically collect certain information when you use our service:</p>
                        <ul>
                            <li>Browser type and version</li>
                            <li>Pages visited and features used</li>
                            <li>Time and date of your visits</li>
                            <li>Credit usage and subscription history</li>
                        </ul>

                        <h3>2.3 Image Data</h3>
                        <p>When you upload images for editing:</p>
                        <ul>
                            <li>Images are stored securely on Cloudinary's cloud infrastructure</li>
                            <li>Images are associated with your user account</li>
                            <li>We do not use your images for training AI models</li>
                            <li>You retain full ownership and copyright of your images</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process your transactions and manage your subscriptions</li>
                            <li>Send you service-related notifications and updates</li>
                            <li>Respond to your comments, questions, and support requests</li>
                            <li>Monitor and analyze usage patterns to improve user experience</li>
                            <li>Detect, prevent, and address technical issues or fraud</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>4. Data Storage & Security</h2>
                        <p>Your data is stored using industry-standard security measures:</p>
                        <ul>
                            <li><strong>Authentication:</strong> Managed by Firebase Authentication with encrypted credentials</li>
                            <li><strong>Database:</strong> Cloud Firestore with strict security rules limiting access to authorized users only</li>
                            <li><strong>Image Storage:</strong> Cloudinary with secure, access-controlled URLs</li>
                            <li><strong>Transmission:</strong> All data is transmitted over HTTPS/TLS encryption</li>
                        </ul>
                    </section>

                    <section className="legal-section">
                        <h2>5. Third-Party Services</h2>
                        <p>We use the following third-party services that may collect information:</p>
                        <ul>
                            <li><strong>Google Firebase</strong> — Authentication and database services</li>
                            <li><strong>Cloudinary</strong> — Image storage and AI transformations</li>
                            <li><strong>Instamojo / Payment Providers</strong> — Payment processing</li>
                        </ul>
                        <p>Each third-party service has its own privacy policy governing data use.</p>
                    </section>

                    <section className="legal-section">
                        <h2>6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access your personal data stored with us</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account and associated data</li>
                            <li>Opt out of marketing communications</li>
                            <li>Export your data in a portable format</li>
                        </ul>
                        <p>To exercise any of these rights, please contact us at <strong>support@editaipro.com</strong>.</p>
                    </section>

                    <section className="legal-section">
                        <h2>7. Cookies</h2>
                        <p>Edit AI Pro uses essential cookies for authentication and session management. We do not use tracking cookies or third-party advertising cookies.</p>
                    </section>

                    <section className="legal-section">
                        <h2>8. Children's Privacy</h2>
                        <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent and believe your child has provided us with personal data, please contact us.</p>
                    </section>

                    <section className="legal-section">
                        <h2>9. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
                    </section>

                    <section className="legal-section">
                        <h2>10. Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, please contact us:</p>
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

export default PrivacyPolicy;
