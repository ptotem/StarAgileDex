class ChangeDataTypeForContentBlocksCaption < ActiveRecord::Migration

  def up
    change_column :content_blocks, :caption, :text
  end

  def down
    # This might cause trouble if you have strings longer
    # than 255 characters.
    change_column :content_blocks, :caption, :string
  end

end
