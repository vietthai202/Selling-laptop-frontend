import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Image, List, Modal, Upload, message } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import dayjs from 'dayjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import firebaseConfig from '../utils/firebaseConfig';

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

interface ListProductImageProps {
    imageUrls: string[];
    setImageUrls: (imageUrls: string[]) => void;
}

const ListProductImage: React.FC<ListProductImageProps> = ({ imageUrls, setImageUrls }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [imageList, setImageList] = useState<string[]>([]);

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
        setImageUrls(imageUrls.concat(selectedImages).filter((item, index, self) => self.indexOf(item) === index));
        setSelectedImages([]);
        setModalVisible(false);
    };

    const handleDelete = (url: string) => {
        message.success(`Image deleted successfully!`);
    };


    useEffect(() => {
        fetchImages();
    }, [selectedImages, modalVisible]);

    return (
        <div>
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
                                <img src={imageUrl} alt="" style={{ height: '100px', width: '100px' }} />
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
            <List
                grid={{ gutter: 16, column: 8 }}
                dataSource={imageUrls}
                renderItem={(url: string) => (
                    <List.Item
                        actions={[
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(url)}
                            />
                        ]}
                    >
                        <Image className='w-24 h-24' src={url} alt="Product" />
                    </List.Item>

                )}
                footer={
                    <Button danger icon={<PlusOutlined />} className='my-3' type="dashed" onClick={() => { setModalVisible(true); console.log(selectedImage) }}>
                        Thêm ảnh
                    </Button>
                }
            />
        </div>
    );
};

export default ListProductImage;
