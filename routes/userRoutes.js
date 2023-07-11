const express = require('express');
const {loginController, registerController, authController, createPollController, castVoteController, updateUserPollsController, deletePollController} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const pollingModel = require('../models/pollingModel');

//router object
const router = express.Router()

//routes
//LOGIN || POST
router.post('/login', loginController)

//REGISTER || POST
router.post('/register', registerController)

//Auth ||POST
router.post('/getUSerData', authMiddleware, authController);

//create poll
router.post("/create-poll", authMiddleware, createPollController );

// GET all polls
router.get('/getPolls', async(req, res) =>{
    try{
        const Allpolls = await pollingModel.find();
        res.json(Allpolls);
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch Polls' });
    }
})

// Cast Vote || POST
router.post('/castVote', authMiddleware, castVoteController);

// Update User Voted Polls || POST
router.post('/updateUserPolls', authMiddleware, updateUserPollsController);

// Delete a poll
router.delete('/deletePoll/:pollId', deletePollController);


module.exports = router;