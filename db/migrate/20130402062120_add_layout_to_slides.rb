class AddLayoutToSlides < ActiveRecord::Migration
  def change
    add_column :slides, :layout, :string, :default=>"basic"
    add_column :slides, :font, :string, :default=>"Arial"
    add_column :slides, :background, :string, :default=>"#ffffff"
  end
end
