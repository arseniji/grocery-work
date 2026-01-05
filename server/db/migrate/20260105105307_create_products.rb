class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string :product_name
      t.decimal :price
      t.decimal :rating
      t.string :img_path
      t.text :description
      t.string :measurement_unit

      t.timestamps
    end
  end
end
