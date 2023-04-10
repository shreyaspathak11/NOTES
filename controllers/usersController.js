const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler'); 
const bcrypt = require('bcrypt');

// @desc    Get all users
// @route   GET /users    
// @access  Private/
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();       //exclude password and convert to plain object
    if(!users) {
        return res.status(404).json({message: 'No users found'});
    }
    res.json(users);
});



// @desc    Create new user
// @route   POST /users
// @access  PRIVATE
const createNewUser = asyncHandler(async (req, res) => {
    const {name, password, roles} = req.body;

    /*Confirm data*/
    if(!name || !password || !Array.isArray(roles) || roles.length === 0) {
        return res.status(400).json({message: 'All fields are required'});
    }

    //Check if user already exists(duplicate)
    const duplicate = await User.findOne({ username }).lean().exec();   //convert to plain object and execute

    if(duplicate) {
        return res.status(400).json({message: 'User already exists'});
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10); //salt rounds

    const userObject = {username, password: hashedPassword, roles}; 

    //Create and store new user
    const user = await User.create(userObject);

    if (user){ //created
        res.status(201).json({message: 'User ${username} created successfully'});
    }else{ //not created
        res.status(400).json({message: 'Invalid user data recieved'});      
    }   

});



// @desc    Update a user
// @route   PATCH /users
// @access  PRIVATE
const updateUser = asyncHandler(async (req, res) => {
    const {id, username, password, roles, active} = req.body;

    //Confirm data
    if(!id || !username || !password || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({message: 'All fields are required'});
    }

    const user = await User.findById(id).exec();

    if(!user) {
        return res.status(404).json({message: 'User not found'});
    }   

     //Check for duplicate
     const duplicate = await User.findOne({ username }).lean().exec();   //convert to plain object and execute
     //Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {  //if duplicate exists and duplicate id is not the same as the original user id
        return res.status(409).json({message: 'Username already exists'});
    }

    user.username = username;       //update user
    user.roles = roles;             //update roles
    user.active = active;           //update active

    if (password) {
        user.password = await bcrypt.hash(password, 10);        //update password
    } 

    const updatedUser = await user.save();              //save to db

    res.json({message:'${updatedUser.username} updated successfully'})
}); 

// @desc    Delete a user
// @route   DELETE /users
// @access  PRIVATE
const deleteUser = asyncHandler(async (req, res) => {


});   

module.exports = {
    getAllUsers,    
    createNewUser,
    updateUser,
    deleteUser
};   
