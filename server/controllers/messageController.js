import messageModel from "../Models/messageModel.js"

export const addMessage = async(req, res) => {
    const {chatId, senderId, text} = req.body;
    const messages = new messageModel({
        chatId,
        senderId,
        text
    });
    try {
        const messageResult = await messages.save()
        res.status(200).json(messageResult);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const getMessage = async(req, res)=> {
    const {chatId} = req.params
    
    try {
        const getmessageResult = await messageModel.find({chatId})
        res.status(200).json(getmessageResult);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}