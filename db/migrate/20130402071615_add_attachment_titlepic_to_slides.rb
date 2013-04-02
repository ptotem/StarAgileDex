class AddAttachmentTitlepicToSlides < ActiveRecord::Migration
  def self.up
    change_table :slides do |t|
      t.attachment :titlepic
    end
  end

  def self.down
    drop_attached_file :slides, :titlepic
  end
end
