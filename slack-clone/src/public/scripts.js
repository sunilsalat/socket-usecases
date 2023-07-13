const socket = io("http://localhost:8000");
let nameSpaceSockets = {};
let listners = {
  nsChange: {},
};

const addListeners = (endpoint) => {
  if (!listners.nsChange[endpoint]) {
    nameSpaceSockets[endpoint].on("nsChange", (data) => {
      console.log("data>", data);
    });
  }
  const ns = listners.nsChange;
  ns[endpoint] = true;
};

socket.on("connect", () => {
  console.log("Socket connected!");
  socket.emit("client-connect");
});

socket.on("nsList", (nsData) => {
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
    //update the HTML with each ns
    nameSapcesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

    if (!nameSpaceSockets[ns.endpoint]) {
      nameSpaceSockets[ns.endpoint] = io(`http://localhost:8000${ns.endpoint}`);
    }
    addListeners(ns.endpoint);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      element.addEventListener("click", (e) => {
        joinNs(element, nsData);
      });
    }
  );

  //if lastNs is set, grab that element instead of 0.
  joinNs(document.getElementsByClassName("namespace")[0], nsData);
});
