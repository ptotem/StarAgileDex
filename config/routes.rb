AgileDex::Application.routes.draw do

  match 'feedbacks' => 'feedbacks#create', :as => :feedback

  match 'feedbacks/new' => 'feedbacks#new', :as => :new_feedback

  mount Ckeditor::Engine => '/ckeditor'

  # Authentication Routes
  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'
  devise_for :users
  match '/users/auth/:provider/callback' => 'authentications#create'
  match 'get_slides'=>'home#get_slides',:as=>'get_slides'
  match 'del_slide'=>'home#del_slide',:as=>'del_slide'
  match 'create_guest_user'=>'home#create_guest_user',:as=>'create_guest_user'
  match 'slides/new/:presentation_id'=>'slides#new',:as=>'new_slide'

  # Page Routes
  match '/console/(:slide_id)', :to=>"home#console", :as=>"console"
  match '/demo', :to=>"home#index", :as=>"demo"

  # Slide Surfer Routes
  match '/slides/:id/:plugin/:font/:background', :to=>"slides#builder", :as=>"builder"
  match '/save_slide', :to=>"slides#save_slide", :as=>"save_slide"
  match '/export/:id',:to=>'presentations#export',:as=>"export"

  # Ajax routes
  match '/presentations/new', :to=>"home#create_new_presentation", :as=>"new_presentation"
  match '/delete_presentation', :to=>"home#delete_presentation", :as=>"delete_presentation"
  match '/slides/new/(:presentation_id)', :to=>"slides#new"
  match '/slides/:id/edit/(:presentation_id)', :to=>"slides#edit"


  # CRUD Routes
  resources :authentications
  resources :slides

  # Root Route
  root :to => 'home#console'


end
