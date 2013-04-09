class AddAttachmentPptToSlides < ActiveRecord::Migration
  def self.up
    change_table :slides do |t|
      t.attachment :ppt
    end
  end

  def self.down
    drop_attached_file :slides, :ppt
  end
end
