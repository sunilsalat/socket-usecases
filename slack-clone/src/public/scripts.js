const socket = io("http://localhost:8000");

socket.on("connect", () => {
  console.log("Socket connected!");
  socket.emit("client-connect");
});

socket.on("welcome", (data) => {
  console.log(data);
});

socket.on("nsList", (nsData) => {
  const lastNs = localStorage.getItem("lastNs");
  console.log(nsData);
  const nameSapcesDiv = document.querySelector(".namespaces");
  nameSapcesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    //update the HTML with each ns
    nameSapcesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;

    //initialize thisNs as its index in nameSpaceSockets.
    //If the connection is new, this will be null
    //If the connection has already been established, it will reconnect and remain in its spot
    // let thisNs = nameSpaceSockets[ns.id];

    // if (!nameSpaceSockets[ns.id]) {
    //   //There is no socket at this nsId. So make a new connection!
    //   //join this namespace with io()
    //   nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    // }
    // addListeners(ns.id);
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
