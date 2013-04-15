class AddNosubToSlides < ActiveRecord::Migration
  def change
    add_column :slides, :nosub, :boolean, :default=>false
  end
end
