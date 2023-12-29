const { default: mongoose } = require("mongoose");

<<<<<<< HEAD
const DataBaseURL = `${process.env.DATABASE}`;
=======
const DataBaseURL = `mongodb+srv://DataBaseOwner:2i3nNEqkocVwXWWP@cluster0.hck9bmq.mongodb.net/?retryWrites=true&w=majority`;
>>>>>>> cf5b0685a21b0c57c3bbc76ac8ce237c7a5bc052

const ConnectToDataBase = async () => {
    console.log('Connecting with DataBase...');
    try {
        await mongoose.connect(DataBaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected successfully');
    }
    catch (error) {
        console.log("Error occured : " + error);
        return error;
    }
}

//exporting this function
module.exports = ConnectToDataBase;