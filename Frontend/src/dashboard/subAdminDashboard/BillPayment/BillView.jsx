import React from 'react';
import './BillView.css'; 
import sblogo from "../../../img/sblogowithoutNAME.png"

const BillView = ({ bill }) => {
  const handlePrint = () => {
    window.print(); // This will trigger the browser's print dialog
  };

  return (
    <div className="bill-view">
      <div className="header">
        <h2>UTILITY BILL</h2>
        <img src={sblogo} alt="Logo" className="sblogo"/>
        <div className="company-info">
          <h4>SmartBuild</h4>
          <p>+91 9988776655</p>
          <p>info@smartbuild.com</p>
          <p>www.smartbuild.com</p>
        </div>
      </div>
      <br/>
      <div className="bill-details">
        <div className="left-section">
          <p><strong>Bill Number :</strong> {bill.billNumber}</p>
          <p><strong>Account No :</strong> {bill.consumerNumber}</p>
          <p><strong>Account Name :</strong> {bill.consumerName}</p>
          <p><strong>Address :</strong> {bill.address}</p>
        </div>
        <div className="right-section">
          <p><strong>Statement Date:</strong> {bill.statementDate}</p>
          <p><strong>Period Statement from:</strong> {bill.prvReadDate}</p>
          <p><strong>Period Statement until:</strong> {bill.crtReadDate}</p>
        </div>
      </div>
      <div className="meter-information">
        <h3>Meter Information</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Usage (kWh)</th>
              <th>Cost (per kWh)</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bill.crtReadDate}</td>
              <td>{bill.totalUnits}</td>
              <td>{bill.unitRate}</td>
              <td>{bill.totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bill-summary">
        <h3>Bill Summary</h3>
        <p><strong>Previous Charges (₹):</strong> {bill.previousBalance}</p>
        <p><strong>Current Charges (₹):</strong> {bill.currentAmount}</p>
        <p><strong>Total Amount (₹):</strong> {bill.totalAmount}</p>
        <p><strong>Due Date:</strong> {bill.dueDate}</p>
      </div>
      <div className="reminders">
        <h4>REMINDERS:</h4>
        <ul>
          <li>Present your bill Statement when paying your utility bill.</li>
          <li>Without this document, you will be required to provide the account number, account name, and amount to be paid.</li>
          <li>Please take acnowledgment after payment to make sure the payment is done.</li>
        </ul>
      </div>
      <button onClick={handlePrint} className="print-button">Print</button>
    </div>
  );
};

export default BillView;






/*
import React from 'react';
import './BillView.css'; 
import sblogo from "../../../img/sblogowithoutNAME.png"

const BillView = ({ bill }) => {
    console.log("response.data", bill);
  return (
    <div className="bill-view">
      <div className="header">
        <h2>UTILITY BILL</h2>
       
            <img src={sblogo} alt="Logo" className="sblogo"/>
       
        <div className="company-info">
          <h4>SmartBuild</h4>
          <p>+91 9988776655</p>
          <p>info@smartbuild.com</p>
          <p>www.smartbuild.com</p>
        </div>
      </div>
      <br/>
      <div className="bill-details">
        <div className="left-section">
          <p><strong>Bill Number :</strong> {bill.billNumber}</p>
          <p><strong>Account No :</strong> {bill.consumerNumber}</p>
          <p><strong>Account Name :</strong> {bill.consumerName}</p>
          <p><strong>Address :</strong> {bill.address}</p>
        </div>
        <div className="right-section">
          <p><strong>Statement Date:</strong> {bill.statementDate}</p>
          <p><strong>Period Statement from:</strong> {bill.prvReadDate}</p>
          <p><strong>Period Statement until:</strong> {bill.crtReadDate}</p>
        </div>
      </div>
      <div className="meter-information">
        <h3>Meter Information</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Usage (kWh)</th>
              <th>Cost (per kWh)</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{bill.crtReadDate}</td>
              <td>{bill.totalUnits}</td>
              <td>{bill.unitRate}</td>
              <td>{bill.totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="bill-summary">
        <h3>Bill Summary</h3>
        <p><strong>Previous Charges (₹):</strong> {bill.previousBalance}</p>
        <p><strong>Current Charges (₹):</strong> {bill.currentAmount}</p>
        <p><strong>Total Amount (₹):</strong> {bill.totalAmount}</p>
        <p><strong>Due Date:</strong> {bill.dueDate}</p>
      </div>
      <div className="reminders">
        <h4>REMINDERS:</h4>
        <ul>
          <li>Present your bill Statement when paying your utility bill.</li>
          <li>Without this document, you will be required to provide the account number, account name, and amount to be paid.</li>
          <li>Please take acnowledgment after payment to make sure the payment is done.</li>
        </ul>
      </div>
    </div>
  );
};

export default BillView;
*/