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
    @presentations = Presentation.find_all_by_user_id(current_user.id)
    render :layout => false
  end

  def get_slides
    @presentation = Presentation.find(params[:this_presentation_id][0])
    @slides = @presentation.slides
    @returning_data =Array.new
    @slides.each do |i|
      @returning_data<<"#{i.id}|#{i.title}"
    end
    render :text=>@returning_data
    return
  end

  def create_guest_user
    @user=User.create!(:email => "guest_#{Time.now.to_i}#{rand(99)}@agileDex.com", :role => "guest", :name => "guest_#{Time.now.to_i}#{rand(99)}")
    sign_in(:user, @user)
    redirect_to console_path
  end

  def del_slide
    @slide = Slide.find(params[:slide_id][0])
    @slide.destroy
    render :text => "Slide deletion successful."
    return
  end

end
