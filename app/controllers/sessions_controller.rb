class SessionsController < Devise::SessionsController

  def new
    super
  end

  def create_ebay_users
    #render :json => request.env['omniauth.auth']
    #return

    auth = request.env['omniauth.auth']

    if auth.provider=='ebay' # Checking if request comes from ebay
      if User.where(:email => auth.info.email).first.nil?
        @user = User.create(name: auth.info.full_name, :provider => auth["provider"], :email => auth.info.email, :password => Devise.friendly_token[0, 20], :uid => auth["uid"])
        @user.company = Company.where(:name=>"eBay").first
        #u.save(:validate => false)
        @user.save!
        sign_in(:user, @user)
        redirect_to root_path
      else
        @user=User.where(:email => auth.info.email).first
        sign_in(:user, @user)
        redirect_to root_path
      end
    end
  end

  def create
    #@request.env["devise.mapping"] = Devise.mappings[:user]
    #puts "in sessions_controller :- #{request.env['omniauth.auth']}"

    #render :json => request.env['omniauth.auth']
    #return
    #
    #auth = request.env['omniauth.auth']
    #
    #if auth.provider=='ebay' # Checking if request comes from ebay
    #  if User.where(:email => auth.info.email).first.nil?
    #    @user = User.create(name: auth.info.full_name, :provider => auth["provider"], :email => auth.info.email, :password => Devise.friendly_token[0, 20], :uid => auth["uid"])
    #    #@user.company = "eBay"
    #    #u.save(:validate => false)
    #    @user.save!
    #    sign_in(:user, @user)
    #    redirect_to "/"
    #  else
    #    @user=User.where(:email => auth.info.email).first
    #    sign_in(:user, @user)
    #    redirect_to "/"
    #  end
    #end

    logger.info "Attempt to sign in by #{ params[:user][:email] }"
    super
  end


  def destroy
    user=current_user
    logger.info "#{ current_user.email } signed out"
    redirect_path = "/#{user.company.name}/users/sign_in" rescue after_sign_out_path_for(resource_name)
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message :notice, :signed_out if signed_out && is_navigational_format?

    # We actually need to hardcode this as Rails default responder doesn't
    # support returning empty response on GET request
    respond_to do |format|
      format.all { head :no_content }
      format.any(*navigational_formats) { redirect_to redirect_path }
    end
  end
end
