import React, { useState } from 'react';
import axios from 'axios';

interface UploadImageResponse {
    data: {
        link: string;
    };
}

const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        delete axios.defaults.headers.common["Authorization"];
        const response = await axios.post<UploadImageResponse>(
            'https://api.imgur.com/3/image',
            formData,
            {
                headers: {
                    Authorization: '558eba93e57cecf bd4ab8823d20b1d415028937d8aa2647ad9c1454'
                }
            }
        );

        return response.data.data.link;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const ImageUploader: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleUpload = async () => {
        if (selectedImage) {
            setUploading(true);

            try {
                const url = await uploadImage(selectedImage);
                setImageUrl(url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }

            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload} disabled={!selectedImage || uploading}>
                {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
        </div>
    );
};

export default ImageUploader;
