class ContentBlock < ActiveRecord::Base

  attr_accessible :caption, :image, :slide_id

  belongs_to :slide
  has_attached_file :image, :path=> :get_path

  attr_accessor :delete_image
  attr_accessible :delete_image

  # These constants are used for specifying quality of PPT import
  QUALITY = 30
  DENSITY = '80x80'

  def get_path
    if self.slide.presentation.user.role=="guest"
      "#{Rails.root}/public/guestdata/"+self.slide.presentation.user_id.to_s+"/"+self.slide.presentation.id.to_s+"/"+self.slide.id.to_s+"/content_blocks/:filename"
    else
      "#{Rails.root}/public/userdata/"+self.slide.presentation.user.name.downcase.gsub(" ", "_")+"/"+self.slide.presentation.name.downcase.gsub(" ", "_")+"/"+self.slide.id.to_s+"/content_blocks/:filename"
    end
  end

end
