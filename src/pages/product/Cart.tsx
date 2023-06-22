import { useEffect, useState } from "react";
import { IProductCart } from "../../types/product";
import formatCurrency from "../../utils/formatCurrency";
import { Button, Divider, InputNumber, message } from "antd";
import { isLoggedIn, logout } from "../../services/auth";
import { IUser } from "../../types/auth";
import { IOrder, IOrderItem } from "../../types/order";
import { createOrder } from "../../services/order";
import { createOrderItems } from "../../services/oderItem";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTotalCartItem } from "../../store/cartSlice";
import { getUserInfo } from "../../services/user";

const Cart: React.FC = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [discuntPrice, setDiscountPrice] = useState<number>(0);
    const [oldPrice, setOldPrice] = useState<number>(0);
    const [listProductCart, setListProductCart] = useState<IProductCart[]>([]);

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
        updateDiscountPrice(updatedProductList);
        updateTotalPrice(updatedProductList);
        localStorage.setItem("cart-item", JSON.stringify(updatedProductList));
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
        setTotalPrice(total);
    }

    const resetCart = () => {
        const updatedProductList: IProductCart[] = [];
        dispatch(setTotalCartItem(0));
        setListProductCart(updatedProductList);
        updateOldPrice(updatedProductList);
        updateDiscountPrice(updatedProductList);
        updateTotalPrice(updatedProductList);
        localStorage.setItem("cart-item", JSON.stringify(updatedProductList));
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
                                handleHideCreateOrder();
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

    const removeProduct = (id: number) => {
        const updatedProductList = listProductCart.filter((product: IProductCart) => product.id !== id);
        let count = 0;
        updatedProductList.forEach(() => {
            count += 1;
        })
        dispatch(setTotalCartItem(count));
        setListProductCart(updatedProductList);
        updateOldPrice(updatedProductList);
        updateDiscountPrice(updatedProductList);
        updateTotalPrice(updatedProductList);
        localStorage.setItem("cart-item", JSON.stringify(updatedProductList));
    };

    useEffect(() => {
        const cart = localStorage.getItem("cart-item");
        if (cart !== null) {
            const ic = JSON.parse(cart);
            let count = 0;
            ic.forEach(() => {
                count += 1;
            })
            dispatch(setTotalCartItem(count));
            setListProductCart(ic);
            updateOldPrice(ic);
            updateDiscountPrice(ic);
            updateTotalPrice(ic);
        }
    }, [dispatch]);

    return (
        <>
            <div className="flex justify-center flex-col md:mx-44 md:my-20">
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
                                <div></div>
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
                                <div className="font-bold text-2xl mb-3 md:mb-8">Không có sản phẩm trong giỏ hàng!</div>
                                <Button danger size="large" onClick={() => { navigate("/") }}> TIẾP TỤC MUA HÀNG </Button>
                            </div>
                        </>
                }
            </div>
        </>
    )
}

export default Cart;

function handleHideCreateOrder() {
    throw new Error("Function not implemented.");
}
