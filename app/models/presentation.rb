class Presentation < ActiveRecord::Base
  attr_accessible :name, :user_id, :slides_attributes
  belongs_to :user
  has_many :slides, :dependent => :destroy
  accepts_nested_attributes_for :slides, :reject_if => proc { |attrs| reject = %w(title).all? { |a| attrs[a].blank? } }, :allow_destroy => true

  validates_presence_of :name

  after_create :build_directory

  def build_directory
    require 'find'
    require 'fileutils'
    require 'pathname'
    if self.user.role=="guest"
      system "mkdir #{Rails.root}/public/guestdata/"+user_id.to_s+"/"+id.to_s
    else
      system "mkdir #{Rails.root}/public/userdata/"+self.user.name.downcase.gsub(" ", "_")+"/"+self.name.downcase.gsub(" ", "_")
    end
  end

end
