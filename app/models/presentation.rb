class Presentation < ActiveRecord::Base
  attr_accessible :name, :user_id
  belongs_to :user
  has_many :slides, :dependent => :destroy

  validates_presence_of :name

  after_create :build_directory

  def build_directory
    require 'find'
    require 'fileutils'
    require 'pathname'
    if self.user.role=="guest"
      system "mkdir #{Rails.root}/public/guestdata/"+user_id.to_s+"/"+name
    else
      system "mkdir #{Rails.root}/public/userdata/"+self.user.name.downcase.gsub(" ", "_")+"/"+name
    end
  end

end
