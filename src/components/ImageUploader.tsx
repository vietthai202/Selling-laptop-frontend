import { UploadOutlined } from '@ant-design/icons';
import { Button, Image, Upload, UploadFile } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

// Khởi tạo Firebase
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

const UploadImage: React.FC = () => {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imageURLs, setImageURLs] = useState<string[]>([]);

    const handleFileInputChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.fileList && info.fileList.length > 0) {
            const files: any = info.fileList.map((file) => file.originFileObj);
            setSelectedImages(files);
        }
    };

    const handleUpload = () => {
        if (selectedImages.length > 0) {
            const uploadPromises = selectedImages.map((image) => {
                return storage.ref(`/images/${image.name}`).put(image);
            });

            Promise.all(uploadPromises)
                .then((snapshots) => {
                    const downloadURLPromises = snapshots.map((snapshot) =>
                        snapshot.ref.getDownloadURL()
                    );
                    return Promise.all(downloadURLPromises);
                })
                .then((urls) => {
                    setImageURLs(urls);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <div>
            <Upload
                multiple
                beforeUpload={() => false}
                onChange={handleFileInputChange}
            >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <Button type="primary" onClick={handleUpload}>
                Tải lên
            </Button>
            {imageURLs.map((url, index) => (
                <Image key={index} src={url} alt={`Uploaded ${index}`} />
            ))}
        </div>
    );
};

export default UploadImage;
