import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function PatientMap({ patients }) {
  const center = [48.8566, 2.3522]; // Default center (Paris)

  return (
    <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {patients
  .filter((patient) => Number.isFinite(patient.x) && Number.isFinite(patient.y))
  .map((patient) => (
    <Marker
      key={patient.id}
      position={[Number(patient.x), Number(patient.y)]}
    >
      <Popup>
        <b>{patient.name}</b> <br />
        Zone: {patient.zone}
      </Popup>
    </Marker>
))}

    </MapContainer>
  );
}

export default PatientMap;
