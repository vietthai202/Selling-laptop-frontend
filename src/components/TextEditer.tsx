import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ITextEditProps {
    valueProps: string;
    setValueProps: (value: string) => void;
}

const TextEditer: React.FC<ITextEditProps> = ({ valueProps, setValueProps }) => {

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
                ['link', 'image'],                                // Media options
                ['clean'],                                        // remove formatting button
                ['blockquote', 'code-block']
            ],
            // handlers: {
            //     image: handleImageUpload,
            // },
        },
    };

    return (
        <>
            <ReactQuill theme="snow" modules={toolbarOptions} value={valueProps} onChange={setValueProps} />
        </>
    )
}

export default TextEditer;