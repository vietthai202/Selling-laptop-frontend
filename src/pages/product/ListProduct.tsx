import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProduct } from '../../services/product';
import { IProduct } from '../../types/product';

const ListProduct: React.FC = () => {
    const [laptops, setLaptops] = useState<IProduct[]>();

    useEffect(() => {
        getAllProduct().then((data: IProduct[]) => {
            setLaptops(data);
        });
    }, []);

    return (
        <section className="pt-10 pb-10 lg:pb-20">
            <div className="container mx-auto">
                <div className="text-dark mb-4 text-2xl font-bold sm:text-4xl md:text-[40px]">
                    Laptop mới nhất
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                    {laptops?.map((data: IProduct) => (
                        <Link to={`/product/${data.slug}`} key={data.id} className="max-w-xs rounded-md overflow-hidden shadow-lg hover:scale-105 transition duration-500 cursor-pointer no-underline">
                            <div>
                                <img className='w-full' src={data.image || "https://media.ldlc.com/r1600/ld/products/00/05/82/02/LD0005820208_1.jpg"} alt="" />
                            </div>
                            <div className="py-4 px-4 bg-white">
                                <h4 className="text-sm font-semibold text-[#CD1818]">Mã sản phẩm: {data.sku}</h4>
                                <h3 className="text-lg font-semibold text-gray-600">{data.title}</h3>
                                <div className='flex justify-between items-center'>
                                    <div className="text-lg font-mono font-extrabold text-white bg-[#CD1818] px-2 rounded-full">{data.price} VNĐ</div>
                                    <Button danger>MUA NGAY</Button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
};

export default ListProduct;
