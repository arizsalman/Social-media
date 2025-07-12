import React from 'react';
import './FAQs.css';

const FAQs = () => {
  return (
    <div className="faqs-container">
      <h1 className="faqs-title">❓ Frequently Asked Questions</h1>
      <div className="faqs-list">
        <div className="faq-item">
          <h3>How do I create a post?</h3>
          <p>Click the "Create Post" button, fill out the form, and submit. Your post will appear instantly!</p>
        </div>
        <div className="faq-item">
          <h3>Is this app free to use?</h3>
          <p>Yes! You can use all basic features for free. For advanced features, check our Pricing page.</p>
        </div>
        <div className="faq-item">
          <h3>Can I delete my posts?</h3>
          <p>Absolutely! Just click the 🗑️ icon on any post to delete it.</p>
        </div>
        <div className="faq-item">
          <h3>Is my data secure?</h3>
          <p>We take privacy seriously. Your data is stored securely and never shared with third parties.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQs; 