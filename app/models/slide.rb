class Slide < ActiveRecord::Base
  attr_accessible :presentation_id, :sequence, :subtitle, :title, :layout, :font, :background, :content_blocks_attributes, :titlepic, :presentation, :main, :ppt, :mode, :nosub
  belongs_to :presentation

  has_many :content_blocks, :dependent => :destroy
  accepts_nested_attributes_for :content_blocks, :reject_if => proc { |attrs| reject = %w(caption image).all? { |a| attrs[a].blank? } }, :allow_destroy => true

  has_attached_file :titlepic, :path => :get_path, :url => :get_url

  # This is the code for importing of a PPT
  # ------------------------------------------------------------------------------------------

  # Uses two post processors : docsplit_pdf for PPT to PDF (from the docsplit-paperclip-processor gem) and pdf_imager for PDF to Images (in lib)
  has_attached_file :ppt, :path => :get_path,
                    :styles => {
                        :pdf => {
                            :format => "pdf",
                            :processors => [:docsplit_pdf, :pdf_imager]
                        }
                    }

  # Define the temporary directory root used by the Paperclip processor for the process
  TEMPATH="#{Rails.root}/public/papertemp"

  # Before you start processing the ppt, create a presentation specific directory in the temporary root
  # and remove the content blocks that were there earlier
  before_ppt_post_process :create_papertemp

  def create_papertemp
    require 'find'
    require 'fileutils'
    require 'pathname'
    system "mkdir #{Rails.root}/public/papertemp/#{presentation_id}"
    content_blocks.each do |block|
      block.destroy
    end
  end

  # The Processors process the PPT and dump the results in the temporary directory
  # This method takes the dump and assigns them to content_blocks
  # After that is done, it deletes the temporary directory as garbage cleanup

  after_save :make_content_blocks

  def make_content_blocks
    require 'find'
    require 'fileutils'
    require 'pathname'
    images = Dir["#{Rails.root}/public/papertemp/#{self.presentation_id}/*.jpg"].sort_by do |line|
      line.match(/(\d+)\.jpg$/)[1].to_i
    end
    images.each do |page_image|
      ContentBlock.create!(:slide_id => id, :image => File.open(page_image))
    end
    system "rm -rf #{Rails.root}/public/papertemp/#{self.presentation_id}"
  end

  # -------------------------------------------------------------------------------------------------------

  before_create :set_sequence
  after_create :build_directory

  # TODO: Test the directory creation paths
  def get_path
    if self.presentation.user.role=="guest"
      "#{Rails.root}/public/guestdata/"+self.presentation.user_id.to_s+"/"+self.presentation.id.to_s+"/images/:filename"
    else
      "#{Rails.root}/public/userdata/"+self.presentation.user.name.downcase.gsub(" ", "_")+"/"+self.presentation.name.downcase.gsub(" ", "_")+"/images/:filename"
    end
  end

  def get_url
    if self.presentation.user.role=="guest"
      "/guestdata/"+self.presentation.user_id.to_s+"/"+self.presentation.id.to_s+"/images/:filename"
    else
      "/userdata/"+self.presentation.user.name.downcase.gsub(" ", "_")+"/"+self.presentation.name.downcase.gsub(" ", "_")+"/images/:filename"
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
      system "mkdir #{Rails.root}/public/guestdata/"+self.presentation.user_id.to_s+"/"+self.presentation.id.to_s+"/"+self.id.to_s
    else
      system "mkdir #{Rails.root}/public/userdata/"+(self.presentation.user.name.downcase.gsub(" ", "_")).to_s+"/"+(self.presentation.name.downcase.gsub(" ", "_")).to_s+"/"+self.id.to_s
    end
  end

  def remove_redundancy
    case self.mode
      when "HTML"
        self.content_blocks.each do |cb|
          cb.destroy
        end
        self.ppt.destroy
      when "Blocks"
        self.main=""
        self.ppt.destroy
      when "PPT"
        self.main=""
        self.content_blocks.each do |cb|
          cb.destroy
        end
    end
    if self.nosub == false
      self.subtitle=self.subtitle
      self.titlepic.destroy
    else
      self.subtitle=""
      self.titlepic=self.titlepic
    end

    #if self.nosub == false
    #  self.subtitle=""
    #  self.titlepic=self.titlepic
    #else
    #  self.subtitle=self.subtitle
    #  self.titlepic.destroy
    #end

    self.save
  end
end
