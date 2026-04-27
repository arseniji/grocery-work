class AddUniqueIndexToProductsBarcode < ActiveRecord::Migration[8.0]
  def change
        add_index :products, :barcode, unique: true
  end
end
