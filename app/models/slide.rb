class Slide < ActiveRecord::Base
  attr_accessible :presentation_id, :sequence, :subtitle, :title
  belongs_to :presentation

  before_create :set_sequence
  after_create :build_directory

  def set_sequence
    sequence=self.presentation.slides.count+1
  end

  def build_directory
    require 'find'
    require 'fileutils'
    require 'pathname'
    include FileUtils
    if self.user.role=="guest"
      system "mkdir #{Rails.root}/public/guestdata/"+self.presentation.user_id+"/"+self.presentation.name+"/"+id
    else
      system "mkdir #{Rails.root}/public/userdata/"+self.presentation.user.name.downcase.gsub(" ", "_")+"/"+self.presentation.name+"/"+id
    end
  end

end
