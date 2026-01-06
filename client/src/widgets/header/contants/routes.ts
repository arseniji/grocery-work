interface Route {
  text: string;
  to: string;
}

export const routes: Route[] = [
  {
    text: "Home",
    to: "/",
  },
  {
    text: "Shop",
    to: "/shop",
  },
  {
    text: "About",
    to: "/about",
  },
];
