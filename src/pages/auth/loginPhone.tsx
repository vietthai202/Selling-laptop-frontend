import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import React, { useState } from "react";
import firebaseConfig from "../../utils/firebaseConfig";
import { loginPhone } from "../../services/auth";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

initializeApp(firebaseConfig);

const PhoneAuth: React.FC = () => {

    const navigate = useNavigate()

    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationId, setVerificationId] = useState("");
    const [code, setCode] = useState("");
    const [showVerification, setShowVerification] = useState(true);
    const [showBackButton, setShowBackButton] = useState(false);
    const [error, setError] = useState("");

    const handleSendCode = async () => {
        try {
            if (!phoneNumber || !phoneNumber.match(/^(84|0[3|5|7|8|9])+([0-9]{8})\b$/)) {
                setError("");
                message.error("Số điện thoại không hợp lệ! Hãy nhập lại");
            } else {
                setError("");
                const appVerifier = new RecaptchaVerifier("recaptcha-container", {
                    size: "normal", // "visible" or "normal"
                }, getAuth());

                let pnum = phoneNumber;
                if (pnum.startsWith("0")) {
                    pnum = "+84" + pnum.substring(1);
                }
                const response = await signInWithPhoneNumber(getAuth(), pnum, appVerifier);
                setVerificationId(response.verificationId);
                setPhoneNumber("");

                setShowVerification(false);
                setShowBackButton(true);
            }
        } catch (error) {
            console.log(error);
        }

    };

    const handleVerifyCode = async () => {
        try {
            const credential = PhoneAuthProvider.credential(verificationId, code);
            const userCredential = await signInWithCredential(getAuth(), credential);

            if (userCredential && userCredential.user) {
                const idToken = await userCredential.user.getIdToken();
                console.log(idToken);

                await loginPhone(idToken)
                    .then(() => {
                        message.success("Đăng nhập thành công!");
                        navigate("/");
                    })
                    .catch(() => {
                        message.error("Không tồn tại số điện thoại!");
                    });
            }
        } catch (error) {
            message.error("Chưa xác nhận OTP!");
            console.log(error);
        }
    };

    const handleGoBack = () => {
        setShowVerification(true);
        setShowBackButton(false);
    };

    const handlePhoneNumberKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
          handleSendCode();
        }
      };

    return (
        <div className="phone-auth-container">
            <div className="flex justify-center">
                <div className="md:w-[500px] flex flex-col space-y-4">
                    <h2>Phone Authentication</h2>
                    {showVerification && (
                        <>
                        <div className="flex flex-col space-y-2">
                            <div className="flex space-x-1">
                                <Input
                                    className="w-1/2"
                                    pattern={"/(84|0[3|5|7|8|9])+([0-9]{8})\b/"}
                                    size="large"
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    onKeyDown={handlePhoneNumberKeyPress}
                                />
                                </div>
                                <div id="recaptcha-container"></div>
                                <Button className="w-1/3" style={{ height: 40 }} danger onClick={handleSendCode}>Send Verification Code</Button>
                            </div>
                        </>
                    )}
                    {error}
                    {!showVerification && (
                        <>
                            <div className="flex space-x-2">
                                <Input
                                    className="w-1/2"
                                    size="large"
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <Button className="w-1/3" style={{ height: 40 }} danger onClick={handleVerifyCode}>Verify Code</Button>
                            </div>
                        </>
                    )}
                    {showBackButton && (
                        <Button className="w-1/4" style={{ height: 40 }} danger onClick={handleGoBack}>
                            Go Back
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhoneAuth;
