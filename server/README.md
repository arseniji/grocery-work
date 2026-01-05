 tags: date: 04-01-2026 time: 14:27 completed: false 
version: “1.0” 
API (план-минимум) 
DOMAIN = localhost p.s: бэкенд монолитный блятьб 
Auth (auth service) 
CRUD над клиентами 
RegisterRequest

Валидация полей будет производится при заполнении формы
Поля будут также являтсяя ограничивающими условиями в БД.
role абсолютно всегда по умолчанию user. Остальное - в админке или ручками 
Headers 
[POST] DOMAIN/api/v1/auth/register
Content-Type: application/json
Accept: application/json

Body 
{
"login": <string>,
"password": <string>,
"phone": <string>,
"firstname": <string>,
"lastname": <string>,
"patronymic": <string>,
}

Response 
Headers 
HTTP/1.1 201 Created
Set-Cookie: session_id=<id>; HttpOnly; Secure

Body 
{
response:}

"Created",
Login 
Request 
Head 
[POST] DOMAIN/api/v1/auth/login
Content-Type: application/json
Accept: application/json

Body 
{
"login": <string>,
"password": <string>,
}

Response 
Head 
HTTP/1.1 200 OK
Set-Cookie: session_id=<id>; HttpOnly; Secure
Body 
{
response: "Ok",
}

Logout(session_id) 
Request 
Head 
[POST] DOMAIN/api/v1/auth/logout
Cookie: session_id=<id>
Content-Type: application/json
Accept: application/json

Body 
Response 
Head 
HTTP/1.1 204 No Content

Body 
RefreshPassword(session_id) 
Request 
Head 
[PUT] DOMAIN/api/v1/auth/refresh_password
Cookie: session_id=
Content-Type: application/json
Accept: application/json

Body 
{
"new_password": <string>,
}

Response 
Head 
HTTP/1.1 200 OK
Set-Cookie: session_id=<id>; HttpOnly; Secure

Body 
{
"status": "Ok",
}

DeleteAccount(session_id) 
Request 
Head 
[DELETE] DOMAIN/api/v1/auth/delete_account
Cookie: session_id=
Content-Type: application/json
Accept: application/json

Body 
``` 
#### Response
##### Head

HTTP/1.1 200 OK ```Body 
{
}

status:"Ok"
User Content(Administration Module) 
отчёты будут в данном модуле 
About(session_id)
id пользователя 
Request 
Head 
[GET] DOMAIN/api/v1/users/about?id=<num>
Cookie: session_id=

Body 
Response 
Head 
HTTP/1.1 200 OK

Body 
{
"status": "ok",
"user_id": <string>,
"login": <string>,
"phone": <string>,
"firstname": <string>,
"lastname": <string>,
"patronymic": <string>
}

Add_product 
Ручка доступна только юзерам с ролью Admin 
Request 
Head 
[POST] DOMAIN/api/v1/products/add
Cookie: session_id=
Content-Type: application/json

Body 
{
"product_name": <string>,
"price_per_unit": <num>,
"rating": 0.0,
"img_path": <string>,
"description": <string>,
"measurement_unit": <string>
}

Response 
Head 
HTTP/1.1 201 Created

Body 
{
"status": "Ok",
"product_id": <num>
}
Delete_product
Ручка доступна только юзерам с ролью Admin 
Request 
Head 
[POST] DOMAIN/api/v1/products/add
Cookie: session_id=
Content-Type: application/json

Body 
{
"product_id": <num>
}

Response 
Head 
HTTP/1.1 204 No Content

Body 
Shopping Cart & Orders(Client Module) 
Заказы 
Orders(session_id)
page
per_page
для статуса 200, роль владельца сессии должна быть user
запрос учитывает id сессии и соответствующего этой сессии id пользователя
состояние сохраняется вне зависимости от жизни сессии, т.к жёстко привязано к id пользователя
элементами страницы будут orders 
Request 
Head 
[GET] DOMAIN/api/v1/orders?page=<num>&per_page=<num>
Cookie: session_id=
Accept: application/json

Body``` 

#### Response
##### Head

HTTP/1.1 200 OK ``` 
Body 
{
status: "Ok",
page: <num>,
per_page: <num>,
total_pages: <num>,
total_items: <num>,
order_status: <string>,
"orders": [
{
"id": <num>,
"status": <string>,
"created_at": <string>,
"description": <string>,
"total_price": <int>,
"order_items": [
"order_id": <num>,
"product_id": <num>,
"product_name": <num>,
"price_at_order": <num>,
"measurement_unit": <string>,
"units": <num>,}

]
},...
Make_order 
При выполнении данной команды, фронт должен удалять элементы из корзины 
Head 
[POST] DOMAIN/api/v1/orders/make
Cookie: session_id=
Accept: application/json

Body 
{
"description": <string>,
"order_products": {
"product_id": <num>
}
}

Response 
Head 
HTTP/1.1 201 Created

Body 
{
"status": "Created",
"order_id": <num>,
"created_at": <string>,
"total_price": <num>,
"created_at": <num>,
"order_status": string
}

Delete_order 
должна выполнятся проврека, что id заказа принадлежит id пользователя 
Head 
[DELETE] DOMAIN/api/v1/orders/delete
Cookie: session_id=
Accept: application/json

Body 
{
"order_id": <num>
}

Response 
Head 
HTTP/1.1 200 OK

Body 
{
"status": "Ok",
"order_id": <num>,
"created_at": <string>,
"total_price": <num>,
"created_at": <num>
}

Cart(session_id)(отменено)page
per_page
для статуса 200, роль владельца сессии должна быть user
запрос учитывает id сессии и соответствующего этой сессии id пользователя
состояние не сохраняется из-за зависимости к жизни сессии, т.к жёстко привязано к session_id
элементами страницы будут products 
Request 
Head 
[GET] DOMAIN/api/v1/orders?page=<num>&per_page=<num>
Cookie: session_id=
Accept: application/json

Body 
``` 
 ## Products
### Products
* селект с пагинацией из всей БД
* в query будет учитываться 
* search = "поиск ключевого слова в названии продукта" (ток один)
* tag = "поиск тэга продукта" (ток один)
##### Head

[GET] DOMAIN/api/v1/products?search=&tag= ``` 
Body 
Response
Head 
HTTP/1.1 200 OK

Body 
{
status: "Ok",
page: <num>,
per_page: <num>,
total_pages: <num>,
total_items: <num>,
"products": [
{
"product_id": <num>,
"product_name": <string>,
"raiting": <num>, # от 0 до 5
"img_path": <string>,
"description": <string>,
"measurement_unit": <string>
},...
]
}

Product_info 
данные о конкретном продукте
product_id эквивалентен id из таблицы Products 
Request 
Head 
[GET] DOMAIN/api/v1/product/info?product_id=<num>

Body 
Response 
Head 
HTTP/1.1 200 OK

Body 
``` { “status”: “Ok”, “product_name”: , “price_per_unit”: , “raiting”: , “img_path”: , “description”: , “measurement_unit”: }