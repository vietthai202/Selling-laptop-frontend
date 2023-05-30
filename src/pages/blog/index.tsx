import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlog } from '../../services/blog';
import { IBlog } from '../../types/blog';

const Blogs: React.FC = () => {
    const [blogs, setBlogs] = useState<IBlog[]>();

    useEffect(() => {
        getAllBlog().then((data: IBlog[]) => {
            setBlogs(data);
        });
    }, []);

    return (
        <section className="pt-20 pb-10 lg:pb-20">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap justify-center">
                    <div className="w-full px-4">
                        <div className="mx-auto mb-[60px] max-w-[510px] text-center lg:mb-20">
                            <h2
                                className="text-dark mb-4 text-3xl font-bold sm:text-4xl md:text-[40px]"
                            >
                                Tin tức mới nhất
                            </h2>
                            <p className="text-body-color text-base">
                                Chào mừng đến với trang tin tức của chúng tôi, nơi bạn có thể cập nhật những thông tin mới nhất về thế giới laptop. Từ các xu hướng mới nhất đến những công nghệ tiên tiến, chúng tôi đem đến cho bạn những tin tức hấp dẫn và thú vị trong lĩnh vực máy tính di động.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="-mx-4 flex flex-wrap">
                    {
                        blogs?.map((data: IBlog) => (
                            <Link to={`/blog/${data.slug}`} key={data.id} className="w-full px-4 md:w-1/2 lg:w-1/3 no-underline font-sans">
                                <div className="mx-auto mb-10 max-w-[370px] shadow-lg hover:scale-105 transition duration-500 cursor-pointer rounded-md p-5">
                                    <div className="mb-8 overflow-hidden rounded">
                                        <img className="w-full h-48" src={data.image ? data.image : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"} alt="" />
                                    </div>
                                    <div>
                                        <span
                                            className="bg-primary mb-5 inline-block rounded py-1 px-4 text-center text-xs font-semibold leading-loose text-red-500"
                                        >
                                            {data.createdAt}
                                        </span>
                                        <div className='text-2xl text-black'>
                                            {data.name}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
};

export default Blogs;
