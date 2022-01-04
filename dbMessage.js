import mongoose from 'mongoose'

const whatsappShema=mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean
})

export default mongoose.model('messageContent',whatsappShema)