class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :omniauthable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  attr_accessible :name, :role, :provider, :uid, :display_modal

  has_many :authentications, :dependent => :destroy
  has_many :presentations, :dependent => :destroy
  has_many :feedbacks

  after_create :build_directory

  require 'find'
  require 'fileutils'
  require 'pathname'
  include FileUtils

  def build_directory
    if role=="guest"
      system "mkdir #{Rails.root}/public/guestdata/"
      system "mkdir #{Rails.root}/public/guestdata/"+id.to_s
    else
      system "mkdir #{Rails.root}/public/userdata/"
      system "mkdir #{Rails.root}/public/userdata/"+name.downcase.gsub(" ", "_")
    end
  end

end
