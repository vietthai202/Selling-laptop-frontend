import { Button, Divider, Input, InputNumber, Modal, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShowIcon from "../../components/ShowIcon";
import { getMetadataWithMetadataGroup } from "../../services/metadataGroup";
import { getLaptopById, getProductBySlug } from "../../services/product";
import { IMetadata, IMetadataGroup } from "../../types/metadatagroup";
import { IProduct, IProductCart } from "../../types/product";

import { useDispatch } from "react-redux";
import FAQs from "../../components/ProductFAQs";
import { isLoggedIn, logout } from "../../services/auth";
import { getCouponByName } from "../../services/coupon";
import { getFAQByLaptopId } from "../../services/faq";
import { createOrderItems } from "../../services/oderItem";
import { createOrder } from "../../services/order";
import { getUserInfo } from "../../services/user";
import { setTotalCartItem } from "../../store/cartSlice";
import { IUser } from "../../types/auth";
import { ICoupon } from "../../types/coupon";
import { IFAQs } from "../../types/faqs";
import { IOrder, IOrderItem } from "../../types/order";
import formatCurrency from "../../utils/formatCurrency";

const ProductDetail: React.FC = () => {
    const param: any = useParams();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [data, setData] = useState<IProduct>();
    const [showDetail, setShowDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState<IMetadataGroup[]>();

    const [showCreateOrder, setShowCreateOrder] = useState(false);

    const [faqs, setFaqs] = useState<IFAQs[]>([]);

    const [totalPrice, setTotalPrice] = useState<number>(0);

    const [discuntPrice, setDiscountPrice] = useState<number>(0);

    const [oldPrice, setOldPrice] = useState<number>(0);

    const [listProductCart, setListProductCart] = useState<IProductCart[]>([]);

    const [coupon, setCoupon] = useState<string>("");
    const [discount, setDiscount] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false);

    const handleShowCreateOrder = () => {
        if (data) {
            const existingItem = listProductCart.find(item => item.id === data.id);

            if (existingItem) {
                existingItem.quantity++;
                if (existingItem.quantity > 4) {
                    existingItem.quantity = 4;
                }
            } else {
                const item: IProductCart = {
                    id: data.id,
                    quantity: 1,
                    title: data.title,
                    image: data.image,
                    price: data.price,
                    discount: data.discount
                }
                listProductCart.push(item);
            }

            localStorage.setItem("cart-item", JSON.stringify(listProductCart));

            const lpc: IProductCart[] = [];

            const lpPromises = listProductCart.map(async (item: IProductCart) => {

                const data = await getLaptopById(item.id);

                const product: IProductCart = {
                    id: data.id,
                    title: data.title,
                    image: data.image,
                    price: data.price,
                    discount: data.discount,
                    quantity: item.quantity > data.quantity ? data.quantity : item.quantity
                }

                lpc.push(product);
                return product;
            });

            Promise.all(lpPromises)
                .then((results) => {
                    const lpc: IProductCart[] = results.map((data: IProductCart) => data);
                    let count = 0;
                    lpc.forEach(() => {
                        count += 1;
                    })
                    dispatch(setTotalCartItem(count));
                    setListProductCart(lpc);
                    updateOldPrice(lpc);
                    updateDiscountPrice(lpc);
                    updateTotalPrice(lpc);
                    setShowCreateOrder(true);
                });
        }
    }

    const updateOldPrice = (list: IProductCart[]) => {
        let oldPrice = 0;
        list.map((item) => {
            return oldPrice += item.price * item.quantity;
        })
        setOldPrice(oldPrice);
    }

    const updateDiscountPrice = (list: IProductCart[]) => {
        let price = 0;
        list.map((item) => {
            return price += (item.price * item.discount / 100) * item.quantity;
        })
        setDiscountPrice(price);
    }

    const updateTotalPrice = (list: IProductCart[]) => {
        let total = 0;
        list.map((item) => {
            return total += item.price * item.quantity - (item.price * item.discount / 100 * item.quantity);
        })
        console.log("DISS1", discount)
        console.log("DISS2", total)
        total = total - discount;
        console.log("DISS3", total)
        setTotalPrice(total);
    }

    const removeProduct = (id: number) => {
        const updatedProductList = listProductCart.filter((product: IProductCart) => product.id !== id);
        let count = 0;
        updatedProductList.forEach(() => {
            count += 1;
        })
        dispatch(setTotalCartItem(count));
        setListProductCart(updatedProductList);
        updateOldPrice(updatedProductList);
        updateTotalPrice(updatedProductList);
        updateDiscountPrice(updatedProductList);
        localStorage.setItem("cart-item", JSON.stringify(updatedProductList));
    };

    const resetCart = () => {
        const updatedProductList: IProductCart[] = [];
        setListProductCart(updatedProductList);
        updateTotalPrice(updatedProductList);
        localStorage.setItem("cart-item", JSON.stringify(updatedProductList));
    }

    const updateCart = (id: number, quantity: number | null) => {
        const updatedProductList = listProductCart.map((product: IProductCart) => {
            if (product.id === id) {
                const updatedProduct = { ...product };
                if (quantity) {
                    updatedProduct.quantity = quantity;
                }
                return updatedProduct;
            }
            return product;
        });

        if (quantity !== null && !listProductCart.some((product) => product.id === id)) {
            const newProduct: IProductCart = {
                id: id,
                quantity: quantity,
                title: "",
                image: null,
                price: 0,
                discount: 0
            };
            updatedProductList.push(newProduct);
        }
        let count = 0;
        updatedProductList.forEach(() => {
            count += 1;
        })
        dispatch(setTotalCartItem(count));
        setListProductCart(updatedProductList);
        updateOldPrice(updatedProductList);
        updateTotalPrice(updatedProductList);
        updateDiscountPrice(updatedProductList);
        localStorage.setItem("cart-item", JSON.stringify(updatedProductList));
    }

    const handleHideCreateOrder = () => {
        setShowCreateOrder(false);
    }

    const createNewOrder = () => {
        const username = localStorage.getItem("username");
        if (isLoggedIn() && username) {
            getUserInfo(username)
                .then((data: IUser) => {
                    const newOrder: IOrder = {
                        id: 0,
                        userId: data.id,
                        totalPrice: 0,
                        status: "",
                        firstName: data.name,
                        lastName: "",
                        phoneNumber: data.phone,
                        email: data.email,
                        line: "",
                        city: data.address,
                        province: ""
                    }

                    if (listProductCart.length > 0) {
                        createOrder(newOrder).then((order: IOrder) => {

                            let quantities: string = "";
                            let laptopIds: string = "";

                            listProductCart.forEach((data: IProductCart) => {
                                quantities += "," + data.quantity.toString();
                                laptopIds += "," + data.id.toString();
                            })

                            quantities = quantities.substring(1);
                            laptopIds = laptopIds.substring(1);

                            const newOrderItems: IOrderItem = {
                                orderId: order.id,
                                quantities: quantities,
                                laptopIds: laptopIds,
                            }
                            createOrderItems(newOrderItems).then(() => {
                                message.success("Đặt hàng thành công!");
                                resetCart();
                                setShowCreateOrder(false);
                                // redirect to payment
                            }).then(() => {
                                navigate(`/profile/payment/${order.id}`)
                            })
                        });
                    } else {
                        message.error("Không có sản phẩm nào!");
                    }

                })
                .catch((error: Error) => {
                    logout();
                    console.error('Failed to fetch user information');
                });
        } else {
            message.error("Bạn cần đăng nhập!");
            navigate("/login");
        }
    }

    const openDetail = async () => {
        await getMetadataWithMetadataGroup(param.slug)
            .then((data: IMetadataGroup[]) => {
                setDataDetail(data);
                setShowDetail(true);
            });
    }

    // const applyCoupon = async () => {
    //     console.log("123", coupon);
    //     setLoading(true);

    //     try {
    //         const [data] = await Promise.all([
    //             getCouponByName(coupon)
    //         ]);

    //         setDiscount(data.discount);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    useEffect(() => {
        if (param) {
            const cart = localStorage.getItem("cart-item");
            if (cart !== null) {
                const ic = JSON.parse(cart);
                setListProductCart(ic);
                // updateTotalPrice();
                let count = 0;
                ic.forEach(() => {
                    count += 1;
                })
                dispatch(setTotalCartItem(count));
            }

            getProductBySlug(param.slug)
                .then((data: IProduct) => {
                    setData(data);
                    getFAQByLaptopId(data.id).then((data: IFAQs[]) => {
                        setFaqs(data);
                    });
                });
        }
    }, [dispatch, param]);

    const renderDetailData = (data: IMetadataGroup[]) => {
        return data.map((item: IMetadataGroup) => (
            <div key={item.id}>
                <div className="font-semibold bg-slate-100">{item.name}</div>
                <ul>
                    {item.metadataDtoSet.map((metadata: IMetadata) => (
                        <div key={metadata.id}>
                            <div>{metadata.title}: {metadata.content}</div>
                        </div>
                    ))}
                </ul>
            </div>
        ));
    };

    return (
        data ?
            <>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                    <div className="flex flex-col md:flex-row -mx-4 bg-white rounded-md">
                        <div className="md:flex-1 px-4 p-5">
                            <div className="h-64 md:h-80 p-2 bg-[#CD1818] mb-4 rounded-xl">
                                <img className="w-full h-full rounded-xl" src={data.image || "https://media.ldlc.com/r1600/ld/products/00/05/82/02/LD0005820208_1.jpg"} alt="" />
                            </div>

                            <div onClick={openDetail} className="text-blue-600 mt-2 cursor-pointer">Xem chi tiết thông số kỹ thuật</div>

                            <div className="mt-2 p-5 rounded-md grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex justify-start items-center space-x-2">
                                    <ShowIcon name="FcApproval" size={25} />
                                    <div>Hàng chính hãng</div>
                                </div>
                                <div className="flex justify-start items-center space-x-2">
                                    <ShowIcon name="FcOvertime" size={25} />
                                    <div>Bảo hành 24 Tháng</div>
                                </div>

                                <div className="flex justify-start items-center space-x-2">
                                    <ShowIcon name="FcInTransit" size={25} />
                                    <div>Giao hàng miễn phí trong 90 phút</div>
                                </div>

                                <div className="flex justify-start items-center space-x-2">
                                    <ShowIcon name="FcSettings" size={25} />
                                    <div>Hỗ trợ cài đặt miễn phí</div>
                                </div>

                                <div className="flex justify-start items-center space-x-2">
                                    <ShowIcon name="FcSynchronize" size={25} />
                                    <div>Chính sách đổi trả</div>
                                </div>

                                <div className="flex justify-start items-center space-x-2">
                                    <ShowIcon name="FcMoneyTransfer" size={25} />
                                    <div>Chính sách trả góp</div>
                                </div>
                            </div>
                        </div>
                        <div className="md:flex-1 px-4 p-5">
                            <div className="font-bold uppercase text-2xl text-[#CD1818]">Giá cũ: {data.price && data.price.toLocaleString()} VNĐ</div>
                            <div className="font-bold uppercase text-2xl text-[#CD1818]">Giá khuyến mại: {(data.price - data.price * data.discount / 100).toLocaleString()} VNĐ</div>
                            <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">{data.title}</h2>
                            <p className="text-gray-500">{data.metaTitle}</p>
                            <div className="flex py-4 space-x-4">
                                <Button danger className="h-14 px-6 py-2 font-semibold rounded-xl" onClick={handleShowCreateOrder}>
                                    Mua ngay
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="md:flex justify-between md:space-x-4 -mx-4">
                        <div className="md:w-2/3 flex flex-col md:flex-row mt-5 bg-white rounded-md p-5">
                            <div dangerouslySetInnerHTML={{ __html: data.summary || "No content" }} />
                        </div>
                        <div className="flex md:w-1/3 flex-col mt-5 bg-white rounded-md p-5">
                            <div className="font-bold mb-3">Câu hỏi thường gặp</div>
                            <FAQs listFaq={faqs} />
                        </div>
                    </div>

                </div>

                <Modal
                    title={`Chi tiết thông số kỹ thuật ${data.title}`}
                    centered
                    open={showDetail}
                    onOk={() => setShowDetail(false)}
                    onCancel={() => setShowDetail(false)}
                    width={1000}
                    footer={null}
                >
                    <div className="p-5">
                        {dataDetail && renderDetailData(dataDetail)}
                    </div>
                </Modal>

                <Modal
                    title={`Các sản phẩm trong giỏ hàng`}
                    centered
                    open={showCreateOrder}
                    onCancel={handleHideCreateOrder}
                    width={800}
                    footer={null}
                >
                    <Spin tip="Loading" spinning={loading}>
                        <div className="p-5">
                            {
                                listProductCart && listProductCart.map((item) => (
                                    <div key={item.id}>
                                        <div className="my-1 flex items-center justify-between">
                                            <div className="flex space-x-2 items-center">
                                                {item.id} -
                                                <div><img width={50} height={50} src={item.image || ""} alt="" /></div>
                                                <div>{item.title}</div>
                                            </div>
                                            <div className="flex space-x-2 items-center">
                                                <div>
                                                    <div className="text-red-500">{formatCurrency(item.price - item.price * item.discount / 100)}.</div>
                                                    {/* <div><del>{item.price} VNĐ</del></div> */}
                                                </div>
                                                <InputNumber max={4} value={item.quantity} onChange={(e) => { updateCart(item.id, e) }} />
                                                <Button danger onClick={() => { removeProduct(item.id) }} >Xóa</Button>
                                            </div>

                                        </div>
                                        <Divider dashed />
                                    </div>
                                ))
                            }
                            {
                                listProductCart.length > 0 ?
                                    <>
                                        <div className="flex justify-between">
                                            <div>
                                                {/* <div className="flex space-x-2">
                                                    <Input value={coupon} onChange={(e) => { setCoupon(e.target.value) }} />
                                                    <Button onClick={applyCoupon}>Áp dụng</Button>
                                                </div> */}
                                            </div>
                                            <div>
                                                <div className="flex justify-between">
                                                    <div className="mr-4">Tổng tiền:</div>
                                                    <div>{formatCurrency(oldPrice)}</div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="mr-4">Giảm:</div>
                                                    <div>{formatCurrency(discuntPrice)}</div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="mr-4">Cần thanh toán:</div>
                                                    <div>{formatCurrency(totalPrice)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <Divider dashed />
                                        <div className="flex justify-center">
                                            <Button danger size="large" onClick={createNewOrder}> HOÀN TẤT ĐẶT HÀNG </Button>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="flex justify-center flex-col items-center">
                                            <div className="font-bold text-2xl mb-3">Không có sản phẩm trong giỏ hàng!</div>
                                            <Button danger size="large" onClick={() => { setShowCreateOrder(false) }}> TIẾP TỤC MUA HÀNG </Button>
                                        </div>
                                    </>
                            }
                        </div>
                    </Spin>
                </Modal >
            </>
            :
            <Spin tip="Loading..." />
    )
}

export default ProductDetail;