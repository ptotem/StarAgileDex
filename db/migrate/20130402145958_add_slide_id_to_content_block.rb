class AddSlideIdToContentBlock < ActiveRecord::Migration
  def change
    add_column :content_blocks, :slide_id, :integer
  end
end
