class CreateQues < ActiveRecord::Migration
  def change
    create_table :ques do |t|

      t.timestamps
    end
  end
end
