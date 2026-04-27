# db/seeds.rb
# Очищаем старые данные
require 'bcrypt'
OrderItem.destroy_all
Order.destroy_all
Product.destroy_all
User.destroy_all

puts "🌱 Заполняем базу данных продуктового магазина..."

# 1. Пользователи - ИСПРАВЛЕННАЯ ВЕРСИЯ
users = [
  {
    login: 'admin',
    phone: '+79991112233',
    password_digest: BCrypt::Password.create('admin123'),
    firstname: 'Иван',
    lastname: 'Петров',
    patronymic: 'Сергеевич',
    role: 'admin'
  },
  {
    login: 'alex',
    phone: '+79994445566',
    password_digest: BCrypt::Password.create('user123'),
    firstname: 'Алексей',
    lastname: 'Смирнов',
    patronymic: 'Игоревич',
    role: 'customer'
  },
  {
    login: 'maria',
    phone: '+79997778899',
    password_digest: BCrypt::Password.create('user123'),
    firstname: 'Мария',
    lastname: 'Иванова',
    patronymic: 'Дмитриевна',
    role: 'customer'
  }
]

users.each do |user_data|
  User.create!(user_data)
  puts "👤 Пользователь: #{user_data[:login]}"
end

puts "✅ Пользователей создано: #{User.count}"

# 2. Категории товаров на английском
categories = {
  vegetables: 'vegetables',
  fruits: 'fruits',
  dairy: 'dairy',
  meat: 'meat',
  fish: 'fish',
  grocery: 'grocery',
  drinks: 'drinks',
  bakery: 'bakery'
}

# 3. Товары (продуктовый магазин) с новыми полями category, quantity и barcode
products = [
  # ОВОЩИ
  {
    product_name: 'Картофель',
    barcode: '4600000000012',
    price: 49.99,
    rating: 4.5,
    description: 'Молодой, мытый, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/potato.jpg',
    category: 'vegetables',
    quantity: 150
  },
  {
    product_name: 'Помидоры',
    barcode: '4600000000029',
    price: 189.99,
    rating: 4.7,
    description: 'Помидоры черри, 500г',
    measurement_unit: 'кг',
    img_path: '/images/products/tomatoes.jpg',
    category: 'vegetables',
    quantity: 75
  },
  {
    product_name: 'Огурцы',
    barcode: '4600000000036',
    price: 129.99,
    rating: 4.4,
    description: 'Свежие грунтовые, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/cucumbers.jpg',
    category: 'vegetables',
    quantity: 90
  },
  {
    product_name: 'Лук репчатый',
    barcode: '4600000000043',
    price: 39.99,
    rating: 4.3,
    description: 'Желтый, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/onion.jpg',
    category: 'vegetables',
    quantity: 200
  },
  {
    product_name: 'Морковь',
    barcode: '4600000000050',
    price: 59.99,
    rating: 4.6,
    description: 'Свежая, мытая, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/carrots.jpg',
    category: 'vegetables',
    quantity: 120
  },
  {
    product_name: 'Капуста белокочанная',
    barcode: '4600000000067',
    price: 45.99,
    rating: 4.2,
    description: 'Свежая, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/cabbage.jpg',
    category: 'vegetables',
    quantity: 80
  },

  # ФРУКТЫ
  {
    product_name: 'Яблоки Гренни Смит',
    barcode: '4600000000074',
    price: 149.99,
    rating: 4.8,
    description: 'Зеленые, кисло-сладкие, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/apples.jpg',
    category: 'fruits',
    quantity: 180
  },
  {
    product_name: 'Бананы',
    barcode: '4600000000081',
    price: 89.99,
    rating: 4.9,
    description: 'Спелые, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/bananas.jpg',
    category: 'fruits',
    quantity: 250
  },
  {
    product_name: 'Апельсины',
    barcode: '4600000000098',
    price: 129.99,
    rating: 4.7,
    description: 'Марокко, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/oranges.jpg',
    category: 'fruits',
    quantity: 150
  },
  {
    product_name: 'Клубника',
    barcode: '4600000000104',
    price: 399.99,
    rating: 4.9,
    description: 'Свежая, 500г',
    measurement_unit: 'кг',
    img_path: '/images/products/strawberries.jpg',
    category: 'fruits',
    quantity: 40
  },
  {
    product_name: 'Виноград Кишмиш',
    barcode: '4600000000111',
    price: 289.99,
    rating: 4.6,
    description: 'Без косточек, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/grapes.jpg',
    category: 'fruits',
    quantity: 60
  },

  # МОЛОЧНЫЕ ПРОДУКТЫ
  {
    product_name: 'Молоко 3.2%',
    barcode: '4600000000128',
    price: 89.99,
    rating: 4.5,
    description: 'Простоквашино, ультрапастеризованное, 1л',
    measurement_unit: 'л',
    img_path: '/images/products/milk.jpg',
    category: 'dairy',
    quantity: 200
  },
  {
    product_name: 'Сметана 20%',
    barcode: '4600000000135',
    price: 129.99,
    rating: 4.4,
    description: 'Домик в деревне, 400г',
    measurement_unit: 'г',
    img_path: '/images/products/sour_cream.jpg',
    category: 'dairy',
    quantity: 120
  },
  {
    product_name: 'Творог 9%',
    barcode: '4600000000142',
    price: 189.99,
    rating: 4.7,
    description: 'Простоквашино, 500г',
    measurement_unit: 'г',
    img_path: '/images/products/cottage_cheese.jpg',
    category: 'dairy',
    quantity: 100
  },
  {
    product_name: 'Сыр Российский',
    barcode: '4600000000159',
    price: 449.99,
    rating: 4.8,
    description: 'Полутвердый, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/cheese.jpg',
    category: 'dairy',
    quantity: 70
  },
  {
    product_name: 'Йогурт питьевой',
    barcode: '4600000000166',
    price: 59.99,
    rating: 4.3,
    description: 'Активиа, натуральный, 290мл',
    measurement_unit: 'шт',
    img_path: '/images/products/yogurt.jpg',
    category: 'dairy',
    quantity: 300
  },
  {
    product_name: 'Масло сливочное 82.5%',
    barcode: '4600000000173',
    price: 249.99,
    rating: 4.6,
    description: 'Крестьянское, 180г',
    measurement_unit: 'г',
    img_path: '/images/products/butter.jpg',
    category: 'dairy',
    quantity: 150
  },

  # МЯСО И ПТИЦА
  {
    product_name: 'Курица охлажденная',
    barcode: '4600000000180',
    price: 299.99,
    rating: 4.5,
    description: 'Тушка, 1.5-2кг',
    measurement_unit: 'кг',
    img_path: '/images/products/chicken.jpg',
    category: 'meat',
    quantity: 50
  },
  {
    product_name: 'Говядина вырезка',
    barcode: '4600000000197',
    price: 799.99,
    rating: 4.9,
    description: 'Охлажденная, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/beef.jpg',
    category: 'meat',
    quantity: 30
  },
  {
    product_name: 'Свинина шея',
    barcode: '4600000000203',
    price: 499.99,
    rating: 4.7,
    description: 'Охлажденная, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/pork.jpg',
    category: 'meat',
    quantity: 40
  },
  {
    product_name: 'Фарш куриный',
    barcode: '4600000000210',
    price: 349.99,
    rating: 4.4,
    description: 'Охлажденный, 500г',
    measurement_unit: 'г',
    img_path: '/images/products/minced_meat.jpg',
    category: 'meat',
    quantity: 80
  },
  {
    product_name: 'Чебупели Горячая штучка',
    barcode: '4600000000227',
    price: 99.99,
    rating: 4.8,
    description: 'Сочные с мясом, 300г',
    measurement_unit: 'упак',
    img_path: '/images/products/chebupelli_hot.jpg',
    category: 'meat',
    quantity: 1
  },
  
  # РЫБА
  {
    product_name: 'Лосось свежий',
    barcode: '4600000000234',
    price: 1299.99,
    rating: 4.8,
    description: 'Филе, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/salmon.jpg',
    category: 'fish',
    quantity: 25
  },
  {
    product_name: 'Форель радужная',
    barcode: '4600000000241',
    price: 899.99,
    rating: 4.7,
    description: 'Охлажденная, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/trout.jpg',
    category: 'fish',
    quantity: 35
  },
  {
    product_name: 'Креветки тигровые',
    barcode: '4600000000258',
    price: 899.99,
    rating: 4.9,
    description: 'Замороженные, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/shrimp.jpg',
    category: 'fish',
    quantity: 40
  },

  # БАКАЛЕЯ
  {
    product_name: 'Рис Жасмин',
    barcode: '4600000000265',
    price: 149.99,
    rating: 4.6,
    description: 'Тайский, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/rice.jpg',
    category: 'grocery',
    quantity: 200
  },
  {
    product_name: 'Гречневая крупа',
    barcode: '4600000000272',
    price: 129.99,
    rating: 4.7,
    description: 'Ядрица, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/buckwheat.jpg',
    category: 'grocery',
    quantity: 150
  },
  {
    product_name: 'Макароны спагетти',
    barcode: '4600000000289',
    price: 89.99,
    rating: 4.5,
    description: 'Barilla №5, 450г',
    measurement_unit: 'г',
    img_path: '/images/products/pasta.jpg',
    category: 'grocery',
    quantity: 250
  },
  {
    product_name: 'Мука пшеничная',
    barcode: '4600000000296',
    price: 79.99,
    rating: 4.4,
    description: 'Высший сорт, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/flour.jpg',
    category: 'grocery',
    quantity: 180
  },
  {
    product_name: 'Сахар песок',
    barcode: '4600000000302',
    price: 69.99,
    rating: 4.3,
    description: 'Кристаллический, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/sugar.jpg',
    category: 'grocery',
    quantity: 220
  },
  {
    product_name: 'Соль йодированная',
    barcode: '4600000000319',
    price: 29.99,
    rating: 4.3,
    description: 'Помол №1, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/salt.jpg',
    category: 'grocery',
    quantity: 190
  },
  {
    product_name: 'Масло подсолнечное',
    barcode: '4600000000326',
    price: 139.99,
    rating: 4.5,
    description: 'Олейна, рафинированное, 1л',
    measurement_unit: 'л',
    img_path: '/images/products/oil.jpg',
    category: 'grocery',
    quantity: 160
  },

  # НАПИТКИ
  {
    product_name: 'Вода минеральная',
    barcode: '4600000000333',
    price: 49.99,
    rating: 4.4,
    description: 'Боржоми, 0.5л',
    measurement_unit: 'шт',
    img_path: '/images/products/water.jpg',
    category: 'drinks',
    quantity: 300
  },
  {
    product_name: 'Сок яблочный',
    barcode: '4600000000340',
    price: 119.99,
    rating: 4.6,
    description: 'Добрый, 1л',
    measurement_unit: 'л',
    img_path: '/images/products/juice.jpg',
    category: 'drinks',
    quantity: 180
  },
  {
    product_name: 'Кофе молотый',
    barcode: '4600000000357',
    price: 399.99,
    rating: 4.8,
    description: 'Jacobs Monarch, 250г',
    measurement_unit: 'г',
    img_path: '/images/products/coffee.jpg',
    category: 'drinks',
    quantity: 120
  },
  {
    product_name: 'Чай черный',
    barcode: '4600000000364',
    price: 189.99,
    rating: 4.7,
    description: 'Greenfield English, 25 пакетиков',
    measurement_unit: 'упак',
    img_path: '/images/products/tea.jpg',
    category: 'drinks',
    quantity: 140
  },

  # ХЛЕБ И ВЫПЕЧКА
  {
    product_name: 'Хлеб Бородинский',
    barcode: '4600000000371',
    price: 69.99,
    rating: 4.8,
    description: 'На закваске, 400г',
    measurement_unit: 'шт',
    img_path: '/images/products/bread.jpg',
    category: 'bakery',
    quantity: 100
  },
  {
    product_name: 'Батон нарезной',
    barcode: '4600000000388',
    price: 49.99,
    rating: 4.3,
    description: 'Пшеничный, 350г',
    measurement_unit: 'шт',
    img_path: '/images/products/loaf.jpg',
    category: 'bakery',
    quantity: 120
  },
  {
    product_name: 'Булочки сдобные',
    barcode: '4600000000395',
    price: 89.99,
    rating: 4.6,
    description: 'С изюмом, 4 шт',
    measurement_unit: 'упак',
    img_path: '/images/products/buns.jpg',
    category: 'bakery',
    quantity: 80
  },
  {
    product_name: 'Пряник грустный',
    barcode: '4600000000401',
    price: 20.99,
    rating: 2.6,
    description: 'С изюмом, 4 шт',
    measurement_unit: 'упак',
    img_path: '/images/products/pryanik.jpg',
    category: 'bakery',
    quantity: 1
  }
]

products.each do |product_data|
  Product.create!(product_data)
  puts "🛒 Товар: #{product_data[:product_name]} - Штрих-код: #{product_data[:barcode]} - Категория: #{product_data[:category]} - Кол-во: #{product_data[:quantity]}"
end

puts "✅ Товаров создано: #{Product.count}"

# 4. Создаем тестовые заказы
puts "\n📦 Создаем тестовые заказы..."

# Заказ для Алексея
alex = User.find_by(login: 'alex')
if alex
  order1 = alex.orders.create!(
    status: :delivered,
    description: 'Доставить до 19:00, оставить у двери'
  )

  # Добавляем продукты в заказ
  [
    { name: 'Картофель', quantity: 2 },
    { name: 'Помидоры', quantity: 1 },
    { name: 'Огурцы', quantity: 1 },
    { name: 'Молоко 3.2%', quantity: 2 },
    { name: 'Хлеб Бородинский', quantity: 1 }
  ].each do |item|
    product = Product.find_by(product_name: item[:name])
    if product
      order1.order_items.create!(
        product: product,
        quantity: item[:quantity],
        price_at_order: product.price
      )
      # Обновляем количество товара на складе (уменьшаем)
      product.update(quantity: product.quantity - item[:quantity])
    end
  end

  puts "📦 Заказ #1 для #{alex.login}: #{order1.order_items.count} позиций"
end

# Заказ для Марии
maria = User.find_by(login: 'maria')
if maria
  order2 = maria.orders.create!(
    status: :processing,
    description: 'Позвонить перед выездом курьера'
  )

  [
    { name: 'Яблоки Гренни Смит', quantity: 2 },
    { name: 'Бананы', quantity: 1 },
    { name: 'Клубника', quantity: 2 },
    { name: 'Йогурт питьевой', quantity: 6 },
    { name: 'Сыр Российский', quantity: 0.5 }
  ].each do |item|
    product = Product.find_by(product_name: item[:name])
    if product
      order2.order_items.create!(
        product: product,
        quantity: item[:quantity],
        price_at_order: product.price
      )
      # Обновляем количество товара на складе
      product.update(quantity: product.quantity - item[:quantity])
    end
  end

  puts "📦 Заказ #2 для #{maria.login}: #{order2.order_items.count} позиций"
end

# Большой заказ для Админа
admin = User.find_by(login: 'admin')
if admin
  order3 = admin.orders.create!(
    status: :pending,
    description: 'Собрать все свежее, для праздничного стола'
  )

  [
    { name: 'Лосось свежий', quantity: 1 },
    { name: 'Креветки тигровые', quantity: 1 },
    { name: 'Говядина вырезка', quantity: 1.5 },
    { name: 'Виноград Кишмиш', quantity: 2 },
    { name: 'Апельсины', quantity: 3 },
    { name: 'Сметана 20%', quantity: 2 },
    { name: 'Кофе молотый', quantity: 1 },
    { name: 'Чай черный', quantity: 2 }
  ].each do |item|
    product = Product.find_by(product_name: item[:name])
    if product
      order3.order_items.create!(
        product: product,
        quantity: item[:quantity],
        price_at_order: product.price
      )
      # Обновляем количество товара на складе
      product.update(quantity: product.quantity - item[:quantity])
    end
  end

  puts "📦 Заказ #3 для #{admin.login}: #{order3.order_items.count} позиций"
end

# Вывод статистики по категориям
puts "\n📊 Статистика по категориям:"
categories.values.uniq.each do |category|
  category_products = Product.where(category: category)
  total_quantity = category_products.sum(:quantity)
  avg_price = category_products.average(:price).to_f.round(2)
  puts "  #{category.capitalize}: #{category_products.count} товаров, всего: #{total_quantity} шт., средняя цена: #{avg_price} руб."
end

# Вывод первых 10 баркодов для проверки
puts "\n🔍 Примеры штрих-кодов:"
Product.limit(10).each do |product|
  puts "  #{product.product_name}: #{product.barcode}"
end

puts "\n📊 ИТОГО:"
puts "👤 Пользователей: #{User.count}"
puts "🛒 Товаров: #{Product.count}"
puts "📦 Заказов: #{Order.count}"
puts "📋 Позиций в заказах: #{OrderItem.count}"
puts "💰 Общая стоимость товаров на складе: #{Product.sum('price * quantity').round(2)} руб."
puts "📈 Среднее количество товара: #{(Product.sum(:quantity).to_f / Product.count).round(2)} шт."

puts "\n✅ База данных успешно заполнена!"