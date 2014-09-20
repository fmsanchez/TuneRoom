class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.string :name
      t.text :library, :limit => nil
      t.text :queue, :limit => nil

      t.timestamps
    end
  end
end
