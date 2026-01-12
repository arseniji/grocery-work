--
-- PostgreSQL database dump
--

\restrict J2IUqf8zUvpEOT1tVJYSS6g7u51VmtMlsFc6tf3ZRLd86xBiQ1b2QHoq5ARrehX

-- Dumped from database version 13.23 (Debian 13.23-1.pgdg13+1)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.ar_internal_metadata OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer,
    price_at_order numeric,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    status character varying,
    description text,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    product_name character varying,
    price numeric,
    rating numeric,
    img_path character varying,
    description text,
    measurement_unit character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    quantity integer,
    category character varying
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


ALTER TABLE public.schema_migrations OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    login character varying,
    phone character varying,
    password_digest character varying,
    firstname character varying,
    lastname character varying,
    patronymic character varying,
    created_at timestamp(6) without time zone NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    role character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: ar_internal_metadata; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ar_internal_metadata (key, value, created_at, updated_at) FROM stdin;
environment	development	2026-01-12 17:27:18.672638	2026-01-12 17:27:18.672641
schema_sha1	83075879ee42cf24a0482f723d273ead0087c22d	2026-01-12 17:27:18.677407	2026-01-12 17:27:18.677408
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, product_id, quantity, price_at_order, created_at, updated_at) FROM stdin;
19	4	39	2	49.99	2026-01-12 17:33:29.801717	2026-01-12 17:33:29.801717
20	4	40	1	189.99	2026-01-12 17:33:29.821213	2026-01-12 17:33:29.821213
21	4	41	1	129.99	2026-01-12 17:33:29.830331	2026-01-12 17:33:29.830331
22	4	50	2	89.99	2026-01-12 17:33:29.838112	2026-01-12 17:33:29.838112
23	4	74	1	69.99	2026-01-12 17:33:29.84734	2026-01-12 17:33:29.84734
24	5	45	2	149.99	2026-01-12 17:33:29.864899	2026-01-12 17:33:29.864899
25	5	46	1	89.99	2026-01-12 17:33:29.875467	2026-01-12 17:33:29.875467
26	5	48	2	399.99	2026-01-12 17:33:29.88327	2026-01-12 17:33:29.88327
27	5	54	6	59.99	2026-01-12 17:33:29.890297	2026-01-12 17:33:29.890297
28	5	53	0	449.99	2026-01-12 17:33:29.899982	2026-01-12 17:33:29.899982
29	6	60	1	1299.99	2026-01-12 17:33:29.915803	2026-01-12 17:33:29.915803
30	6	62	1	899.99	2026-01-12 17:33:29.924308	2026-01-12 17:33:29.924308
31	6	57	1	799.99	2026-01-12 17:33:29.935304	2026-01-12 17:33:29.935304
32	6	49	2	289.99	2026-01-12 17:33:29.949462	2026-01-12 17:33:29.949462
33	6	47	3	129.99	2026-01-12 17:33:29.959612	2026-01-12 17:33:29.959612
34	6	51	2	129.99	2026-01-12 17:33:29.97335	2026-01-12 17:33:29.97335
35	6	72	1	399.99	2026-01-12 17:33:29.984092	2026-01-12 17:33:29.984092
36	6	73	2	189.99	2026-01-12 17:33:29.993974	2026-01-12 17:33:29.993974
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, status, description, created_at, updated_at) FROM stdin;
4	5	delivered	Доставить до 19:00, оставить у двери	2026-01-12 17:33:29.784499	2026-01-12 17:33:29.784499
5	6	processing	Позвонить перед выездом курьера	2026-01-12 17:33:29.85679	2026-01-12 17:33:29.85679
6	4	pending	Собрать все свежее, для праздничного стола	2026-01-12 17:33:29.911062	2026-01-12 17:33:29.911062
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, product_name, price, rating, img_path, description, measurement_unit, created_at, updated_at, quantity, category) FROM stdin;
39	Картофель	49.99	4.5	/images/products/potato.jpg	Молодой, мытый, 1кг	кг	2026-01-12 17:33:29.608263	2026-01-12 17:33:29.81105	148	vegetables
40	Помидоры	189.99	4.7	/images/products/tomatoes.jpg	Помидоры черри, 500г	кг	2026-01-12 17:33:29.616447	2026-01-12 17:33:29.824813	74	vegetables
41	Огурцы	129.99	4.4	/images/products/cucumbers.jpg	Свежие грунтовые, 1кг	кг	2026-01-12 17:33:29.62095	2026-01-12 17:33:29.833789	89	vegetables
42	Лук репчатый	39.99	4.3	/images/products/onion.jpg	Желтый, 1кг	кг	2026-01-12 17:33:29.629149	2026-01-12 17:33:29.629149	200	vegetables
43	Морковь	59.99	4.6	/images/products/carrots.jpg	Свежая, мытая, 1кг	кг	2026-01-12 17:33:29.632226	2026-01-12 17:33:29.632226	120	vegetables
44	Капуста белокочанная	45.99	\N	/images/products/cabbage.jpg	Свежая, 1кг	кг	2026-01-12 17:33:29.635676	2026-01-12 17:33:29.635676	80	vegetables
52	Творог 9%	189.99	4.7	/images/products/cottage_cheese.jpg	Простоквашино, 500г	г	2026-01-12 17:33:29.671139	2026-01-12 17:33:29.671139	100	dairy
55	Масло сливочное 82.5%	249.99	4.6	/images/products/butter.jpg	Крестьянское, 180г	г	2026-01-12 17:33:29.681121	2026-01-12 17:33:29.681121	150	dairy
56	Курица охлажденная	299.99	4.5	/images/products/chicken.jpg	Тушка, 1.5-2кг	кг	2026-01-12 17:33:29.683521	2026-01-12 17:33:29.683521	50	meat
58	Свинина шея	499.99	4.7	/images/products/pork.jpg	Охлажденная, 1кг	кг	2026-01-12 17:33:29.690996	2026-01-12 17:33:29.690996	40	meat
59	Фарш куриный	349.99	4.4	/images/products/minced_meat.jpg	Охлажденный, 500г	г	2026-01-12 17:33:29.694303	2026-01-12 17:33:29.694303	80	meat
61	Форель радужная	899.99	4.7	/images/products/trout.jpg	Охлажденная, 1кг	кг	2026-01-12 17:33:29.701324	2026-01-12 17:33:29.701324	35	fish
63	Рис Жасмин	149.99	4.6	/images/products/rice.jpg	Тайский, 1кг	кг	2026-01-12 17:33:29.707576	2026-01-12 17:33:29.707576	200	grocery
64	Гречневая крупа	129.99	4.7	/images/products/buckwheat.jpg	Ядрица, 1кг	кг	2026-01-12 17:33:29.711276	2026-01-12 17:33:29.711276	150	grocery
65	Макароны спагетти	89.99	4.5	/images/products/pasta.jpg	Barilla №5, 450г	г	2026-01-12 17:33:29.719225	2026-01-12 17:33:29.719225	250	grocery
66	Мука пшеничная	79.99	4.4	/images/products/flour.jpg	Высший сорт, 1кг	кг	2026-01-12 17:33:29.728006	2026-01-12 17:33:29.728006	180	grocery
67	Сахар песок	69.99	\N	/images/products/sugar.jpg	Кристаллический, 1кг	кг	2026-01-12 17:33:29.731187	2026-01-12 17:33:29.731187	220	grocery
68	Соль йодированная	29.99	4.3	/images/products/salt.jpg	Помол №1, 1кг	кг	2026-01-12 17:33:29.736365	2026-01-12 17:33:29.736365	190	grocery
69	Масло подсолнечное	139.99	4.5	/images/products/oil.jpg	Олейна, рафинированное, 1л	л	2026-01-12 17:33:29.741737	2026-01-12 17:33:29.741737	160	grocery
70	Вода минеральная	49.99	4.4	/images/products/water.jpg	Боржоми, 0.5л	шт	2026-01-12 17:33:29.745449	2026-01-12 17:33:29.745449	300	drinks
71	Сок яблочный	119.99	4.6	/images/products/juice.jpg	Добрый, 1л	л	2026-01-12 17:33:29.748381	2026-01-12 17:33:29.748381	180	drinks
75	Батон нарезной	49.99	4.3	/images/products/loaf.jpg	Пшеничный, 350г	шт	2026-01-12 17:33:29.760741	2026-01-12 17:33:29.760741	120	bakery
76	Булочки сдобные	89.99	4.6	/images/products/buns.jpg	С изюмом, 4 шт	упак	2026-01-12 17:33:29.763858	2026-01-12 17:33:29.763858	80	bakery
50	Молоко 3.2%	89.99	4.5	/images/products/milk.jpg	Простоквашино, ультрапастеризованное, 1л	л	2026-01-12 17:33:29.661601	2026-01-12 17:33:29.841891	198	dairy
74	Хлеб Бородинский	69.99	4.8	/images/products/bread.jpg	На закваске, 400г	шт	2026-01-12 17:33:29.757472	2026-01-12 17:33:29.850769	99	bakery
45	Яблоки Гренни Смит	149.99	4.8	/images/products/apples.jpg	Зеленые, кисло-сладкие, 1кг	кг	2026-01-12 17:33:29.642007	2026-01-12 17:33:29.869425	178	fruits
46	Бананы	89.99	4.9	/images/products/bananas.jpg	Спелые, 1кг	кг	2026-01-12 17:33:29.646137	2026-01-12 17:33:29.879118	249	fruits
48	Клубника	399.99	4.9	/images/products/strawberries.jpg	Свежая, 500г	кг	2026-01-12 17:33:29.653112	2026-01-12 17:33:29.886345	38	fruits
54	Йогурт питьевой	59.99	4.3	/images/products/yogurt.jpg	Активиа, натуральный, 290мл	шт	2026-01-12 17:33:29.677945	2026-01-12 17:33:29.895114	294	dairy
53	Сыр Российский	449.99	4.8	/images/products/cheese.jpg	Полутвердый, 1кг	кг	2026-01-12 17:33:29.674811	2026-01-12 17:33:29.903203	69	dairy
60	Лосось свежий	1299.99	4.8	/images/products/salmon.jpg	Филе, 1кг	кг	2026-01-12 17:33:29.698086	2026-01-12 17:33:29.919571	24	fish
62	Креветки тигровые	899.99	4.9	/images/products/shrimp.jpg	Замороженные, 1кг	кг	2026-01-12 17:33:29.704721	2026-01-12 17:33:29.929681	39	fish
57	Говядина вырезка	799.99	4.9	/images/products/beef.jpg	Охлажденная, 1кг	кг	2026-01-12 17:33:29.688184	2026-01-12 17:33:29.93984	28	meat
49	Виноград Кишмиш	289.99	4.6	/images/products/grapes.jpg	Без косточек, 1кг	кг	2026-01-12 17:33:29.656621	2026-01-12 17:33:29.954054	58	fruits
47	Апельсины	129.99	4.7	/images/products/oranges.jpg	Марокко, 1кг	кг	2026-01-12 17:33:29.649219	2026-01-12 17:33:29.965624	147	fruits
51	Сметана 20%	129.99	4.4	/images/products/sour_cream.jpg	Домик в деревне, 400г	г	2026-01-12 17:33:29.667368	2026-01-12 17:33:29.978614	118	dairy
72	Кофе молотый	399.99	4.8	/images/products/coffee.jpg	Jacobs Monarch, 250г	г	2026-01-12 17:33:29.751927	2026-01-12 17:33:29.988013	119	drinks
73	Чай черный	189.99	4.7	/images/products/tea.jpg	Greenfield English, 25 пакетиков	упак	2026-01-12 17:33:29.754903	2026-01-12 17:33:29.998523	138	drinks
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schema_migrations (version) FROM stdin;
20260112153511
20260107103740
20260105105344
20260105105324
20260105105307
20260105105237
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, login, phone, password_digest, firstname, lastname, patronymic, created_at, updated_at, role) FROM stdin;
4	admin	79991112233	$2a$12$Oz72SeSa.i.IKJIp.sGg6.SSEvASwpLstb3ad5FS8hyVVMNjEfZHu	Иван	Петров	Сергеевич	2026-01-12 17:33:29.573096	2026-01-12 17:33:29.573096	admin
5	alex	79994445566	$2a$12$BfTrcYd3U7pwRBXuPP56FeO7FH/B8AcJHHe681waXi9LcTSI6iuL6	Алексей	Смирнов	Игоревич	2026-01-12 17:33:29.59163	2026-01-12 17:33:29.59163	customer
6	maria	79997778899	$2a$12$dp7R2cXTDjeJYhvlMuO2ROyUlO6K1VL3t1FNcmuiXgMj.rg69oNEa	Мария	Иванова	Дмитриевна	2026-01-12 17:33:29.601223	2026-01-12 17:33:29.601223	customer
\.


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 36, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 6, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 76, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_order_items_on_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_order_items_on_order_id ON public.order_items USING btree (order_id);


--
-- Name: index_order_items_on_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_order_items_on_product_id ON public.order_items USING btree (product_id);


--
-- Name: index_orders_on_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_orders_on_user_id ON public.orders USING btree (user_id);


--
-- Name: index_users_on_login; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_users_on_login ON public.users USING btree (login);


--
-- Name: index_users_on_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX index_users_on_phone ON public.users USING btree (phone);


--
-- Name: order_items fk_rails_e3cb28f071; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_rails_e3cb28f071 FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items fk_rails_f1a29ddd47; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fk_rails_f1a29ddd47 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders fk_rails_f868b47f6a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_rails_f868b47f6a FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict J2IUqf8zUvpEOT1tVJYSS6g7u51VmtMlsFc6tf3ZRLd86xBiQ1b2QHoq5ARrehX

