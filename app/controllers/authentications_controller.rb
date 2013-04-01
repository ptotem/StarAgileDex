class AuthenticationsController < ApplicationController


  #Callback function of omniauth redirect back to this function
  def create
    auth=request.env["omniauth.auth"]
    #Checking if request comes from facebook or twitter
    if auth.provider=='facebook'
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

    sign_in(:user, @user)

    redirect_to console_path

  end

end
