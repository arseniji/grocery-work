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

# 3. Товары (продуктовый магазин) с новыми полями category и quantity
products = [
  # ОВОЩИ
  {
    product_name: 'Картофель',
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
    price: 45.99,
    description: 'Свежая, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/cabbage.jpg',
    category: 'vegetables',
    quantity: 80
  },

  # ФРУКТЫ
  {
    product_name: 'Яблоки Гренни Смит',
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
    price: 69.99,
    description: 'Кристаллический, 1кг',
    measurement_unit: 'кг',
    img_path: '/images/products/sugar.jpg',
    category: 'grocery',
    quantity: 220
  },
  {
    product_name: 'Соль йодированная',
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
  puts "🛒 Товар: #{product_data[:product_name]} - Категория: #{product_data[:category]} - Кол-во: #{product_data[:quantity]}"
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

puts "\n📊 ИТОГО:"
puts "👤 Пользователей: #{User.count}"
puts "🛒 Товаров: #{Product.count}"
puts "📦 Заказов: #{Order.count}"
puts "📋 Позиций в заказах: #{OrderItem.count}"
puts "💰 Общая стоимость товаров на складе: #{Product.sum('price * quantity').round(2)} руб."
puts "📈 Среднее количество товара: #{(Product.sum(:quantity).to_f / Product.count).round(2)} шт."

puts "\n✅ База данных успешно заполнена!"
