import { Button, Result } from "antd";
import routes from "../routes";

const PageNotFound = () => {
    return (

        <Result
            status="404"
            title="404"
            subTitle="Trang bạn truy cập không tồn tại hoặc đã bị gỡ bỏ!"
            extra={<Button danger href={routes.HOME} type="primary">Trang Chủ</Button>}
        />

    )
}

export default PageNotFound;