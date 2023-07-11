const userModel = require("../models/userModels");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pollingModel = require ('../models/pollingModel');

//register callback
const registerController = async(req, res) =>{
    try{
        //check email of user. If already registered then re direct to login else register as new user
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({message: 'User Already Exists', success:false})
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({message: 'Registration successful', success:true});
    }
    catch(error){
        console.log(error);
        res.status(500).send({success:false, message: `Register Controller ${error.message}`,});
    }
};

//lodin callback
const loginController =async (req, res) => {
    try{
        const user = await userModel.findOne({email:req.body.email});
        if(!user)
        {
            //if user is not registered
            return res.status(200).send({message:'User not found', success:false});
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch){
            return res.status(200).send({message: 'Invalid email or password', success:false});
        }
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1d',});
        res.status(200).send({message: 'Login Success!', success: true, token});

    }
    catch(error){
        console.log(error);
        res.status(500).send({message:`Error in login CTRL ${error.message}`});
    }
};

const authController = async(req, res) =>{
    try{
        const user = await userModel.findById({_id: req.body.userId});
        user.password = undefined;
        if(!user)
        {
            return res.status(200).send({
                message: 'user not found',
                success: false,
            });
        }
        else
        {
            res.status(200).send({
                success:true,
                data:user,
            });
        }
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            message: 'auth error',
            success:false,
            error
        });
    }
};

//create poll ctrl
const createPollController = async(req, res) =>{
    try{
        const newPoll = await pollingModel({...req.body});
        await newPoll.save();
        res.status(201).send({
            success: true,
            message: 'Poll created successfully',
        });
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in creating poll',
        });
    }
};


  
  
  
const castVoteController = async (req, res) => {
    try 
    {
      const { pollId, selectedOption } = req.body;
      
      const userId = req.body.userId; // Assuming you have the authenticated user ID
      
  
      // Check if the user has already voted for the poll
      const user = await userModel.findById(userId);
      console.log(user.votedPolls.toString());
      if (user.votedPolls.includes(pollId)) 
      {
        // return res.status(400).json();
        res.status(201).send({
          success: true,
          message: 'User has already voted',
      }
      );
      }
      else
      {
        try {
          const { pollId, selectedOption } = req.body;
          console.log(pollId);
          
          // Find the poll by ID
          const poll = await pollingModel.findById(pollId);
          if (!poll) {
            return res.status(404).json({ error: 'Poll not found' });
          }
      
          // Update the votes for the selected option
          poll.options[selectedOption].votes++;
      
          // Save the updated poll
          await poll.save();
      
          res.status(200).json({ success: 'Vote cast successfully' });
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Failed to cast vote' });
        }
        
        // res.status(200).json({ success: 'Vote cast successfully' });
        
      }
    }
      catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to cast vote' });
      }
  };

const updateUserPollsController = async (req, res) => {
    try {
        const { pollId } = req.body;
               
       const userId = req.body.userId; // Assuming you have the authenticated user ID
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      if (!user.votedPolls.includes(pollId)) {
        user.votedPolls.push(pollId);
        await user.save();
      }
  
      res.status(200).json({ success: 'User voted poll updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update user voted poll' });
    }
  };

  // Delete a poll
const deletePollController = async (req, res) => {
    const  id  = req.params.pollId;
    try {
      const deletedPoll = await pollingModel.findByIdAndDelete(id);
      if (deletedPoll) {
        res.status(200).json({ success: 'Poll deleted successfully' });
      } else {
        res.status(404).json({ error: 'Poll not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete poll' });
    }
  };
  
  
  

module.exports= {loginController, registerController, authController, createPollController, castVoteController, updateUserPollsController, deletePollController}; 