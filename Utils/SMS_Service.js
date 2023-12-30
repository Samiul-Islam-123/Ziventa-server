const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS = async (phoneNo) => {
  const phoneNumber = `+91${phoneNo}`;  
  const messageBody = 'Hellow there, this SMS is just for testing';  

  try {
    const message = await client.messages.create({
      body: messageBody,
      from: '+14158775703',  // Replace with your Twilio phone number
      to: phoneNumber
    });

    console.log(`SMS sent. SID: ${message.sid}`);
  } catch (error) {
    console.error(`Error sending SMS: ${error.message}`);
  }
};

// Call the function
 sendSMS(7439783808);
