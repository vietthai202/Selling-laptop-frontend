import { Button, Form, Input, message } from "antd";
import { initializeApp } from "firebase/app";
import { PhoneAuthProvider, RecaptchaVerifier, getAuth, signInWithCredential, signInWithPhoneNumber } from "firebase/auth";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginPhone } from "../../services/auth";
import firebaseConfig from "../../utils/firebaseConfig";
import { numberReg } from "../../utils/validate";



initializeApp(firebaseConfig);

const PhoneAuth: React.FC = () => {

    const [form] = Form.useForm();

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInputChange = (value: string, index: number) => {
        if (value.length === 1 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };


    const navigate = useNavigate()

    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationId, setVerificationId] = useState("");
    const [showVerification, setShowVerification] = useState(true);

    const handleSendCode = async () => {
        try {
            if (!phoneNumber || !phoneNumber.match(/^(84|0[3|5|7|8|9])+([0-9]{8})\b$/)) {
                message.error("Số điện thoại không hợp lệ! Hãy nhập lại");
            } else {
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
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleVerifyCode = async () => {
        form
            .validateFields()
            .then(async (values: any) => {
                if (numberReg.test(values.num1) && numberReg.test(values.num2) && numberReg.test(values.num3) && numberReg.test(values.num4) && numberReg.test(values.num5) && numberReg.test(values.num6)) {
                    let OTPCODE = values.num1 + values.num2 + values.num3 + values.num4 + values.num5 + values.num6;
                    try {
                        const credential = PhoneAuthProvider.credential(verificationId, OTPCODE);
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
                } else {
                    message.error("Nhập OTP sai!")
                }
            })
            .catch((errorInfo) => {
                message.error("Có lỗi kìa!!!");
                console.log('Form validation failed:', errorInfo);
            });
    };

    const handleGoBack = () => {
        setShowVerification(true);
    };

    const handlePhoneNumberKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendCode();
        }
    };

    return (
        <div className="relative flex flex-col justify-center overflow-hidden bg-gray-50 py-12">
            <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="font-semibold text-3xl">
                            <p>Phone Verification</p>
                        </div>
                    </div>

                    <div>
                        {
                            showVerification ?
                                <div className="flex flex-col space-y-8">
                                    <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                                        <div className="w-full h-14">
                                            <Input
                                                className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-red-700"
                                                pattern={"/(84|0[3|5|7|8|9])+([0-9]{8})\b/"}
                                                size="large"
                                                type="text"
                                                placeholder="Enter your phone number"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                onKeyDown={handlePhoneNumberKeyPress}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div id="recaptcha-container"></div>
                                    </div>
                                    <div className="flex flex-col space-y-5">
                                        <div>
                                            <button onClick={handleSendCode} className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-red-700 border-none text-white text-sm shadow-sm">
                                                Send Verification Code
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                :
                                <Form
                                    form={form}
                                    name="newCouponForm"
                                    layout="vertical"
                                    onFinish={handleVerifyCode}
                                    autoComplete="off"
                                >
                                    <div className="flex flex-col space-y-16">
                                        <div className="flex flex-row items-center justify-between mx-auto w-full space-x-4">

                                            <Form.Item
                                                className=""
                                                name="num1"
                                                rules={[{ required: true, message: '' }]}
                                            >
                                                <div className="w-16 h-16 ">
                                                    <Input ref={ref => (inputRefs.current[0] = ref ? ref.input : null)} onChange={event => handleInputChange(event.target.value, 0)}
                                                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-red-700" />
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                className=""
                                                name="num2"
                                                rules={[{ required: true, message: '' }]}
                                            >
                                                <div className="w-16 h-16 ">
                                                    <Input ref={ref => (inputRefs.current[1] = ref ? ref.input : null)} onChange={event => handleInputChange(event.target.value, 1)}
                                                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-red-700" />
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                className=""
                                                name="num3"
                                                rules={[{ required: true, message: '' }]}
                                            >
                                                <div className="w-16 h-16 ">
                                                    <Input ref={ref => (inputRefs.current[2] = ref ? ref.input : null)} onChange={event => handleInputChange(event.target.value, 2)}
                                                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-red-700" />
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                className=""
                                                name="num4"
                                                rules={[{ required: true, message: '' }]}
                                            >
                                                <div className="w-16 h-16 ">
                                                    <Input ref={ref => (inputRefs.current[3] = ref ? ref.input : null)} onChange={event => handleInputChange(event.target.value, 3)}
                                                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-red-700" />
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                className=""
                                                name="num5"
                                                rules={[{ required: true, message: '' }]}
                                            >
                                                <div className="w-16 h-16 ">
                                                    <Input ref={ref => (inputRefs.current[4] = ref ? ref.input : null)} onChange={event => handleInputChange(event.target.value, 4)}
                                                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-red-700" />
                                                </div>
                                            </Form.Item>
                                            <Form.Item
                                                className=""
                                                name="num6"
                                                rules={[{ required: true, message: '' }]}
                                            >
                                                <div className="w-16 h-16 ">
                                                    <Input ref={ref => (inputRefs.current[5] = ref ? ref.input : null)} onChange={event => handleInputChange(event.target.value, 5)}
                                                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-red-700" />
                                                </div>
                                            </Form.Item>
                                        </div>

                                        <div className="flex flex-col space-y-5">
                                            <div>
                                                <Button htmlType="submit" className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-red-700 border-none text-white text-sm shadow-sm">
                                                    Verify Code
                                                </Button>
                                            </div>

                                            <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                                <div>Didn't recieve code?</div><div onClick={handleGoBack} className="flex flex-row items-center cursor-pointer text-red-600">Resend</div>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneAuth;
