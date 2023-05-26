const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
app.use(express.static("public"));
var nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});
const { ExpressPeerServer } = require("peer")
const peerserver = ExpressPeerServer(server, { debug: true })
app.use("/peerjs", peerserver)
app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});
const transporter = nodemailer.createTransport({
    port: 587,
    host: "smtp.gmail.com",
    auth: {
        user: 'tanusrips15@gmail.com',
        pass: "ydjufjdfxaiwibqg"
    },
    secure: true
})
app.post("/send-mail", (req, res) => {
    const to = req.body.to
    const url = req.body.url
    const maildata = {
        from: "tanusrips15@gmail.com",
        to: to,
        subject: "Join The Video Chat With Me",
        html: `<p>Hey there,</p><p>Come and join me for a video chat here - ${url}</p>`
    }
    transporter.sendMail(maildata, (error, info) => {
        if (error) {
            return console.log(error)
        }
        res.status(200).send({
            message: "invitationsent",
            messageid: info.messageId
        })
    })
})
io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId)
        io.to(roomId).emit("user-connected", userId)
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    })

});

server.listen(process.env.PORT || 3030);