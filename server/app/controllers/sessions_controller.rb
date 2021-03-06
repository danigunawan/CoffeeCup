class SessionsController < ApplicationController
  # before_action -> { doorkeeper_authorize! :auth }, only: :oauth_create

  def new
  end

  def create
    user = User.find_by_email(params[:email])
    # If the user exists AND the password entered is correct.
    if user && user.authenticate(params[:password])
      # Save the user id inside the browser cookie. This is how we keep the user
      # logged in when they navigate around our website.
      session[:user_id] = user.id
      redirect_to(session[:return_to] || root_path)
    else
    # If user's login doesn't work, send them back to the login form.
      redirect_to login_url
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to login_url
  end

  def oauth_create
    session[:user_id] = doorkeeper_token.resource_owner_id
    redirect_to(params[:return_to] || root_path)
  end
end
