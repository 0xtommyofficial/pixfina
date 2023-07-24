# Pixfina
Django REST API with a React front end for showcasing photography and video stock for licencing, as well as user registration, and commissioning of work.

## Advisory Notice
This project is currently in development.\
As such only the React project files are contained and the React build is not.\
This will be updated once the project is complete.\
Within the Django backend settings.py and main/urls.py you will find\
commented settings for serving the React frontend from the same server as the API.\
This is not recommended for medium to large scale production use.\
However, it is a convenient way to serve the frontend for small scale production use. 

## Features

- Custom backend and User model where the email is the username
- User registration and authentication
- Showcasing photography and video stock
- Licensing of stock content
- Commissioning of work
- Send Grid email integration
- PostgreSQL database

## Development Roadmap

- [x] User registration and authentication
- [x] Booking Forms
- [x] Email integration
- [x] Stock Media API
- [x] Style General Front End
- [x] Style Forms
- [x] Style Media Galleries
- [x] Style User Settings Page
### Future Features
- [ ] Add Stripe and PayPal payment integration
- [ ] Add shopping cart for stock media licences
- [ ] Integrate with AWS S3 for media storage
- [ ] Add Stripe Connect integration for commissioning work
- [ ] Create a Retouching model (price, quantity, deadline, etc.)
- [ ] Integrate retouching with user accounts
- [ ] Add shopping cart for retouching services

## Requirements

- Python 3.11.2
- Django 4.2.1
- Node 18.5.0
- React 18.2.0

## Setup and run
Note: requirements.txt may change as the project is developed.\
To install backend dependencies using pipenv, run the following command from the root directory:

```pipenv install```

To install frontend dependencies using npm, run the following command from the frontend directory:

```npm install```

From the root directory, run the following commands:

```python manage.py runserver```

```cd frontend```

```npm start```
