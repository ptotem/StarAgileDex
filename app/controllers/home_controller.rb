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
    #todo:Set the width of the headers.
    #todo:Guest logout delete
    #todo:Counter on how many user logged in.(Analytics)
    if user_signed_in?
      @presentations = Presentation.order('created_at DESC').find_all_by_user_id(current_user.id)
    end
    @slide=Slide.new
    render :layout => false
  end

  def get_slides
    @presentation = Presentation.find(params[:this_presentation_id][0])
    @slides = @presentation.slides
    @returning_data =Array.new
    @slides.each do |i|
      @returning_data<<"#{i.id}|#{i.title.titlecase}"
    end
    render :text => @returning_data
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

  def create_new_presentation
    @presentation = Presentation.new
    @presentation.name=params[:presentation_name][0]
    if !user_signed_in?
      @user=User.create!(:email => "guest_#{Time.now.to_i}#{rand(99)}@agileDex.com", :role => "guest", :name => "guest_#{Time.now.to_i}#{rand(99)}")
      sign_in(:user, @user)
    end
    @presentation.user_id=current_user.id
    if @presentation.save
      if @presentation.user.email.include?("guest")
        render :text => "#{@presentation.id}|guest"
      else
        render :text=> "#{@presentation.id}|normal"
      end
    else
      render :text => "error in creating presentation"
    end
  end

  def delete_presentation
    @presentation = Presentation.find(params[:this_presentation_id][0])
    @presentation.destroy
    render :text => "Presentation Deleted"
  end

end
