class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :login
      t.string :phone
      t.string :password_digest
      t.string :firstname
      t.string :lastname
      t.string :patronymic

      t.timestamps
    end
    add_index :users, :login, unique: true
    add_index :users, :phone, unique: true
  end
end
