const { default: mongoose } = require("mongoose");

const DataBaseURL = `mongodb+srv://DataBaseOwner:2i3nNEqkocVwXWWP@cluster0.hck9bmq.mongodb.net/?retryWrites=true&w=majority`;

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