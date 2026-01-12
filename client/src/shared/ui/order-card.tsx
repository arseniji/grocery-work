import type { IOrder } from "@/entities/order/types";
import styled from "styled-components";
import { BodyM, TitleS } from "./captions";
import { useNavigate } from "react-router";

type OrderCardProps = Pick<
  IOrder,
  "id" | "description" | "status" | "timestamps"
>;

export const OrderCard = ({
  id,
  description,
  status,
  timestamps,
}: OrderCardProps) => {
  const navigate = useNavigate();
  return (
    <OrderContainer
      onClick={() => {
        navigate(`/order/${id}`);
      }}
    >
      <TitleS>Заказ #{id}</TitleS>
      <BodyM>{description}</BodyM>
      <BodyM>Статус: {status || "Неизвестен"}</BodyM>
      <BodyM>
        Создан: {new Date(timestamps.createdAt).toLocaleDateString()}
      </BodyM>
    </OrderContainer>
  );
};

const OrderContainer = styled.div`
  width: 340px;
  height: 200px;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  -webkit-box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 0px 0px 15px 0px rgba(34, 60, 80, 0.2);
`;
