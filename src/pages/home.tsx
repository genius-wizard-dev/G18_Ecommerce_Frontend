import Banner from "@/components/home/Banner";
import { Category } from "@/components/home/Category";
import { Product } from "@/components/home/Product";
import { FC } from "react";

const HomePage: FC = () => {
  return (
    <>
      <Banner />
      <Category />
      <Product />
    </>
  );
};

export default HomePage;
