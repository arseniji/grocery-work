import { Toast, SmartSearch, DataTable } from "@/feat";
import { adminApi } from "@/lib/api/admin";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { GetOrderDetailsRes, GetProductsRes } from "@/lib/api/admin/types";
import { Loader, Button, Input } from "@/shared/ui";
import { TitleM, BodyM } from "@/shared/ui/captions";
import type { ComboBoxOption } from "@/shared/ui/combobox";
import {
  Main,
  OrderContainer,
  OrderHeader,
  ProductsList,
  ProductItem,
  ProductImage,
  ProductInfo,
  Summary,
  AddProductSection,
} from "./styled";
import { ApiCommand } from "@/lib/command/entities/api-command";
import { manager } from "@/lib/command";

export const AdminOrderEditPage = () => {
  const { userId, orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<GetOrderDetailsRes | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [allProducts, setAllProducts] = useState<GetProductsRes["products"]>(
    [],
  );
  const [searchedProducts, setSearchedProducts] = useState<
    GetProductsRes["products"]
  >([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [addQuantity, setAddQuantity] = useState(1);

  const searchOptions: ComboBoxOption[] = [
    { value: "productName", label: "Название товара" },
    { value: "price", label: "Цена" },
    { value: "category", label: "Категория" },
  ];

  const loadOrder = useCallback(async () => {
    try {
      if (!userId || !orderId) throw Error;
      const response = await adminApi.getOrderDetails(
        parseInt(userId),
        parseInt(orderId),
      );
      if (response.success) {
        setOrderData(response);
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      Toast.show({
        type: "error",
        title: "Ошибка!",
        msg: "Ошибка получения заказа, вы будете перенаправленны",
      });

      setTimeout(() => {
        navigate("/admin/orders");
      }, 1000);
    } finally {
      setLoading(false);
    }
  }, [navigate, userId, orderId]);

  const loadProducts = useCallback(async () => {
    try {
      const response = await adminApi.getProducts();
      if (response.success) {
        setAllProducts(response.products);
        setSearchedProducts(response.products);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (!query) {
        setSearchedProducts(allProducts);
        return;
      }
      const filters = query.split(",").map((q) => {
        const [field, value] = q.split(":");
        return { field: field.trim(), value: value.trim().toLowerCase() };
      });
      const filtered = allProducts.filter((product) =>
        filters.every((filter) => {
          const fieldValue = product[filter.field as keyof typeof product];
          return String(fieldValue).toLowerCase().includes(filter.value);
        }),
      );
      setSearchedProducts(filtered);
    },
    [allProducts],
  );

  const handleSelectProduct = useCallback((product: Record<string, any>) => {
    setSelectedProduct(product.id);
  }, []);

  const handleAddItem = useCallback(
    async (productId: number, quantity: number) => {
      if (!userId || !orderId) return;
      setIsUpdating(true);
      try {
        const response = await adminApi.addOrderItem(
          parseInt(userId),
          parseInt(orderId),
          productId,
          quantity,
        );

        if (response.success) {
          Toast.show({
            type: "msg",
            title: "Успех!",
            msg: "Товар добавлен",
          });
          loadOrder();
          return;
        }
        Toast.show({
          type: "error",
          msg: response.error?.message || "Не удалось добавить товар",
          title: "Ошибка",
        });
      } catch (err) {
        console.log(err);
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: "Не удалось добавить товар",
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [userId, orderId, loadOrder],
  );

  const handleRemoveItem = useCallback(
    async (productId: number, quantity: number) => {
      if (!userId || !orderId) return;
      setIsUpdating(true);
      try {
        const response = (await adminApi.removeOrderItem(
          parseInt(userId),
          parseInt(orderId),
          productId,
          quantity,
        )) as { success: boolean };
        if (response.success) {
          Toast.show({
            type: "msg",
            title: "Успех!",
            msg: "Товар удален",
          });
          loadOrder();
        } else {
          throw new Error();
        }
      } catch (err) {
        console.log(err);
        Toast.show({
          type: "error",
          title: "Ошибка!",
          msg: "Не удалось удалить товар",
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [userId, orderId, loadOrder],
  );

  useEffect(() => {
    const command = new ApiCommand();
    manager.add("api", command);
  }, []);

  useEffect(() => {
    loadOrder();
    loadProducts();
  }, [loadOrder, loadProducts]);

  if (loading) {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }

  if (!orderData) {
    return (
      <Main>
        <TitleM>Заказ не найден</TitleM>
      </Main>
    );
  }

  const { order, products, summary } = orderData;

  return (
    <Main>
      <OrderContainer>
        <OrderHeader>
          <TitleM>Заказ #{order.id}</TitleM>
          <BodyM>Описание: {order.description}</BodyM>
          <BodyM>Статус: {order.status || "Неизвестен"}</BodyM>
          <BodyM>
            Создан: {new Date(order.timestamps.createdAt).toLocaleDateString()}
          </BodyM>
        </OrderHeader>
        <AddProductSection>
          <TitleM>Добавить товар</TitleM>
          <SmartSearch options={searchOptions} onChange={handleSearch} />
          <DataTable
            data={searchedProducts}
            keys={{
              id: "ID",
              productName: "Название",
              price: "Цена",
              category: "Категория",
            }}
            onSelect={handleSelectProduct}
          />
          <Input
            type="number"
            placeholder="Количество"
            value={addQuantity.toString()}
            onChange={(value) => setAddQuantity(parseInt(value) || 1)}
            min="1"
          />
          <Button
            onClick={() => {
              if (selectedProduct) {
                manager.execute("api", () =>
                  handleAddItem(selectedProduct, addQuantity),
                );
              }
            }}
            disabled={isUpdating || !selectedProduct}
          >
            Добавить
          </Button>
        </AddProductSection>
        <ProductsList>
          {products.map((product) => (
            <ProductItem key={product.id}>
              <ProductImage
                src={product.details?.image_url || ""}
                alt={product.productName}
              />
              <ProductInfo>
                <TitleM>{product.productName}</TitleM>
                <BodyM>Цена: {product.price}р</BodyM>
                <BodyM>
                  Количество: {product.metadata.orderDetails.quantityInOrder}
                </BodyM>
                <BodyM>
                  Итого: {product.metadata.orderDetails.totalPriceForItem}р
                </BodyM>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <Button
                    onClick={() =>
                      manager.execute("api", () => handleAddItem(product.id, 1))
                    }
                    disabled={isUpdating}
                  >
                    +1
                  </Button>
                  <Button
                    onClick={() =>
                      manager.execute("api", () =>
                        handleRemoveItem(product.id, 1),
                      )
                    }
                    disabled={isUpdating}
                  >
                    -1
                  </Button>
                  <Input
                    type="number"
                    placeholder="Кол-во"
                    containerStyle={{
                      width: 180,
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const qty = parseInt(
                          (e.target as HTMLInputElement).value,
                        );
                        if (qty > 0) handleAddItem(product.id, qty);
                      }
                    }}
                  />
                </div>
              </ProductInfo>
            </ProductItem>
          ))}
        </ProductsList>
        <Summary>
          <BodyM>Общее количество товаров: {summary.itemsCount}</BodyM>
          <BodyM>Общая сумма: {summary.totalPrice}р</BodyM>
        </Summary>
      </OrderContainer>
    </Main>
  );
};
