module Paperclip
  class PdfImager < Processor

    attr_accessor :current_geometry, :target_geometry, :format, :whiny, :convert_options, :source_file_options

    # This class takes the last processed state of the image as the input file
    # In the Paperclip processors listing, the processors are called in order of their inclusion
    # e.g. [:docformat_pdf, :pdf_imager] would mean that the raw PPT file is processed first by docformat into pdf
    # and the resulting pdf file is processed into images by the pdf_imager

    def initialize file, options = {}, attachment = nil
      super
      @file = file
      @format = options[:format]

      # The @presentation is used to create a specific directory for the presentation in the temp directory. If we don't
      # use it, all users will have their images getting created in the same directory and there will be chaos, especially on deletion.

      # We are not using slide_id for the directory creation because when we create new slide, the id is not available at this stage
      # Anyway it doesn't matter because the temporary directory is removed after the entire operation.

      @presentation=@attachment.instance.presentation_id

      @current_format = File.extname(@file.path)
      @basename = File.basename(@file.path, @current_format)
    end

    def make
      src = @file
      dst = Tempfile.new([@basename, @format ? ".#{@format}" : ''])
      dst.binmode

      begin

      # This is a command which takes a PDF file and breaks it into images
      Paperclip.run('convert', "-quality #{ContentBlock::QUALITY} -density #{ContentBlock::DENSITY} #{File.expand_path(src.path)} #{Slide::TEMPATH}/#{@presentation}/#{@basename}%d.jpg")

      rescue PaperclipCommandLineError => e
        raise PaperclipError, "There was an error processing the thumbnail for #{@basename}" if @whiny
      end
      dst
    end
  end
end