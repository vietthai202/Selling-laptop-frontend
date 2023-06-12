import { Button, Carousel, Checkbox, Col, InputNumber, Pagination, Row, Select, Slider } from "antd";
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

    const onSliderAfterChange = (value: number | [number, number]) => {
        // console.log("onAfterChange: ", value);
    };

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
            console.log(data);
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
            <Link to={`/product/${data.slug}`} key={data.id} className="flex flex-col justify-between rounded-md overflow-hidden shadow-lg hover:scale-105 transition duration-500 cursor-pointer no-underline bg-white">
                <div>
                    <img className="w-full h-48" src={data.image || "https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png"} alt="" />
                </div>
                <div className="py-4 px-4 flex flex-col justify-between align-bottom">
                    <div className="text-sm font-semibold text-[#CD1818]">Mã sản phẩm: {data.sku}</div>
                    <div className="text-lg font-semibold text-gray-600">{data.title}</div>
                </div>
                <div className="py-4 px-4 flex flex-col justify-between align-bottom">
                    <div className="flex justify-between items-center">
                        <div className="text-base font-mono font-extrabold text-white bg-[#CD1818] px-2 rounded-full">{data.price && data.price.toLocaleString()} VNĐ</div>
                        <Button danger className="rounded-full" size="small">MUA NGAY</Button>
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
                        arrows={true}
                    >
                        {
                            slides.map((data: ISlide) => (

                                <div key={data.id} className="cursor-pointer" style={contentStyle} onClick={() => { window.location.href = `${data.url}`; }}>
                                    <img width="100%" src={data.image || ""} alt="" />
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
                                    <Slider onChange={onSliderChange} onAfterChange={onSliderAfterChange} min={1000000} max={99999999} range step={1000000} value={[min, max]} />
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
