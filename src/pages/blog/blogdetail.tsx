import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlogBySlug } from "../../services/blog";
import { IBlog } from "../../types/blog";

const BlogDetail = () => {
    const navigate = useNavigate();
    const param: any = useParams();
    const [blog, setBlog] = useState<IBlog>();

    useEffect(() => {
        getBlogBySlug(param.slug)
            .then((data: IBlog) => {
                console.log(data);
                setBlog(data);
            }).catch(() => {
                navigate("/404");
            });
    }, [navigate, param]);

    return (
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl pt-20 pb-10 lg:pb-20">
            <article className="mx-auto w-full max-w-3xl format format-sm sm:format-base lg:format-lg format-blue">
                <header className="mb-4 lg:mb-6 not-format">
                    <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl">{blog?.name}</h1>
                </header>
                <p className="lead">
                    {blog?.shortContent}
                </p>
                <figure>
                    <img src={blog?.image} alt="" className="w-full" />
                </figure>
                <div>
                    <div dangerouslySetInnerHTML={{ __html: blog?.content || "No content" }} />
                </div>
            </article>
        </div>
    )
}

export default BlogDetail;