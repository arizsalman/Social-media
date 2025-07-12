import React from 'react';
import './Pricing.css';

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h1 className="pricing-title">💸 Pricing Plans</h1>
      <div className="pricing-cards">
        <div className="pricing-card">
          <h2>Free</h2>
          <p className="price">$0<span>/mo</span></p>
          <ul>
            <li>✔️ Unlimited posts</li>
            <li>✔️ Basic support</li>
            <li>✔️ Community access</li>
          </ul>
          <button className="pricing-btn">Get Started</button>
        </div>
        <div className="pricing-card popular">
          <h2>Pro</h2>
          <p className="price">$9<span>/mo</span></p>
          <ul>
            <li>✔️ All Free features</li>
            <li>✔️ Advanced analytics</li>
            <li>✔️ Priority support</li>
          </ul>
          <button className="pricing-btn">Upgrade</button>
        </div>
        <div className="pricing-card">
          <h2>Enterprise</h2>
          <p className="price">Custom</p>
          <ul>
            <li>✔️ All Pro features</li>
            <li>✔️ Dedicated manager</li>
            <li>✔️ Custom integrations</li>
          </ul>
          <button className="pricing-btn">Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 