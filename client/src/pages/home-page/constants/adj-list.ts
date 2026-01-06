import { BoxIcon, EarpodsIcon, RefreshIcon, ShieldIcon } from "@/shared/icons";
import type { JSX } from "react";

interface IAdj {
  icon: () => JSX.Element;
  title: string;
  text: string;
}

export const adjList: IAdj[] = [
  {
    title: "Support 24h",
    text: "Dedicated support",
    icon: EarpodsIcon,
  },
  {
    title: "Secure Payment",
    text: "Ensure your money is safe",
    icon: ShieldIcon,
  },
  {
    title: "Refundable",
    text: "Damage items can refund it",
    icon: RefreshIcon,
  },
  {
    title: "Free Shipping",
    text: "Order over 40$",
    icon: BoxIcon,
  },
];
