import { IconType } from "react-icons";
import { BsFillCpuFill, BsFillDeviceSsdFill, BsNvidia, BsFillTelephoneOutboundFill, BsFillPostcardFill, BsPersonVcardFill, BsClipboardDataFill, BsCloudHazeFill } from "react-icons/bs";
import { CgSmartphoneRam } from "react-icons/cg";
import { MdScreenshotMonitor, MdStorage } from "react-icons/md";
import { FcApproval, FcOvertime, FcInTransit, FcSettings, FcSynchronize, FcMoneyTransfer, FcGallery, FcStart, FcAddImage } from "react-icons/fc";

export interface IconItem {
  name: string;
  icon: IconType;
}

export const iconList: IconItem[] = [
  { name: "BsFillCpuFill", icon: BsFillCpuFill },
  { name: "BsFillDeviceSsdFill", icon: BsFillDeviceSsdFill },
  { name: "BsNvidia", icon: BsNvidia },
  { name: "MdStorage", icon: MdStorage },
  { name: "MdScreenshotMonitor", icon: MdScreenshotMonitor },
  { name: "CgSmartphoneRam", icon: CgSmartphoneRam },
  { name: "BsFillTelephoneOutboundFill", icon: BsFillTelephoneOutboundFill },
  { name: "BsFillPostcardFill", icon: BsFillPostcardFill },
  { name: "BsPersonVcardFill", icon: BsPersonVcardFill },
  { name: "BsClipboardDataFill", icon: BsClipboardDataFill },
  { name: "BsCloudHazeFill", icon: BsCloudHazeFill },
  // icon có màu
  { name: "FcApproval", icon: FcApproval },
  { name: "FcOvertime", icon: FcOvertime },
  { name: "FcInTransit", icon: FcInTransit },
  { name: "FcSettings", icon: FcSettings },
  { name: "FcSynchronize", icon: FcSynchronize },
  { name: "FcMoneyTransfer", icon: FcMoneyTransfer },
  { name: "FcGallery", icon: FcGallery },
  { name: "FcStart", icon: FcStart },
  { name: "FcAddImage", icon: FcAddImage },
];
