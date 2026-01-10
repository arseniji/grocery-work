import type { Product } from "@/entities/product/types";
import { BodyM, TitleS } from "@/shared/ui/captions";
import { Button } from "@/shared/ui";
import {
  CartProductContainer,
  Image,
  InfoWrapper,
  QuantityWrapper,
  Quantity,
  TotalPrice,
} from "./styled";
import { useNavigate } from "react-router";

type CartProductProps = Product & {
  quantity: number;
  total_price: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onDelete: () => void;
};

export const CartProduct = ({
  name,
  price,
  details,
  quantity,
  total_price,
  onIncrease,
  onDecrease,
  onDelete,
  id,
}: CartProductProps) => {
  const navigate = useNavigate();

  return (
    <CartProductContainer onClick={() => navigate(`/product/${id}`)}>
      <Image src={details.image_url} alt={name} />
      <InfoWrapper>
        <TitleS>{name}</TitleS>
        <BodyM>{price}р за шт.</BodyM>
        <QuantityWrapper>
          <Button variant="border" onClick={onDecrease}>
            -
          </Button>
          <Quantity>{quantity}</Quantity>
          <Button variant="border" onClick={onIncrease}>
            +
          </Button>
        </QuantityWrapper>
        <TotalPrice>Итого: {total_price}р</TotalPrice>
      </InfoWrapper>
      <Button variant="primary" onClick={onDelete}>
        Удалить
      </Button>
    </CartProductContainer>
  );
};
