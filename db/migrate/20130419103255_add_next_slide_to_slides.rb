class AddNextSlideToSlides < ActiveRecord::Migration
  def change
    add_column :slides, :next_slide, :integer
  end
end
