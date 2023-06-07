import { Button, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShowIcon from "../../components/ShowIcon";
import { getMetadataWithMetadataGroup } from "../../services/metadataGroup";
import { getProductBySlug } from "../../services/product";
import { IMetadata, IMetadataGroup } from "../../types/metadatagroup";
import { IProduct } from "../../types/product";

const ProductDetail: React.FC = () => {
    const param: any = useParams();

    const [data, setData] = useState<IProduct>();
    const [showDetail, setShowDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState<IMetadataGroup[]>();

    const openDetail = async () => {
        await getMetadataWithMetadataGroup(param.slug)
            .then((data: IMetadataGroup[]) => {
                console.log(data);
                setDataDetail(data);
                setShowDetail(true);
            }).catch(() => {

            }).finally(() => {

            })
    }

    useEffect(() => {
        if (param) {
            getProductBySlug(param.slug)
                .then((data: IProduct) => {
                    setData(data);
                }).catch(() => {

                }).finally(() => {

                })
        }
    }, [param]);

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
                            <div className="bg-[#F8F9FA] p-5 rounded-md border-solid border border-[#f8f9fa]">
                                <div>ok</div>
                                <div onClick={openDetail} className="text-blue-600 mt-2 cursor-pointer">Xem chi tiết thông số kỹ thuật</div>
                            </div>

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
                            <div className="font-bold uppercase text-2xl text-[#CD1818]">{data.price && data.price.toLocaleString()} VNĐ</div>
                            <h2 className="mb-2 leading-tight tracking-tight font-bold text-gray-800 text-2xl md:text-3xl">{data.title}</h2>
                            <p className="text-gray-500">{data.metaTitle}</p>
                            <div className="flex py-4 space-x-4">
                                <Button danger className="h-14 px-6 py-2 font-semibold rounded-xl">
                                    Thêm vào giỏ hàng
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row -mx-4 mt-5 bg-white rounded-md p-5">
                        <div dangerouslySetInnerHTML={{ __html: data.summary || "No content" }} />
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
            </>
            :
            <Spin tip="Loading..." />
    )
}

export default ProductDetail;