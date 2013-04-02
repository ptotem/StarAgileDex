class ContentBlock < ActiveRecord::Base
  attr_accessible :caption, :image, :slide_id
  belongs_to :slide
  has_attached_file :image, :path=> :get_path

  def get_path
    if self.slide.presentation.user.role=="guest"
      "#{Rails.root}/public/guestdata/"+self.slide.presentation.user_id.to_s+"/"+self.slide.presentation.name+"/"+self.slide.id+"/images/content_blocks/:filename"
    else
      "#{Rails.root}/public/userdata/"+self.slide.presentation.user.name.downcase.gsub(" ", "_")+"/"+self.slide.presentation.name+"/"+self.slide.id.to_s+"/images/content_blocks/:filename"
    end
  end

end
