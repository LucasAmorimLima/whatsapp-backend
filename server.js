import express from 'express'
import mongoose from 'mongoose'
import Messages from './dbMessage.js'
const app  = express()
const port  = process.env.PORT || 9000

const url = 'mongodb+srv://adm:uOqy0wjlBvCHtGPi@cluster0.da2f7.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(url,{
    useNewUrlParser : true,
    //useCreateIndex : true,
    useUnifiedTopoLogy : true
})

app.use(express.json())


app.get('/',(req,res)=>res.status(200).send('wello word'))


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
