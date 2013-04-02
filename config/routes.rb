AgileDex::Application.routes.draw do

  # Authentication Routes
  mount RailsAdmin::Engine => '/admin', :as => 'rails_admin'
  devise_for :users
  match '/users/auth/:provider/callback' => 'authentications#create'
  match 'create_guest_user'=>'home#create_guest_user',:as=>'create_guest_user'

  # Page Routes
  match '/console', :to=>"home#console", :as=>"console"
  match '/home', :to=>"home#index", :as=>"home"

  # Slide Surfer Route
  match '/slides/:id/:plugin/:font/:background', :to=>"slides#builder", :as=>"builder"

  # CRUD Routes
  resources :authentications
  resources :slides

  # Root Route
  root :to => 'home#index'

end
