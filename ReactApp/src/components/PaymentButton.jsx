import React, { useState } from "react";
import GooglePayButton from "@google-pay/button-react";

function PaymentButton() {
    const paymentRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["MASTERCARD", "VISA"]
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example"
            }
          }
        }
      ],
      merchantInfo: {
        merchantId: "12345678901234567890",
        merchantName: "Demo Merchant"
      },
      transactionInfo: {
        totalPriceStatus: "FINAL",
        totalPriceLabel: "Total",
        totalPrice: "100.00",
        currencyCode: "USD",
        countryCode: "US"
      }
    };
    const [buttonColor, setButtonColor] = useState("default");
  const [buttonType, setButtonType] = useState("plain");
  const [buttonSizeMode, setButtonSizeMode] = useState("static");
  const [buttonWidth, setButtonWidth] = useState(300);
  const [buttonHeight, setButtonHeight] = useState(90);
  return(
    <GooglePayButton
    environment="TEST"Home
    buttonColor={buttonColor}
    buttonType={buttonType}
    buttonSizeMode={buttonSizeMode}
    paymentRequest={paymentRequest}
    onLoadPaymentData={paymentRequest => {
      console.log("load payment data", paymentRequest);
    }}
    style={{ width: buttonWidth, height: buttonHeight }}
  />
  );
}
export default PaymentButton;