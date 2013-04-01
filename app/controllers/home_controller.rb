class HomeController < ApplicationController

  def index
    @fontarray = ['Century Gothic', 'Canela', 'Verdana', 'Arial']
    @fontadjustment= [0, 0, 0, 0]
    gon.fontarray = @fontarray
    gon.fontadjustment = @fontadjustment
    render :layout => false
  end

  def console

  end

end
