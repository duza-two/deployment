# Sinuthex - fully function CRUD application
This project is a fully functional CRUD system with user login, authentication, verification and administrative management.
This website is fully online with it database on MongoDB Atlas, Cloudinary for image hosting, with POST and GET functionality and 
Heroku as the hosting sever for the main site.

Problems experience with the project is that the free tier M0 which I am using with MongoDB Atlas does not offer me a VPC Peering Connection
which mean that I am unable to link the database to the website (Heroku server). Because article images adn links are saved on the database
the website is not able to display current article either.
