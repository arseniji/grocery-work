import type { Product } from "@/entities/product/types";
import styled from "styled-components";
import { BodyM, TitleS } from "./captions";
import { CartIcon } from "../icons";
import { StarRating } from "./star-rating";
import { useNavigate } from "react-router";
import { cartApi } from "@/lib/api/cart";
import { Toast } from "@/feat";
import type { AxiosError } from "axios";

type ProductCardProps = Omit<
  Product,
  "details" | "timestamps" | "metadata" | "category" | "success"
> & { image: string };

export const ProductCard = ({
  image,
  productName,
  price,
  rating,
  id,
}: ProductCardProps) => {
  const navigate = useNavigate();

  const addToCart: React.MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    event.stopPropagation();
    if (!id) return;
    try {
      const respone = await cartApi.addOne(id);
      if (respone.success) {
        Toast.show({
          type: "msg",
          title: "Успех!",
          msg: "Товар успешно добавлен",
        });
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка добавления",
        msg: "Неизвестная ошибка",
      });
    }
  };

  return (
    <ProductContainer onClick={() => navigate(`/product/${id}`)}>
      <div
        style={{
          position: "relative",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Image src={image} />
      </div>
      <Wrapper>
        <div>
          <TitleS>{productName}</TitleS>
          <BodyM>{price}р</BodyM>
        </div>
        <CartWrapper onClick={addToCart}>
          <CartIcon />
        </CartWrapper>
      </Wrapper>
      <StarRating rating={parseFloat(rating)} />
    </ProductContainer>
  );
};

const ProductContainer = styled.div`
  width: 100%;
  max-width: 340px;
  height: 430px;
  border-radius: 10px;
  padding: 10px 20px 30px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  overflow: hidden;

  -webkit-box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);

  @media (max-width: 768px) {
    max-width: 100%;
    height: 360px;
  }
`;

const Image = styled.img`
  object-fit: cover;
  display: block;
  margin: auto;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const CartWrapper = styled.button`
  width: 56px;
  height: 56px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 3px 8px 3px 3px;
  background-color: #d6ecac;
`;
