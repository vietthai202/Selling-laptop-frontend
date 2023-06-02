import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, InputRef, Select, Space, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadSingleImage from '../../../components/SingleUploadImage';
import routes from '../../../routes';
import { isLoggedIn } from '../../../services/auth';
import { addBrand, getAllBrands } from '../../../services/brands';
import { IBrand } from '../../../types/brand';
import { convertToSlug } from '../../../utils/string';
import TextEditer from '../../../components/TextEditer';
import { IProductCategory } from '../../../types/productCategory';
import { addProductCategory, getAllProductCategories } from '../../../services/productCategory';
import { IProduct } from '../../../types/product';
import { createProduct } from '../../../services/product';
import { getAllMetaDataGroup } from '../../../services/metadataGroup';
import { IMetadata, IMetadataGroup } from '../../../types/metadatagroup';
import { createMultipleMetadata } from '../../../services/metadata';

const { TextArea } = Input;

const AddProduct: React.FC = () => {
    const navigate = useNavigate();

    const inputRef = useRef<InputRef>(null);

    const [categoryName, setCategoryName] = useState('');
    const [categoryDesc, setCategoryDesc] = useState('');
    const [productCategories, setCategories] = useState<IProductCategory[]>();

    const [brandName, setBrandName] = useState('');
    const [brandDesc, setBrandDesc] = useState('');
    const [brandImage, setBrandImage] = useState('');
    const [brands, setBrands] = useState<IBrand[]>();

    const [textEditValue, setTextEditValue] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const [listMetadataGroup, setListMetadataGroup] = useState<IMetadataGroup[]>();
    const [metadataInGroup, setMetadataInGroup] = useState<IMetadata[]>([]);
    const [itemMetadataTitle, setItemMetadateTitle] = useState<string[]>([""]);
    const [itemMetadataContent, setItemMetadateContent] = useState<string[]>([""]);

    const formatNumber = (value: any) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const parseNumber = (value: any) => {
        return value.replace(/(,*)/g, '');
    };

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(event.target.value);
    };

    const addCategory = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        const newCate: IProductCategory = {
            id: 1,
            name: categoryName,
            description: categoryDesc,
            slug: convertToSlug(categoryName)
        }

        if (newCate) {
            // await addProductCategory(newCate)
            //     .then((data: IBlogCategory) => {
            //         const cateReturn: IBlogCategory = data;
            //         items && setItems([...items, cateReturn]);
            //         setCategoryName('');
            //         setCategoryDesc('');
            //         message.success("Tạo danh mục thành công!");
            //     }).catch(() => {
            //         message.error("Lỗi khi tạo danh mục!");
            //     }).finally(() => {
            //         setTimeout(() => {
            //             inputRef.current?.focus();
            //         }, 0);
            //     })
        } else {
            message.error("Lỗi khi tạo danh mục!");
        }
    };

    const addBrand = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        const newCate: IProductCategory = {
            id: 1,
            name: categoryName,
            description: categoryDesc,
            slug: convertToSlug(categoryName)
        }

        if (newCate) {
            // await createCategory(newCate)
            //     .then((data: IBlogCategory) => {
            //         const cateReturn: IBlogCategory = data;
            //         items && setItems([...items, cateReturn]);
            //         setCategoryName('');
            //         setCategoryDesc('');
            //         message.success("Tạo danh mục thành công!");
            //     }).catch(() => {
            //         message.error("Lỗi khi tạo danh mục!");
            //     }).finally(() => {
            //         setTimeout(() => {
            //             inputRef.current?.focus();
            //         }, 0);
            //     })
        } else {
            message.error("Lỗi khi tạo danh mục!");
        }
    };


    const addMetadata = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, group_id: number) => {
        e.preventDefault();

        const newMetadata: IMetadata = {
            id: 0,
            icon: '',
            iconType: '',
            title: itemMetadataTitle[group_id],
            content: itemMetadataContent[group_id],
            laptop_id: 0,
            group_id: group_id
        }

        if (newMetadata) {
            metadataInGroup && setMetadataInGroup([...metadataInGroup, newMetadata]);
        } else {
            message.error("Lỗi khi tạo danh mục!");
        }
    };

    const handleInputTitleChange = (index: number, value: string) => {
        const newInputValues = [...itemMetadataTitle];
        newInputValues[index] = value;
        setItemMetadateTitle(newInputValues);
    };

    const handleInputContentChange = (index: number, value: string) => {
        const newInputValues = [...itemMetadataContent];
        newInputValues[index] = value;
        setItemMetadateContent(newInputValues);
    };

    const onFinish = async (values: any) => {
        const username = localStorage.getItem("username");

        if (isLoggedIn() && username) {

            const product: IProduct = {
                id: 0,
                userName: username,
                title: values.title,
                metaTitle: values.metaTitle,
                slug: convertToSlug(values.title),
                summary: textEditValue,
                image: image,
                sku: '', // xử lý backend
                price: values.price,
                discount: values.discount,
                quantity: values.quantity,
                categoryId: values.categoryId,
                brandId: values.brandId
            }

            console.log(metadataInGroup);
            await createProduct(product)
                .then((data: number) => {
                    const laptopId = data;
                    createMultipleMetadata(metadataInGroup, laptopId)
                    message.success("Thành công!");
                    navigate(routes.ADMIN_PRODUCTS);
                })
                .catch(() => {
                    message.error("Thất bại!");
                });
        } else {
            message.success("Hết hạn, đăng nhập lại!");
            navigate(routes.LOGIN);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        getAllProductCategories().then((data: IProductCategory[]) => {
            setCategories(data);
        })

        getAllBrands().then((data: IBrand[]) => {
            setBrands(data);
        })

        getAllMetaDataGroup().then((data: IMetadataGroup[]) => {
            setListMetadataGroup(data);
        })
    }, []);

    return (
        <div>
            <Form
                name="newBlogForm"
                layout="vertical"
                labelCol={{ span: 8 }}
                style={{ minWidth: 400 }}
                initialValues={{ title: "111123", categoryId: 2, brandId: 2, price: 111, discount: 111, quantity: 111, metaTitle: "hahaha" }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
                >
                    <Input size="large" placeholder='Tiêu đề nhãn hàng!' />
                </Form.Item>

                <Form.Item
                    label="Danh mục"
                    name="categoryId"
                    rules={[{ required: true, message: 'Chọn danh mục!' }]}
                >
                    <Select
                        placeholder="Chọn danh mục hoặc tạo mới!"
                        size='large'
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                    {/* <div className='flex flex-col'>
                                        <Input
                                            placeholder="Nhập tên danh mục mới!"
                                            ref={inputRef}
                                            value={categoryName}
                                            onChange={onNameChange}
                                        />
                                        <Divider style={{ margin: '8px 0' }} />
                                        <TextArea
                                            placeholder="Mô tả về danh mục"
                                            value={categoryDesc}
                                            onChange={(e) => setCategoryDesc(e.target.value)}
                                            autoSize={{ minRows: 3, maxRows: 5 }}
                                        />
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Button danger icon={<PlusOutlined />} onClick={addCategory}>
                                            Thêm danh mục
                                        </Button>
                                    </div> */}
                                </Space>
                            </>
                        )}
                        options={productCategories && productCategories.map((item: IProductCategory) => ({ label: item.name, value: item.id }))}
                    />

                </Form.Item>

                <Form.Item
                    label="Thương hiệu"
                    name="brandId"
                    rules={[{ required: true, message: 'Chọn danh thương hiệu!' }]}
                >
                    <Select
                        placeholder="Chọn thương hiệu hoặc tạo mới!"
                        size='large'
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                    {/* <div className='flex flex-col'>
                                        <Input
                                            placeholder="Nhập tên thương hiệu mới!"
                                            ref={inputRef}
                                            value={brandName}
                                            onChange={(e) => setBrandName(e.target.value)}
                                        />
                                        <Divider style={{ margin: '8px 0' }} />
                                        <TextArea
                                            placeholder="Mô tả thương hiệu"
                                            value={brandDesc}
                                            onChange={(e) => setBrandDesc(e.target.value)}
                                            autoSize={{ minRows: 3, maxRows: 5 }}
                                        />
                                        <Divider style={{ margin: '8px 0' }} />
                                        <UploadSingleImage valueProps={brandImage} setValueProps={setBrandImage} />
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Button danger icon={<PlusOutlined />} onClick={addBrand}>
                                            Thêm brand
                                        </Button>
                                    </div> */}
                                </Space>
                            </>
                        )}
                        options={brands && brands.map((item: IBrand) => ({ label: item.name, value: item.id }))}
                    />

                </Form.Item>

                <div className='flex items-center justify-around'>
                    <Form.Item
                        style={{ minWidth: 300 }}
                        label="Giá sản phẩm"
                        name="price"
                        rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
                    >
                        <InputNumber size="large" defaultValue={0} formatter={formatNumber} parser={parseNumber} />
                    </Form.Item>

                    <Form.Item
                        style={{ minWidth: 300 }}
                        label="Giảm giá"
                        name="discount"
                        rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
                    >
                        <InputNumber size="large" min={0} max={100} defaultValue={0} />
                    </Form.Item>

                    <Form.Item
                        style={{ minWidth: 300 }}
                        label="Số lượng"
                        name="quantity"
                        rules={[{ required: true, message: 'Hãy nhập tiêu đề!' }]}
                    >
                        <InputNumber size="large" formatter={formatNumber} parser={parseNumber} defaultValue={0} />
                    </Form.Item>
                </div>

                <Form.Item
                    label="Meta title"
                    name="metaTitle"
                    rules={[{ required: true, message: 'Hãy nhập mô tả ngắn!' }]}
                >
                    <TextArea
                        size='large'
                        placeholder="Mô tả về thương hiệu"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </Form.Item>

                <Form.Item
                    label="Ảnh đại diện"
                >
                    <UploadSingleImage valueProps={image} setValueProps={setImage} />
                </Form.Item>

                <TextEditer valueProps={textEditValue} setValueProps={setTextEditValue} />

                <Divider dashed />

                {
                    listMetadataGroup && listMetadataGroup?.map((metadataGroup: IMetadataGroup) => (
                        <div key={metadataGroup.id} className='flex flex-col'>
                            <div className='font-bold text-lg'>
                                {metadataGroup.name}
                            </div>

                            {
                                metadataInGroup?.map((metadata: IMetadata) => (
                                    metadataGroup.id === metadata.group_id &&
                                    <div key={metadata.id}>
                                        <div><b>{metadata.title}</b>: {metadata.content}</div>
                                    </div>
                                ))
                            }

                            <div className='flex flex-col space-y-2 max-w-md'>
                                <Input
                                    placeholder={`Nhập ${metadataGroup.name.toLowerCase()} mới`}
                                    ref={inputRef}
                                    value={itemMetadataTitle[metadataGroup.id]}
                                    onChange={(e) => handleInputTitleChange(metadataGroup.id, e.target.value)}
                                />
                                <TextArea
                                    value={itemMetadataContent[metadataGroup.id]}
                                    onChange={(e) => handleInputContentChange(metadataGroup.id, e.target.value)}
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                />
                                <Button danger icon={<PlusOutlined />} onClick={(e) => { addMetadata(e, metadataGroup.id) }}>
                                    Thêm
                                </Button>
                            </div>
                        </div>
                    ))
                }


                <Button type="primary" className='bg-[#CD1818] hover:bg-[#6d6d6d] my-3' htmlType="submit">
                    Thêm mới
                </Button>
            </Form>
        </div>
    )
}

export default AddProduct;
