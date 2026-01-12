interface Route {
  text: string;
  to: string;
}

export const routes: Route[] = [
  {
    text: "Главная",
    to: "/",
  },
  {
    text: "Магазин",
    to: "/shop",
  },
  {
    text: "О нас",
    to: "/about",
  },
];
