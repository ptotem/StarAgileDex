class AddMainToSlides < ActiveRecord::Migration
  def change
    add_column :slides, :main, :text
  end
end
