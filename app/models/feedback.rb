class Feedback < ActiveRecord::Base
  attr_accessible :comment, :email, :subject,:user_id, :page
  belongs_to :user
  validates :subject, :presence => true
  validates :comment, :presence => true
end
