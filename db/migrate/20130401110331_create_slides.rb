class CreateSlides < ActiveRecord::Migration
  def change
    create_table :slides do |t|
      t.integer :presentation_id
      t.string :title
      t.string :subtitle
      t.integer :sequence

      t.timestamps
    end
  end
end
