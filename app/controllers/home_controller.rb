class HomeController < ApplicationController

  def index
    @themelist = ['Blackboard', 'Bluebird', 'Red Velvet']
    @fontarray = ['Century Gothic', 'Canela', 'Verdana', 'Arial']
    @fontadjustment= [0, 0, 0, 0]
    gon.fontarray = @fontarray
    gon.fontadjustment = @fontadjustment
    render :layout => false
  end

  def console
    @presentations=Presentation.find_all_by_user_id(current_user.id)
    @last_presentation = Presentation.find_all_by_user_id(current_user.id).last
    @slides=@presentations.slides rescue nil

    @slides_bank=Slide.find_all_by_user_id(current_user.id)  rescue nil
    render :layout => false
  end

  def create_guest_user
    @user=User.create!(:email => "guest_#{Time.now.to_i}#{rand(99)}@agileDex.com", :role => "guest", :name => "guest_#{Time.now.to_i}#{rand(99)}")
    sign_in(:user, @user)
    redirect_to console_path
  end

end
