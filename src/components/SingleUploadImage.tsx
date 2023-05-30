import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import React, { useState } from 'react';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyClaRkzpwKvhXOh_cHm4pmU0ppRKIRNvTo",
    authDomain: "swp-upload.firebaseapp.com",
    projectId: "swp-upload",
    storageBucket: "swp-upload.appspot.com",
    messagingSenderId: "654377095573",
    appId: "1:654377095573:web:04f4a5923505b147d7669c"
};

firebase.initializeApp(firebaseConfig);
const storage = (firebase as any).storage();

interface IUploadSingleProps {
    valueProps: string | null;
    setValueProps: (value: string) => void;
}

const UploadSingleImage: React.FC<IUploadSingleProps> = ({ valueProps, setValueProps }) => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleFileInputChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.fileList && info.fileList.length > 0) {
            const file = info.fileList[0].originFileObj as File;
            setSelectedImage(file);
        }
    };

    const handleUpload = () => {
        if (selectedImage) {
            const uploadTask = storage.ref(`/images/${selectedImage.name}`).put(selectedImage);

            uploadTask.on(
                'state_changed',
                (snapshot: any) => {
                    // Progress monitoring
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    message.info(`Uploading: ${progress}%`);
                },
                (error: any) => {
                    // Error handling
                    console.error(error);
                    message.error('Upload failed');
                },
                () => {
                    // Upload completed
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL: any) => {
                        setValueProps(downloadURL);
                        message.success('Upload successfully');
                    });
                }
            );
        }
    };

    return (
        <>
            <div className='flex space-x-2 mb-3'>
                <Upload
                    beforeUpload={() => false}
                    onChange={handleFileInputChange}
                >
                    <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
                <Button type="dashed" danger onClick={handleUpload}>
                    Tải lên
                </Button>
            </div>
            <div>
                {valueProps && <img className='w-56' src={valueProps} alt="Uploaded" />}
            </div>
        </>
    );
};

export default UploadSingleImage;
