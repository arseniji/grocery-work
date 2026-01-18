import { BoxIcon, EarpodsIcon, RefreshIcon, ShieldIcon } from "@/shared/icons";
import type { JSX } from "react";

interface IAdj {
  icon: () => JSX.Element;
  title: string;
  text: string;
}

export const adjList: IAdj[] = [
  {
    title: "Поддержка 24ч",
    text: "Круглосуточная поддержка",
    icon: EarpodsIcon,
  },
  {
    title: "Безопасная оплата",
    text: "Гарантируем безопасность ваших средств",
    icon: ShieldIcon,
  },
  {
    title: "Возврат средств",
    text: "Поврежденные товары можно вернуть",
    icon: RefreshIcon,
  },
  {
    title: "Бесплатная доставка",
    text: "Заказ от 40$",
    icon: BoxIcon,
  },
];
