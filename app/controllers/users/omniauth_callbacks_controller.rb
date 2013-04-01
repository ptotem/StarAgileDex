class Users::OmniauthCallbacksController< Devise::OmniauthCallbacksController
  def passthru
    render :text=>'Authenticated'
    return
  end
end