/* eslint-disable jsx-a11y/img-redundant-alt */
import { AppstoreOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, List, Modal, Upload, message } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import dayjs from 'dayjs';

const firebaseConfig = {
    apiKey: "AIzaSyClaRkzpwKvhXOh_cHm4pmU0ppRKIRNvTo",
    authDomain: "swp-upload.firebaseapp.com",
    projectId: "swp-upload",
    storageBucket: "swp-upload.appspot.com",
    messagingSenderId: "654377095573",
    appId: "1:654377095573:web:04f4a5923505b147d7669c"
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

interface ITextEditProps {
    valueProps: string;
    setValueProps: (value: string) => void;
}

const TEditor: React.FC<ITextEditProps> = ({ valueProps, setValueProps }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [imageList, setImageList] = useState<string[]>([]);

    const toolbarOptions = {
        toolbar: {
            container: [
                [{ 'font': [] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
                [{ 'align': [] }],
                ['link'],                                // Media options
                ['clean'],                                        // remove formatting button
                ['blockquote', 'code-block']
            ],
        },
    };

    const fetchImages = async () => {
        try {
            const storageRef = storage.ref('images');
            const images = await storageRef.listAll();

            const imageURLs = await Promise.all(
                images.items.map(async (imageRef) => {
                    const url = await imageRef.getDownloadURL();
                    const metadata: any = await imageRef.getMetadata();
                    return {
                        url,
                        created: dayjs(metadata.timeCreated).valueOf()
                    };
                })
            );

            imageURLs.sort((a, b) => b.created - a.created);
            setImageList(imageURLs.map((image) => image.url));
        } catch (error) {
            console.log('Fetch images error:', error);
        }
    };

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleFileInputChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.fileList && info.fileList.length > 0) {
            const file = info.fileList[0].originFileObj as File;
            setSelectedImage(file);
        }
    };

    const handleUpload = async () => {
        if (selectedImage) {
            const uploadTask = storage.ref(`/images/${selectedImage.name}`).put(selectedImage);

            uploadTask.on(
                'state_changed',
                (snapshot: any) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    message.info(`Uploading: ${progress}%`);
                },
                (error: any) => {
                    console.error(error);
                    message.error('Upload failed');
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL: any) => {
                        const imgTag = `<img src="${downloadURL}" width="400" alt="Uploaded Image" />`
                        setValueProps(valueProps + imgTag + '<br/>');
                        setModalVisible(false);
                        message.success('Upload successfully');
                    });
                }
            );
        }
    };

    const handleImageDelete = async (imageUrl: string) => {
        try {
            await storage.refFromURL(imageUrl).delete();
            setSelectedImages((prevSelectedImages) =>
                prevSelectedImages.filter((image) => image !== imageUrl)
            );
        } catch (error) {
            console.log('Delete error:', error);
        }
    };

    const handleSelectImage = (imageUrl: string) => {
        setSelectedImages((prevSelectedImages) => {
            if (prevSelectedImages.includes(imageUrl)) {
                return prevSelectedImages.filter((image) => image !== imageUrl);
            } else {
                return [...prevSelectedImages, imageUrl];
            }
        });
    };

    const handleInsertImages = () => {
        const imgTags = selectedImages.map((imageUrl) => `<img src="${imageUrl}" width="400" alt="Uploaded Image" />`);
        console.log(imgTags);
        setValueProps(valueProps + imgTags.join('<br/>'));
        setSelectedImages([]);
        setModalVisible(false);
    };

    useEffect(() => {
        fetchImages();
    }, [selectedImages, modalVisible]);

    return (
        <div>
            <Button icon={<AppstoreOutlined />} className='my-3' type="dashed" danger onClick={() => { setModalVisible(true); console.log(selectedImage) }}>
                Mở thư viện ảnh
            </Button>

            <Modal
                title="Thư viện ảnh"
                width={1000}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleInsertImages}
                okText="Insert"
            >
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

                <div className='border-1 border-solid p-4 rounded-md border-red-500'>
                    <List
                        grid={{ gutter: 16, column: 7 }}
                        dataSource={imageList}
                        renderItem={(imageUrl) => (
                            <List.Item className='flex flex-col items-center'>
                                <img src={imageUrl} alt="Uploaded Image" style={{ height: '100px', width: '100px' }} />
                                <div className='flex justify-around items-center space-x-2'>
                                    <Checkbox
                                        checked={selectedImages.includes(imageUrl)}
                                        onChange={() => handleSelectImage(imageUrl)}
                                    />
                                    <DeleteOutlined onClick={() => handleImageDelete(imageUrl)} />
                                </div>
                            </List.Item>
                        )}
                    />
                </div>

            </Modal>

            <ReactQuill theme="snow" modules={toolbarOptions} value={valueProps} onChange={setValueProps} />
        </div>
    );
};

export default TEditor;
