class AddLocationToProducts < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :location, :string
  end
end
