class AddModeToSlides < ActiveRecord::Migration
  def change
    add_column :slides, :mode, :string, :default=>"HTML"
  end
end
