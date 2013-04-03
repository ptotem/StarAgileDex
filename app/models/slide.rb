class Slide < ActiveRecord::Base
  attr_accessible :presentation_id, :sequence, :subtitle, :title, :layout, :font, :background, :content_blocks_attributes, :titlepic, :presentation
  belongs_to :presentation
  has_many :content_blocks, :dependent => :destroy
  has_attached_file :titlepic, :path => :get_path
  accepts_nested_attributes_for :content_blocks, :reject_if => proc { |attrs| reject = %w(caption image).all? { |a| attrs[a].blank? } }, :allow_destroy => true

  before_create :set_sequence
  after_create :build_directory

  # The User must use either a title or a title pic. Can't use none. Can't use both.
  validate :one_and_only_one
  def one_and_only_one()
    errors.add_to_base("You must provide either a title or a title image") if self.title.blank? && self.titlepic.blank?
    errors.add_to_base("You cannot provide both a title and a title image") if !self.title.blank? && !self.titlepic.blank?
  end

  # TODO: Test the paperclip attachment
  def get_path
    if self.user.role=="guest"
      "#{Rails.root}/public/guestdata/"+self.presentation.user_id+"/"+self.presentation.name+"/"+id+"/images/:filename"
    else
      "#{Rails.root}/public/userdata/"+self.presentation.user.name.downcase.gsub(" ", "_")+"/"+self.presentation.name+"/"+id+"/images/:filename"
    end
  end

  def set_sequence
    sequence=self.presentation.slides.count+1
  end

  def build_directory
    require 'find'
    require 'fileutils'
    require 'pathname'
    #include FileUtils
    if self.presentation.user.role=="guest"
      system "mkdir #{Rails.root}/public/guestdata/"+self.presentation.user_id.to_s+"/"+self.presentation.name+"/"+id.to_s
    else
      system "mkdir #{Rails.root}/public/userdata/"+(self.presentation.user.name.downcase.gsub(" ", "_")).to_s+"/"+(self.presentation.name).to_s+"/"+id.to_s
    end
  end

end
