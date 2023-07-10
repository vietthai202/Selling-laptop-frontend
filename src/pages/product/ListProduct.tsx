import { Button, Carousel, Checkbox, Col, InputNumber, Pagination, Rate, Row, Select, Slider } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBrands } from "../../services/brands";
import { getProductWithPage } from "../../services/product";
import { getAllProductCategories } from "../../services/productCategory";
import { getSlideWithStatus } from "../../services/slides";
import { IBrand } from "../../types/brand";
import { IProduct } from "../../types/product";
import { IProductCategory } from "../../types/productCategory";
import { ISlide } from "../../types/slide";
import formatCurrency from "../../utils/formatCurrency";
import { IMetadata } from "../../types/metadatagroup";
import ShowIcon from "../../components/ShowIcon";

const ListProduct: React.FC = () => {
    const [laptops, setLaptops] = useState<IProduct[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedBrand, setSelectedBrand] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedPrice, setSelectedPrice] = useState<string>("");
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [categories, setCategories] = useState<IProductCategory[]>([]);
    const [slides, setSlides] = useState<ISlide[]>([]);

    const [min, setMin] = useState<number>(1000000);
    const [max, setMax] = useState<number>(99999999);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);

    const onSliderChange = (value: number | [number, number]) => {
        onMinChange(Number(value.toString().split(",")[0] || 1000000));
        onMaxChange(Number(value.toString().split(",")[1] || 99999999));
    };

    const onMinChange = (value: number | null) => {
        setMin(value || 1000000);
    }

    const onMaxChange = (value: number | null) => {
        setMax(value || 99999999);
    }

    const onFilterPrice = () => {
        setMinPrice(min);
        setMaxPrice(max);
    }

    const handleBrandChange = (checkedValues: CheckboxValueType[]) => {
        let listBrandId = "";
        checkedValues.map((data) => {
            return listBrandId += data + ",";
        })

        setSelectedBrand(listBrandId);
    }

    const handleCategoryChange = (checkedValues: CheckboxValueType[]) => {
        let listCateId = "";
        checkedValues.map((data) => {
            return listCateId += data + ",";
        })

        setSelectedCategory(listCateId);
    }

    const handlePriceChange = (value: string) => {
        console.log(value);
        setSelectedPrice(value);

    }

    useEffect(() => {
        getAllBrands().then((data: IBrand[]) => {
            setBrands(data);
        });

        getAllProductCategories().then((data: IProductCategory[]) => {
            setCategories(data);
        });

        getSlideWithStatus().then((data: ISlide[]) => {
            setSlides(data);
        });
    }, []);

    useEffect(() => {
        getProductWithPage(currentPage, selectedBrand, selectedCategory, selectedPrice, minPrice, maxPrice).then((data) => {
            setLaptops(data.content);
            setTotalPage(data.totalElements);
        })
    }, [currentPage, selectedBrand, selectedCategory, selectedPrice, minPrice, maxPrice]);

    // Logic to handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderItems = () => {
        return laptops.map((data: IProduct) => (
            <Link to={`/product/${data.slug}`} key={data.id} className="flex flex-col justify-start rounded-lg overflow-hidden shadow-lg hover:scale-105 transition duration-500 bg-white no-underline">
                <div className="relative">
                    <img className="absolute top-0 left-0 bottom-0 right-0 w-full h-48" src="https://images.fpt.shop/unsafe/fit-in/270x210/filters:quality(90):fill(white)/fptshop.com.vn/Uploads/Originals/2023/7/1/638237980035622461_frame-cate-270x210.png" alt="" />
                    <img style={{marginLeft:"50px"}} className="w-64 h-48 rounded-xl" src={data.image || "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"} alt="" />
                    <div className="absolute left-0 bottom-4 text-[14px] text-white py-1 px-3 rounded-r-md bg-[#ea9d02]">Trả góp 0%</div>
                </div>
                <div className="py-4 px-4 flex flex-col justify-between align-bottom">
                    <div className="text-sm font-semibold text-[#CD1818]">Mã SP: <span className="uppercase">{data.sku}</span></div>
                    <div className="text-[17px] font-bold text-[#474c51] mb-2 h-[37px] block overflow-hidden" style={{ lineHeight: 'normal' }}>{data.title}</div>
                    <div className="flex justify-between items-center pb-2">
                        <div className="relative text-base font-mono font-extrabold bg-[#ef8573] text-white px-2 rounded-full basis-[130px] w-[130px] h-[28px] flex justify-center items-center" style={{ zIndex: 1 }}>
                            {formatCurrency(data.price - data.price * data.discount / 100)}
                            <div className={`absolute top-0 bottom-0 left-0 bg-[#CD1818] rounded-l-full`} style={{ zIndex: -1, width: `${data.discount}%` }}></div>
                        </div>
                        <div className={`text-base text-[#919191] text-[14px] ${data.discount > 0 ? "text-decoration: line-through" : ""}`}>{formatCurrency(data.price)}</div>
                    </div>
                    <div className="bg-[#f8f9fa] rounded-md p-3 text-[#6c757d] text-[14px]">
                        <div className="flex flex-wrap">
                            {
                                data.metadataDtoSet && data.metadataDtoSet.map((meta: IMetadata) => (
                                    meta.icon &&
                                    <div className="flex justify-center items-center space-x-2 m-2">
                                        <ShowIcon name={meta.icon} />
                                        <div>{meta.content}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Link>
        ));
    };

    const contentStyle: React.CSSProperties = {
        margin: 0,
        color: "#fff",
        textAlign: "center",
        background: "#364d79",
    };

    return (
        <>
            <section className="pt-2 pb-10 lg:pb-20">
                <div className="container mx-auto">
                    <Carousel
                        autoplay={true}
                    >
                        {
                            slides.map((data: ISlide) => (

                                <div key={data.id} className="cursor-pointer" style={contentStyle} onClick={() => { window.location.href = `${data.url}`; }}>
                                    <img width="100%" src={data.imageUrl || ""} alt="" />
                                </div>

                            ))
                        }

                    </Carousel>

                    <div className="flex justify-end space-x-2 my-4">
                        <Select
                            defaultValue={"Select Price Order"}
                            className="min-w-fit"
                            onChange={handlePriceChange}
                            options={[
                                {
                                    label: "Select Price Order", value: ""
                                },
                                {
                                    label: "Giá tăng", value: "asc"
                                },
                                {
                                    label: "Giá giảm", value: "desc"
                                }
                            ]}
                        />
                    </div>
                    <div className="blog md:flex">
                        <div className="flex-1">
                            <div className="mb-5">
                                <div className="font-bold mb-3">Hãng sản xuất</div>
                                <div>
                                    <Checkbox.Group style={{ width: "100%" }} onChange={handleBrandChange}>
                                        <Row>
                                            {
                                                brands.map((brand: IBrand) => (
                                                    <Col key={brand.id} span={12}>
                                                        <Checkbox value={brand.id}>{brand.name}</Checkbox>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    </Checkbox.Group>
                                </div>
                            </div>
                            <div className="mb-5">
                                <div className="font-bold mb-3">Danh mục</div>
                                <div>
                                    <Checkbox.Group style={{ width: "100%" }} onChange={handleCategoryChange}>
                                        <Row>
                                            {
                                                categories.map((cat: IProductCategory) => (
                                                    <Col key={cat.id} span={12}>
                                                        <Checkbox value={cat.id}>{cat.name}</Checkbox>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    </Checkbox.Group>
                                </div>
                            </div>

                            <div className="mb-5">
                                <div className="font-bold mb-3">Khoảng giá</div>
                                <div className="pr-5">
                                    <Slider onChange={onSliderChange} min={1000000} max={99999999} range step={1000000} value={[min, max]} />
                                    <div className="flex justify-around">
                                        <div className="flex items-center space-x-2">
                                            <div>Min:</div>
                                            <div><InputNumber className="min-w-fit" value={min} min={1000000} max={99999999} step={1000000} onChange={onMinChange} /></div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div>Max:</div>
                                            <div><InputNumber className="min-w-fit" value={max} min={1000000} max={99999999} step={1000000} onChange={onMaxChange} /></div>
                                        </div>
                                    </div>
                                    <Button onClick={onFilterPrice} className="w-full my-3">Lọc</Button>
                                </div>
                            </div>
                        </div>

                        <div className="md:w-3/4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10">
                                {renderItems()}
                            </div>
                            <div className="mt-5 flex justify-center">
                                <Pagination
                                    current={currentPage}
                                    pageSize={10}
                                    total={totalPage}
                                    onChange={handlePageChange}
                                    onShowSizeChange={handlePageChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section >


        </>

    )
};

export default ListProduct;
