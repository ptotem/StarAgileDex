class Createfeedbacks < ActiveRecord::Migration
  def up
    create_table :feedbacks do |t|
      t.string :subject
      t.string :email
      t.text   :comment
      t.integer :user_id
      t.timestamps
    end
  end

  def down
    drop_table :feedbacks
  end
end
