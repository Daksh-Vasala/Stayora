const Message = require("../models/messageModel");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {

    const message = await Message.create({
      ...req.body,
      sender: req.user.id
    });

    res.status(201).json({
      success: true,
      data: message
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// GET MESSAGES
exports.getMessages = async (req, res) => {
  try {

    const messages = await Message.find()
      .populate("sender")
      .populate("receiver");

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// DELETE MESSAGE
exports.deleteMessage = async (req, res) => {
  try {

    await Message.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Message deleted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};