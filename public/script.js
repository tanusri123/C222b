const socket = io("/");
const myvideo = document.createElement("video")
myvideo.muted = true
let mystreem;
navigator.mediaDevices.getUserMedia({audio:true,video:true}).then(stream=>{mystreem=stream;
addvideostream(myvideo,stream)
socket.on("user-connected",userId=>{
    connecttonewuser(userId,stream)
})
peer.on("call",call=>{
    call.answer(stream);
    const video = document.createElement("video")
    call.on("stream",uservideostream=>{
        addvideostream(video,uservideostream)
    })
})
})
function addvideostream(video,stream){
    video.srcObject= stream
    video.addEventListener("loadedmetadata",()=>{
        video.play()
        $("#video_grid").append(video)
    })
}
function connecttonewuser(userId,stream){
    const call=peer.call(userId,stream)
    const video = document.createElement("video")
    call.on("stream",uservideostream=>{
        addvideostream(video,uservideostream)
    })
}
var peer = new Peer(undefined,{path:"/peerjs",host:"/",port:"443"});
const user = prompt("Enter your name");

$(function () {
    $("#show_chat").click(function () {
        $(".left-window").css("display", "none")
        $(".right-window").css("display", "block")
        $(".header_back").css("display", "block")
    })
    $(".header_back").click(function () {
        $(".left-window").css("display", "block")
        $(".right-window").css("display", "none")
        $(".header_back").css("display", "none")
    })

    $("#send").click(function () {
        if ($("#chat_message").val().length !== 0) {
            socket.emit("message", $("#chat_message").val());
            $("#chat_message").val("");
        }
    })

    $("#chat_message").keydown(function (e) {
        if (e.key == "Enter" && $("#chat_message").val().length !== 0) {
            socket.emit("message", $("#chat_message").val());
            $("#chat_message").val("");
        }
    })
$("#mute_button").click(function(){
    const enabled = mystreem.getAudioTracks()[0].enabled
    if(enabled){
        mystreem.getAudioTracks()[0].enabled=false
        html = `<i class="fas fa-microphone-slash"></i>`
        $("#mute_button").toggleClass("background_red")
        $("#mute_button").html(html)
    }
    else{
        mystreem.getAudioTracks()[0].enabled=true
        html = `<i class="fa fa-microphone"></i>`
        $("#mute_button").toggleClass("background_red")
        $("#mute_button").html(html)
    }
})
$("#stop_video").click(function(){
    const enabled = mystreem.getVideoTracks()[0].enabled
    if(enabled){
        mystreem.getVideoTracks()[0].enabled=false
        html = `<i class="fas fa-video-slash"></i>`
        $("#stop_video").toggleClass("background_red")
        $("#stop_video").html(html)
    }
    else{
        mystreem.getVideoTracks()[0].enabled=true
        html = `<i class="fas fa-video"></i>`
        $("#stop_video").toggleClass("background_red")
        $("#stop_video").html(html)
    }
})
$("#invite_button").click(function(){
    const to = prompt("Enter The Email Address")
    let data = {
        url:window.location.href,
        to:to,
    }
    $.ajax({
        url:"/send-mail",
        type:"post",
        data:JSON.stringify(data),
        dataType:"json",
        contentType:'application/json',
        success:function(result){
            alert("invite-sent")
        },
        error:function(result){
            console.log(result.responseJSON)
        }
    })
})
})
peer.on("open",(id)=>{
    socket.emit("join-room",ROOMID,id,user)
})

socket.on("createMessage", (message,userName) => {
    $(".messages").append(`
        <div class="message">
        <b><i class="far fa-user-circle"></i>
        <span>${userName===user?"me":userName}</span>
        </b>
            <span>${message}</span>
        </div>
    `)
});