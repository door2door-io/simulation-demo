import Websocket from 'react-websocket'

export default class WebsocketInput {

  constructor(queue, onOpenCallback) {
    this.queue = queue
    this.websocket = new Websocket({
      url: process.env.REACT_APP_WEBSOCKET_ADDRESS,
      onMessage: function(data) {
        queue.offer(JSON.parse(data))
      },
      onOpen: function() {
        onOpenCallback()
      }
    })
    this.websocket.setupWebsocket()
  }

  sendMessage(msg) {
    this.websocket.state.ws.send(msg)
  }

  close() {
    this.websocket.shouldReconnect = false
    this.websocket.state.ws.close()
  }

}
