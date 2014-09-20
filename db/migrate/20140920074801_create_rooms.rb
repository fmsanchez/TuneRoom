class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.string :name
      t.text :library
      t.text :queue

      t.timestamps
    end
  end
end
