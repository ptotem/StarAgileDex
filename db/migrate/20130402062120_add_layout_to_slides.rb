class AddLayoutToSlides < ActiveRecord::Migration
  def change
    add_column :slides, :layout, :string, :default=>"0"
    add_column :slides, :font, :string, :default=>"default"
    add_column :slides, :background, :string, :default=>"default"
  end
end
