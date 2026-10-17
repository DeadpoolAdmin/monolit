import React from "react";

import phone from "@assets/phone.png";

import subtract from "@assets/subtract.png";
import { QRCodeCanvas } from "qrcode.react";

const ActivationMobilePhone = () => {
  return (
    <div className="activation__mobile__phone">
      <img src={phone} alt="phone" />
      <img src={subtract} alt="subtract" className="subtract" />
      <QRCodeCanvas
        style={{
          width: "22rem",
          height: "22rem",
          position: "absolute",
          top: "14.8rem",
          left: "14.8rem",
        }}
        bgColor="transparent"
        fgColor="white"
        level="L"
        value={`https://192.168.8.224:8080?token=${localStorage.getItem('token')}`}
      />
    </div>
  );
};

export default ActivationMobilePhone;
