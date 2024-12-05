import React, { useState } from 'react';
import './Payment.css';

const Payment = ({ billNumber, amount }) => {
  const [paymentMedium, setPaymentMedium] = useState('credit_card'); // Default payment medium
  
  return (
    <div className='PaymentPage'>
      <h3>Payment</h3>
      <div className="payment-card">
        <div className="payment-details">
          <div className="payment-input">
            <label htmlFor="billNumber">Bill Number:</label>
            <input type="text" id="billNumber" value={billNumber} readOnly />
          </div>
          <div className="payment-amount">
            <label>Amount:</label>
            <span>{amount}</span>
          </div>
          <div className="payment-medium">
            <label htmlFor="paymentMedium">Payment Medium:</label>
            <select
              id="paymentMedium"
              value={paymentMedium}
              onChange={(e) => setPaymentMedium(e.target.value)}
            >
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
        </div>
        <div className="payment-buttons">
          <button className="view-bill-button">View Bill</button>
          <button className="submit-button">Submit Payment</button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
