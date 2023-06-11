import { Button, Pagination, Select, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductWithPage } from '../../services/product';
import { IProduct } from '../../types/product';
import { IBrand } from '../../types/brand';
import { IProductCategory } from '../../types/productCategory';
import { getAllBrands } from '../../services/brands';
import { getAllProductCategories } from '../../services/productCategory';


const ListProduct: React.FC = () => {
    const [laptops, setLaptops] = useState<IProduct[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    // const [brands, setBrands] = useState<IBrand[]>();
    const [inputBrands, setInputBrands] = useState<{ value: string, label: string }[]>();
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [inputCategory, setInputCategory] = useState<{ value: string, label: string }[]>();
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedPrice, setSelectedPrice] = useState<string>("");
    const [blogs, setBlogs] = useState<IBrand[]>();

    const handleBrandChange = (value: string) => {
        console.log(value);
        setSelectedBrand(value);
    }

    const handleCategoryChange = (value: string) => {
        console.log(value);
        setSelectedCategory(value);
    }

    const handlePriceChange = (value: string) => {
        console.log(value);
        setSelectedPrice(value);

    }

    useEffect(() => {
        getAllBrands().then((data: IBrand[]) => {
            setBlogs(data);
        });
    }, []);

    useEffect(() => {

        getAllProductCategories().then((data: IProductCategory[]) => {
            // setBrands(data);
            const list: { value: string, label: string }[] = [];
            list.push({
                value: "",
                label: "Select Category"
            })
            data.map((item) => {
                list.push({
                    value: item.name,
                    label: item.name
                })
            })

            setInputCategory(list)
        })
    }, []);
    useEffect(() => {

        getAllBrands().then((data: IBrand[]) => {
            // setBrands(data);
            const list: { value: string, label: string }[] = [];
            list.push({
                value: "",
                label: "Select Brand"
            })
            data.map((item) => {
                list.push({
                    value: item.name,
                    label: item.name
                })
            })

            setInputBrands(list)
        })
    }, []);

    useEffect(() => {

        getProductWithPage(currentPage, selectedBrand, selectedCategory, selectedPrice).then((data) => {
            console.log(data);
            setLaptops(data.content);
            setTotalPage(data.totalElements);
        })
    }, [currentPage, selectedBrand, selectedCategory, selectedPrice]);

    // Logic to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderItems = () => {
        return laptops.map((data: IProduct) => (
            <Link to={`/product/${data.slug}`} key={data.id} className="flex flex-col justify-between max-w-xs rounded-md overflow-hidden shadow-lg hover:scale-105 transition duration-500 cursor-pointer no-underline bg-white">
                <div>
                    <img className='w-full h-48' src={data.image || "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"} alt="" />
                </div>
                <div className="py-4 px-4 flex flex-col justify-between align-bottom">
                    <div className="text-sm font-semibold text-[#CD1818]">Mã sản phẩm: {data.sku}</div>
                    <div className="text-lg font-semibold text-gray-600">{data.title}</div>
                </div>
                <div className="py-4 px-4 flex flex-col justify-between align-bottom">
                    <div className='flex justify-between items-center'>
                        <div className="text-base font-mono font-extrabold text-white bg-[#CD1818] px-2 rounded-full">{data.price && data.price.toLocaleString()} VNĐ</div>
                        <Button danger className='rounded-full' size='small'>MUA NGAY</Button>
                    </div>
                </div>
            </Link>
        ));
    };

    return (
        <>  <section className="pt-10 pb-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 bg-gray-200 rounded-md p-3">
                    {blogs?.map((data: IBrand) => (
                        <div onClick={() => { setSelectedBrand(data.name) }} key={data.id} className="rounded-md max-w-xs overflow-hidden hover:scale-105 hover:shadow-lg shadow-sm transition duration-500 cursor-pointer no-underline">
                            <Tooltip title={data.name}>
                                <img className='w-full h-16' src={data.image ? data.image : "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"} alt="" />
                            </Tooltip>
                        </div>
                    ))}
                </div>
            </div>
        </section>
            <section className="pt-10 pb-10 lg:pb-20">
                <div className="container mx-auto">
                    <div className="text-dark mb-4 text-2xl font-bold sm:text-4xl md:text-[40px]">
                        Laptop mới nhất
                    </div>
                    <div className='flex justify-end space-x-2 mb-2'>
                        <Select
                            defaultValue={"Select Price Order"}
                            style={{ width: 120 }}
                            onChange={handlePriceChange}
                            options={[
                                {
                                    label: "Giá tăng", value: "asc"
                                },
                                {
                                    label: "Giá giảm", value: "desc"
                                }
                            ]}
                        />
                        <Select
                            defaultValue={"Chọn danh mục"}
                            style={{ width: 120 }}
                            onChange={handleCategoryChange}
                            options={inputCategory}
                        />
                        <Select
                            defaultValue={"Chọn thương hiệu"}
                            style={{ width: 120 }}
                            onChange={handleBrandChange}
                            options={inputBrands}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                        {renderItems()}
                    </div>
                    <div className='mt-5 flex justify-center'>
                        <Pagination
                            current={currentPage}
                            pageSize={10}
                            total={totalPage}
                            onChange={handlePageChange}
                            onShowSizeChange={handlePageChange}
                        />
                    </div>
                </div>
            </section >


        </>

    )
};

export default ListProduct;
