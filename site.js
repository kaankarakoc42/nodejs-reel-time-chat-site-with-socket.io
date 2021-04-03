const http = require("http")
const express = require("express");
const { dirname } = require("path");

const cors = require('cors');
const app = express();
const port=5000

const server = http.createServer(app);
const io = require("socket.io")(server)

const session = require("express-session")({
    secret:"anahtar",
    resave:false,
    saveUninitialized:false
})

const sharedsession = require("express-socket.io-session")
app.use(session)
io.use(sharedsession(session),{
    autoSave:true
})

const bodyParser = require("body-parser");
const { Socket } = require("socket.io");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.use("/bootstrap",express.static(__dirname+"/node_modules/bootstrap/dist/css"))
app.use("/jquery",express.static(__dirname+"/node_modules/jquery/dist"))
app.use("/socket.io",express.static(__dirname+"/node_modules/socket.io/client-dist"))


app.get("/",function(req,res){
        res.sendFile("./login.html",{root:__dirname})

})

app.post("/chat",function(req,res){
        if(req.body.username){
        req.session.username=req.body.username
        res.sendFile("./chat.html",{root:__dirname})    
        }
        else{
            res.sendFile("./login.html",{root:__dirname})  
        }
})


//socket.io

io.on("connection",function(socket){
    var username=socket.handshake.session.username
    console.log(`${username} kullanıcısı bağlandı.`)
    socket.on("mesaj",function(msg){
         io.emit("mesaj",username,msg)
    })
    socket.on("disconnect",function(){
        console.log("kullanıcı ayrıldı.")
    })  
})

server.listen(port,console.log(`server started at http://127.0.0.1:${port}`))