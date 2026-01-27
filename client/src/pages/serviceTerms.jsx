import React from "react";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";

const TermsOfService = () => {
    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-br from-[#333333] via-[#333333] to-[#333333] py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Terms of <span className="text-[#FF991C]">Service</span>
                        </h1>
                        <p className="text-gray-400 text-lg">Last Updated: January 2026</p>
                    </div>

                    {/* Content Container */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 sm:p-12 space-y-10 text-gray-300 leading-relaxed">
                        
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and placing an order with HotGrill, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. 
                                These terms apply to the entire website and any email or other type of communication between you and HotGrill.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">2. Orders and Payments</h2>
                            <p className="mb-4">
                                When you place an order through our website, you are offering to purchase products subject to these terms.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF991C]">
                                <li>All orders are subject to availability and confirmation of the order price.</li>
                                <li>We reserve the right to refuse any order placed with us.</li>
                                <li>Prices for our products are subject to change without notice.</li>
                                <li>We accept payments via credit card, debit card, and cash on delivery.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">3. Delivery Policy</h2>
                            <p>
                                Delivery times may vary according to availability and subject to any delays resulting from postal delays or force majeure for which we will not be responsible. 
                                Please ensure someone is available to receive the order at the delivery address provided.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">4. Cancellation and Refunds</h2>
                            <p>
                                Orders can be cancelled within 5 minutes of placing them. After this period, we cannot guarantee cancellation as food preparation may have started. 
                                Refunds for online payments will be processed to the original payment method within 5-7 business days if the cancellation is approved.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">5. Intellectual Property</h2>
                            <p>
                                The website and its original content, features, and functionality are owned by HotGrill and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#FF991C] pl-4">6. Changes To These Terms</h2>
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default TermsOfService;