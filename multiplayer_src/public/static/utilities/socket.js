const socket = io();

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

function hookEventHandler(event, callback) {
    socket.on(event, callback);
}