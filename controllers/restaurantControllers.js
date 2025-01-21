import { Restaurant } from '../models/restaurantModel.js';

// Create a restaurant (Admin only)
export const createRestaurant = async (req, res) => {
  const { name, description, address, contactInfo, cuisineType, openingHours, imageUrl, isFeatured } = req.body;

  try {
    const newRestaurant = new Restaurant({
      name,
      description,
      address,
      contactInfo,
      cuisineType,
      openingHours,
      imageUrl,
      isFeatured
    });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', error });
  }
};

// Get all restaurants
export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('menu'); // Populating menu if necessary
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
};

// Get a single restaurant by ID
export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('menu');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error });
  }
};

// Update a restaurant (Admin only)
export const updateRestaurant = async (req, res) => {
  const { name, description, address, contactInfo, cuisineType, openingHours, imageUrl, isFeatured } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.address = address || restaurant.address;
    restaurant.contactInfo = contactInfo || restaurant.contactInfo;
    restaurant.cuisineType = cuisineType || restaurant.cuisineType;
    restaurant.openingHours = openingHours || restaurant.openingHours;
    restaurant.imageUrl = imageUrl || restaurant.imageUrl;
    restaurant.isFeatured = isFeatured !== undefined ? isFeatured : restaurant.isFeatured;

    await restaurant.save();
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error });
  }
};

// Delete a restaurant (Admin only)
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error });
  }
};
