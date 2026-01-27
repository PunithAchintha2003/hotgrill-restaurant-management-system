import React from "react";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";

const PrivacyPolicy = () => {
    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-br from-[#333333] via-[#333333] to-[#333333] py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Privacy <span className="text-[#FF991C]">Policy</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Last Updated: January 2026</p>
                    </div>

                    {/* Content Container */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 space-y-10 text-gray-300 leading-relaxed">
                        
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">1. Introduction</h2>
                            <p>
                                Welcome to HotGrill. We respect your privacy and are committed to protecting your personal data. 
                                This privacy policy will inform you as to how we look after your personal data when you visit our website 
                                and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">2. Information We Collect</h2>
                            <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF991C]">
                                <li><strong className="text-white">Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong className="text-white">Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                                <li><strong className="text-white">Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
                                <li><strong className="text-white">Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">3. How We Use Your Data</h2>
                            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#FF991C]">
                                <li>To register you as a new customer.</li>
                                <li>To process and deliver your order including managing payments, fees and charges.</li>
                                <li>To manage our relationship with you which will include notifying you about changes to our terms or privacy policy.</li>
                                <li>To improve our website, products/services, marketing, customer relationships and experiences.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">4. Data Security</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. 
                                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">5. Cookies</h2>
                            <p>
                                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. 
                                If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">6. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at: 
                                <span className="text-[#FF991C] block mt-2 font-bold">info@hotgrill.com</span>
                            </p>
                        </section>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;