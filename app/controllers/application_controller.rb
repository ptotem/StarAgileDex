class ApplicationController < ActionController::Base
  protect_from_forgery
  #before_filter :authenticate_user!
  skip_before_filter :verify_authenticity_token
  before_filter :set_cache_buster

  def after_sign_in_path_for(resource)
    redirect_to console_path
  end

  #def sign_in_and_redirect(resource_or_scope,resource)
  #  if resource_or_scope == :user
  #    redirect_to town_path
  #  else
  #    super
  #  end
  #end

  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end
end
