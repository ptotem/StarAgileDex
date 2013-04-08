module Paperclip
  class PdfImager < Processor

    attr_accessor :current_geometry, :target_geometry, :format, :whiny, :convert_options, :source_file_options

    def initialize file, options = {}, attachment = nil
      super
      @file = file
      @format = options[:format]
      @presentation=@attachment.instance.presentation_id

      @current_format = File.extname(@file.path)
      @basename = File.basename(@file.path, @current_format)
    end

    def make
      src = @file
      dst = Tempfile.new([@basename, @format ? ".#{@format}" : ''])
      dst.binmode

      begin

      Paperclip.run('convert', "-quality #{ContentBlock::QUALITY} -density #{ContentBlock::DENSITY} #{File.expand_path(src.path)} #{Slide::TEMPATH}/#{@presentation}/#{@basename}%d.jpg")

      rescue PaperclipCommandLineError => e
        raise PaperclipError, "There was an error processing the thumbnail for #{@basename}" if @whiny
      end
      dst
    end
  end
end