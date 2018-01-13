let instance = null;

class createSocket {
  constructor(socket) {
    this.socket = socket;
  }
  socks() {
    return this.socket;
  }
}

createSocket.open = sock => {
  if (instance !== null) {
    return instance;
  }
  instance = new createSocket(sock);
  return instance;
};
createSocket.instance = () => instance;
module.exports = createSocket;
