import React, { Component } from 'react'
import MapboxGl from 'mapbox-gl/dist/mapbox-gl.js'
import PropTypes from 'prop-types';
import Vehicles from './Vehicles';

export default class Map extends Component {

  static childContextTypes = {
    map: PropTypes.object
  }

  state = {
    map: null
  }

  getChildContext = () => ({
    map: this.state.map
  })

  componentDidMount() {
    MapboxGl.accessToken = "pk.eyJ1IjoiYWxscnlkZXIiLCJhIjoidWs5cUFfRSJ9.t8kxvO3nIhCaAl07-4lkNw"

    const map = new MapboxGl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/streets-v9'
    })

    map.jumpTo({ center: [13.29, 52.51], zoom: 3 })

    map.on('load', (...args) => {
      this.setState({ map })
    })
  }

  render() {
    const { children } = this.props
    const { map } = this.state
    return (
      <div>
        <div className='Map' ref={(x) => { this.container = x }}>
          { map && children }
        </div>
        <Vehicles
          map={map}>
        </Vehicles>
      </div>
    )
  }
}
