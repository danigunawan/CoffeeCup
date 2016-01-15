# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
User.create([{name: "Jerry", email: "jerry@example.com", password: "password", password_confirmation: "password"}])
Doorkeeper::Application.create(name: "CoffeeCup", uid: "COFFEE_CUP_UID", secret: "COFFEE_CUP_SECRET", redirect_uri: "urn:ietf:wg:oauth:2.0:oob", scopes: "auth")
