import React, { Component } from 'react'
import Queue from './Queue'
import Buttons from './Buttons'
import Stats from './Stats'

export default class Animator extends Component {

  constructor(props) {
    super(props)
    this.queue = new Queue()
    this.vehicles = this.props.vehicles
  }

  animate() {
    if (!this.queue.isEmpty()) {
      if (this.startTime == null) {
        this.startTime = new Date().getTime()
        this.processNextEvent()
        this.virtualStartTime = this.lastEventTimestamp
      } else {
        const realTimePassed = new Date().getTime() - this.startTime
        const absoluteTime = new Date(this.virtualStartTime.getTime() + realTimePassed * process.env.REACT_APP_SPEED_FACTOR)
        const virtualTimePassed = this.virtualStartTime.getTime() + realTimePassed * process.env.REACT_APP_SPEED_FACTOR 
        this.stats.updateTimes(absoluteTime, realTimePassed)
        if (virtualTimePassed > this.nextEventTimestamp()) {
          this.processNextEvent()
        }
      }
    }

    this.vehicles.advance()
    requestAnimationFrame(() => this.animate())
  }

  nextEventTimestamp() {
    const nextEvent = this.queue.peek()
    if (nextEvent != null) {
      return new Date(nextEvent["at"])
    } else {
      return null
    }
  }

  processNextEvent() {
    this.lastEventTimestamp = this.nextEventTimestamp()
    const event = this.queue.poll()
    if (event["event"] === "shift_start") {
      const loc = event["location"]
      this.vehicles.addVehicle(event["id"], event["label"], [loc["lat"], loc["lng"]])
    } else if (event["event"] === "passenger_request") {
      const id = event["vehicle_id"]
      this.vehicles.addRouteToVehicle(id, event["route"])
      for (let taskId in event["tasks"]) {
        const task = event["tasks"][taskId]
        this.vehicles.addTaskToVehicle(id, task["type"], task["booking_id"], 
          [task["location"]["lat"], task["location"]["lng"]])
      }
    } else if (event["event"] === "task") {
      this.vehicles.removeTask(event["vehicle_id"], event["type"], event["booking_id"])
    }
  }

  startSimulation() {
    this.queue.clear()
    this.vehicles.clearAll()
    this.startTime = null
    this.stats.resetState()
    this.animate(this.vehicles)
  }

  q() {
    return this.queue
  }

  render() {
    return (
      <div>
        <Buttons animator={this} />
        <Stats 
          ref={(Stats) => {this.stats = Stats}}
        />
      </div>
    )
  }
}
