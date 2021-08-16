const mongoose =require('mongoose')

mongoose.connect('mongodb+srv://******username***:*****password***@*****.dgqpo.mongodb.net/***database***?retryWrites=true&w=majority',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("connection done")
}).catch((e)=>{
    console.log("something error")
})
