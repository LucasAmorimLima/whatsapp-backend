import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessage.js'
import Pusher from 'pusher'
import cors from 'cors'
const app  = express()
const port  = process.env.PORT || 9000

const url = 'mongodb+srv://adm:uOqy0wjlBvCHtGPi@cluster0.da2f7.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(url,{
    useNewUrlParser : true,
    //useCreateIndex : true,
    useUnifiedTopoLogy : true
})

const pusher = new Pusher({
    appId: "1325908",
    key: "b27d01fb5230f3b665cf",
    secret: "4986e95fa4237e4e871b",
    cluster: "sa1",
    useTLS: true
  });

const db = mongoose.connection

db.once("open", ()=>{
    console.log("db connected")

    const msgCollection = db.collection('messagecontents')
    const changesStream = msgCollection.watch()

    changesStream.on('change',(change)=>{
        console.log(change)

        if (change.operationType === "insert") {
            const messageDetails  = change.fullDocument
            pusher.trigger('messages','inserted',
            {
                name : messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            }
            )
        } else {
            console.log('Error triggering Pusher')
        }
    })
})

app.use(express.json())
app.use(cors())

//app.get('/',(req,res)=>res.status(200).send('wello word'))


app.post('/messages/new',(req,res)=>{
    const dbMessage = req.body

    Messages.create(dbMessage,(err,data)=>{
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/messages/show',(req,res)=>{
    
    Messages.find((err,data)=>{
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})
app.listen(port,()=> console.log(`listening on localhost:${port}`))
