// src/App.jsx
import { useState, useEffect } from 'react'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster'
import './App.css'

import 'leaflet/dist/leaflet.css'


import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function App() {
  const [courses, setCourses] = useState ([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('./golf_courses.json')
    .then(response => response.json())
    .then(data => {
      setCourses(data.courses)
      setLoading(false)
      console.log('Loaded Courses:', data.courses)
    })
    .catch(error => {
      console.error('Error loading Courses:', error)
      setLoading(false)
    })
  }, [])

  //Finland center position on map
  const finlandcenter = [62.24, 25.74]

  if (loading) {
    return (
      <div className="App">
        <h1>Finnish Golf Courses Map</h1>
        <div className="loading">Loading golf courses...</div>
      </div>
    )
  }

  return (
    <div className="App">
      <header>
        <h1>Finnish Golf Courses Map</h1>
        <h4 className='sybtitle'>Explore Golf courses across Finland.</h4>
      </header>

      <div className="controls">
        <div className="course-count">
          {courses.length} golf courses Loaded..
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={finlandcenter}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MarkerClusterGroup>
            {courses.map((course, index) => (
            <Marker
              key={index}
              position={[course.lat, course.lng]}
            >
              <Popup>
                <div className='course-popup'>
                  <h3>{course.course}</h3>
                  <p><strong>Type:</strong> {course.type}</p>
                  <p> 📍 {course.address}</p>
                  <p> 📞 {course.phone}</p>
                  <p> ✉️ {course.email}</p>
                  {course.web && <p><strong>Website:</strong> <a href={course.web} target="_blank" rel="noopener noreferrer">{course.web}</a></p>}
                  <p>{course.text}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          </MarkerClusterGroup>

        </MapContainer>
      </div>
    </div>
  )
}

export default App