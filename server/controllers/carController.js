const Car = require('../models/CarSchema');
const path = require('path');

// @desc  Get all cars
// @route GET /api/cars
const getCars = async (req, res) => {
  try {
    const { search, type, sort } = req.query;
    let query = {};
    if (search) query.carname = { $regex: search, $options: 'i' };
    if (type) query.cartype = { $regex: type, $options: 'i' };

    let cars = await Car.find(query);

    if (sort === 'asc') cars = cars.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    if (sort === 'desc') cars = cars.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get car by ID
// @route GET /api/cars/:id
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Add car
// @route POST /api/cars
const addCar = async (req, res) => {
  try {
    const { drivername, carname, cartype, price, carno } = req.body;
    if (!drivername || !carname || !cartype || !price || !carno)
      return res.status(400).json({ message: 'All fields are required' });

    const carImage = req.file ? `/uploads/${req.file.filename}` : '';
    const car = await Car.create({ drivername, carname, cartype, price, carno, carImage });
    res.status(201).json(car);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Car number already exists' });
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update car
// @route PUT /api/cars/:id
const updateCar = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.carImage = `/uploads/${req.file.filename}`;
    const car = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete car
// @route DELETE /api/cars/:id
const deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCars, getCarById, addCar, updateCar, deleteCar };
