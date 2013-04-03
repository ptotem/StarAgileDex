AgileDex::Application.routes.draw do

  # Authentication Routes
  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'
  devise_for :users
  match '/users/auth/:provider/callback' => 'authentications#create'
  match 'get_slides'=>'home#get_slides',:as=>'get_slides'
  match 'del_slide'=>'home#del_slide',:as=>'del_slide'
  match 'create_guest_user'=>'home#create_guest_user',:as=>'create_guest_user'
  match 'slides/new/:presentation_id'=>'slides#new',:as=>'new_slide'

  # Page Routes
  match '/console', :to=>"home#console", :as=>"console"
  match '/home', :to=>"home#index", :as=>"home"

  # Slide Surfer Route
  match '/slides/:id/:plugin/:font/:background', :to=>"slides#builder", :as=>"builder"
  match '/save_slide', :to=>"slides#save_slide", :as=>"save_slide"

  # CRUD Routes
  resources :authentications
  resources :slides
  resources :presentations

  # Root Route
  root :to => 'home#index'


end
