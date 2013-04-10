class AuthenticationsController < ApplicationController

  # Create an Authentications model which belongs to User
  # Add provider:string and uid:string to both User and Authentications.
  # Ensure that associations and attr_accessible are correctly mapped in the Models
  # Add the Omniauth.rb initializer
  # Add /user/auth/:provider/callback to the routes
  # /user/auth/:provider is handled by the Oauth gem

  # Callback function of omniauth redirects back to this function.
  # This creates a user if none exists or signs in a user if he exists

  def create
    require 'find'
    require 'fileutils'
    require 'pathname'
    auth=request.env["omniauth.auth"]
    if auth.provider=='facebook' # Checking if request comes from facebook or twitter
      if User.find_by_email(auth.info.email).nil?
        @user = User.create!(:provider => auth.provider, :email => auth.info.email, :uid => auth.uid, :password => Devise.friendly_token[0, 20], :name => "#{auth.info.first_name} #{auth.info.last_name}")
      else
        @user=User.find_by_email(auth.info.email)
      end
    else
      if User.find_by_uid(auth['uid']).nil?
        @user=User.create!(:provider => auth['provider'], :uid => auth['uid'], :name => auth['info']['name'])
      else
        @user=User.find_by_uid(auth['uid'])
      end
    end

    if user_signed_in?
      current_user.presentations.each do |presentation|
        presentation.user_id=@user.id
        presentation.save
        FileUtils.cp_r("#{Rails.root}/public/guestdata/"+current_user.id.to_s+"/.", "#{Rails.root}/public/userdata/"+@user.name.downcase.gsub(" ", "_").to_s+"/")
      end
    end

    sign_in(:user, @user)
    redirect_to console_path
  end

end
