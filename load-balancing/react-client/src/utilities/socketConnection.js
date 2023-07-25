import io from "socket.io-client";

const options = {
  auth: {
    token: "jower34jewrewr",
    withCredentials: true,
  },
};
const socket = io.connect("http://localhost:8000", options);

socket.on("welcome", (data) => {
  console.log(data);
});

export default socket;
