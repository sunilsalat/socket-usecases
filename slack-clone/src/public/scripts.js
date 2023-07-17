const socket = io("http://localhost:8000");
let nameSpaceSockets = {};
let listners = {
  nsChange: {},
  msgToRoom: {},
};

// global variable we can update when user click namespace
let selectedNsId = 0;

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const newMessage = document.querySelector("#user-message").value;
  nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    date: Date.now(),
    avatar: "https://via.placeholder.com/30",
    userName: "Rob",
    selectedNsId,
  });

  document.querySelector("#user-message").value = "";
});

const addListeners = (namespaceId) => {
  if (!listners.nsChange[namespaceId]) {
    nameSpaceSockets[namespaceId].on("nsChange", (data) => {});
    const ns = listners.nsChange;
    ns[namespaceId] = true;
  }

  if (!listners.msgToRoom[namespaceId]) {
    nameSpaceSockets[namespaceId].on("newMessage", (data) => {
      document.querySelector("#messages").innerHTML += buildMessageHtml(data);
    });

    const ns = listners.msgToRoom;
    ns[namespaceId] = true;
  }
};

socket.on("connect", () => {
  console.log("Socket connected!");
  socket.emit("client-connect");
});

socket.on("nsList", (nsData) => {
  console.log(nsData);
  /* 
  
  Note - retreiving namespaces from ther server/db, 
        If we connect dynamically as on line 37-40, evey time we refresh the server new connection/socket will open to the server
        which can reduce performance drastically, 
        Also do not load listeners in on('connect')/on('nsList'), as listners will duplicate on server refresh
        solution -- cache everything as in nameSpaceSockets && listeners
  
  */
  const lastNs = localStorage.getItem("lastNs");
  const nameSapcesDiv = document.querySelector(".namespaces");
  nameSapcesDiv.innerHTML = "";

  nsData.forEach((ns) => {
    nameSapcesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

    if (!nameSpaceSockets[ns.id]) {
      nameSpaceSockets[ns.id] = io(`http://localhost:8000${ns.endpoint}`);
    }
    addListeners(ns.id);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        // joins ns is to update dom with namespaces
        joinNs(element, nsData);
      });
    }
  );

  //if lastNs is set, grab that element instead of 0.
  joinNs(document.getElementsByClassName("namespace")[0], nsData);
});
