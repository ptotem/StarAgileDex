class AddAttachmentImageToContentBlocks < ActiveRecord::Migration
  def self.up
    change_table :content_blocks do |t|
      t.attachment :image
    end
  end

  def self.down
    drop_attached_file :content_blocks, :image
  end
end
