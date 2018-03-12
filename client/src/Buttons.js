import React, { Component } from 'react'
import WebsocketInput from './WebsocketInput'

export default class Buttons extends Component {

  constructor(props) {
    super(props);
    this.connectAndStartSimulation = this.connectAndStartSimulation.bind(this)
    this.startSimulation = this.startSimulation.bind(this)
  }

  startSimulation() {
    this.props.animator.startSimulation()
    this.websocketInput.sendMessage("start_simulation")
  }

  connectAndStartSimulation() {
    if (this.websocketInput != null) {
      this.websocketInput.close()
    }
    this.websocketInput = new WebsocketInput(this.props.animator.q(), this.startSimulation)
  }

  render() {
    return (
      <div className='overlay'>
        <button onClick={this.connectAndStartSimulation}>
          Start Simulation
        </button>
      </div>
    )
  }
}
