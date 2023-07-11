const mongoose = require('mongoose');

// const connectDB =()=>{
//         mongoose.set('strictQuery',true);
//         mongoose.connect('mongodb://localhost:27017/OnlineVoting');
//         var db=mongoose.connection;
//         db.on('error',()=>{console.log("Error Occured while connecting to database")});
//         db.once('open',()=>{console.log(`connected to database ${mongoose.connection.host}`)})
//     }


const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Mongodb connected ${mongoose.connection.host}`);
    }
    catch(error){
        console.log(`Mongodb Server Issue ${error}`);
    }
};

module.exports = connectDB;