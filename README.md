# Pixfina
Django REST API with a React front end for showcasing photography and video stock for licencing, as well as user registration, and commissioning of work.

## Features

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
- [ ] Style Media Galleries
- [ ] Style User Settings Page
- [ ] Update forms to be one page with conditional rendering
- [ ] Add content download to user settings page for shoot results
### Future Features
- [ ] Add Stripe and PayPal payment integration
- [ ] Add shopping cart for stock media licences
- [ ] Integrate with AWS S3 for media storage


## Requirements

- Python 3.11.2
- Django 4.2.1
- Node 18.5.0
- React 18.2.0

## Setup and run

To install backend dependencies using pipenv, run the following command from the root directory:

```pipenv install```

To install frontend dependencies using npm, run the following command from the frontend directory:

```npm install```

From the root directory, run the following commands:

```python manage.py runserver```

```cd frontend```

```npm start```
