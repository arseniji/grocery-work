import type { Product } from "@/entities/product/types";
import styled from "styled-components";
import { BodyM, TitleS } from "./captions";
import { CartIcon } from "../icons";
import { StarRating } from "./star-rating";
import { useNavigate } from "react-router";

type ProductCardProps = Omit<
  Product,
  "details" | "timestamps" | "metadata" | "category" | "success"
> & { image: string };

export const ProductCard = ({
  image,
  name,
  price,
  rating,
  id,
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <ProductContainer onClick={() => navigate(`/product/${id}`)}>
      <Image src={image} />
      <Wrapper>
        <div>
          <TitleS>{name}</TitleS>
          <BodyM>{price}р</BodyM>
        </div>
        <CartWrapper>
          <CartIcon />
        </CartWrapper>
      </Wrapper>
      <StarRating rating={parseFloat(rating)} />
    </ProductContainer>
  );
};

const ProductContainer = styled.div`
  width: 340px;
  height: 430px;
  border-radius: 10px;
  padding: 10px 20px 30px;
  display: flex;
  flex-direction: column;
  justify-content: end;

  -webkit-box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
`;

const Image = styled.img`
  width: 100%;
  object-fit: contain;
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
