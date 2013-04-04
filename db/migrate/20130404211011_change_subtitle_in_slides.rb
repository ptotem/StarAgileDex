class ChangeSubtitleInSlides < ActiveRecord::Migration
  def change
    change_column :slides, :subtitle, :text, :limit => nil
  end
end
