import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBrands } from '../../services/brands';
import { IBrand } from '../../types/brand';
import { Tooltip } from 'antd';

const ListBrand: React.FC = () => {
    const [blogs, setBlogs] = useState<IBrand[]>();

    useEffect(() => {
        getAllBrands().then((data: IBrand[]) => {
            setBlogs(data);
        });
    }, []);

    return (
        <section className="pt-10 pb-10">
            <div className="container mx-auto">
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 bg-gray-200 rounded-md p-3">
                    {blogs?.map((data: IBrand) => (
                        <Link to={"/"} key={data.id} className="rounded-md max-w-xs overflow-hidden hover:scale-105 hover:shadow-lg shadow-sm transition duration-500 cursor-pointer no-underline">
                            <Tooltip title={data.name}>
                                <img className='w-full h-16' src={data.image} alt="" />
                            </Tooltip>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
};

export default ListBrand;
