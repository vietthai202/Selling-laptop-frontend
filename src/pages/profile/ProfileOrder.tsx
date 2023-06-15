import { useEffect } from "react";
import { getOrderByUserName } from "../../services/order";
import { useSelector } from "react-redux";

const ProfileOrder: React.FC = () => {
    const username = useSelector((state: any) => state.user.username);
    const role = useSelector((state: any) => state.user.role);
    // const [orderData, setOrderData] = useState<any>();

    useEffect(() => {
        if (username) {
            getOrderByUserName(username)
                .then((data) => {
                    console.log(data);
                    // setOrderData(data);
                })
        }
    }, [username]);


    return (
        <>
            <div className="container">
                avs {username} - {role}
            </div>
        </>
    )
}

export default ProfileOrder;