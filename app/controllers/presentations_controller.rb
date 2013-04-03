class PresentationsController < ApplicationController

  def new
    @presentation=Presentation.new
  end

  def create
    @presentation = Presentation.new(params[:presentation])

    respond_to do |format|
      if @presentation.save
        #After presentation create redirect to console page
        format.html { redirect_to "/console", notice: 'Presentation was successfully created.' }
        format.json { render json: @presentation, status: :created, location: @slide }
      else
        format.html { render action: "new" }
        format.json { render json: @presentation.errors, status: :unprocessable_entity }
      end
    end
  end

end
