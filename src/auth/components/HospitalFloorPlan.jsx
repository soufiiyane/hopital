import React from "react";

const HospitalFloorPlan = ({ patients }) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "400px", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
      <svg width="100%" height="100%" viewBox="0 0 800 600">
        {/* Hospital Background */}
        <rect x="0" y="0" width="800" height="600" fill="#f0f0f0" />

        {/* Corridors */}
        <rect x="100" y="0" width="50" height="600" fill="#e0e0e0" />
        <rect x="0" y="275" width="800" height="50" fill="#e0e0e0" />

        {/* Rooms */}
        <rect x="0" y="0" width="100" height="275" fill="#d3e5ff" stroke="#3498db" strokeWidth="2" />
        <text x="20" y="140" fontSize="14" fill="#34495e">Room 101</text>

        <rect x="0" y="250" width="800" height="125" fill="#f4f4f4" stroke="#ccc" strokeWidth="1" />
<text x="350" y="300" fontSize="14" fill="#555">Hallway</text>

        <rect x="0" y="325" width="100" height="275" fill="#d3e5ff" stroke="#3498db" strokeWidth="2" />
        <text x="20" y="465" fontSize="14" fill="#34495e">Room 102</text>

        <rect x="150" y="0" width="200" height="275" fill="#ffd3d3" stroke="#e74c3c" strokeWidth="2" />
        <text x="200" y="140" fontSize="14" fill="#34495e">ICU</text>

        <rect x="350" y="0" width="200" height="275" fill="#d3ffd3" stroke="#2ecc71" strokeWidth="2" />
        <text x="400" y="140" fontSize="14" fill="#34495e">Operating Room</text>

        <rect x="550" y="0" width="250" height="275" fill="#fff3d3" stroke="#f39c12" strokeWidth="2" />
        <text x="620" y="140" fontSize="14" fill="#34495e">Emergency</text>

        <rect x="150" y="325" width="200" height="275" fill="#d3d3ff" stroke="#9b59b6" strokeWidth="2" />
        <text x="200" y="465" fontSize="14" fill="#34495e">Lab</text>

        <rect x="350" y="325" width="200" height="275" fill="#ffd3ff" stroke="#8e44ad" strokeWidth="2" />
        <text x="400" y="465" fontSize="14" fill="#34495e">Pharmacy</text>

        <rect x="550" y="325" width="250" height="275" fill="#d3fff3" stroke="#16a085" strokeWidth="2" />
        <text x="620" y="465" fontSize="14" fill="#34495e">Radiology</text>

        {patients.map((patient) => (
  Number.isFinite(patient.x) && Number.isFinite(patient.y) ? (
    <g key={patient.id}>
      <circle
        cx={patient.x}
        cy={patient.y}
        r="10"
        fill="#3498db"
        stroke="#2980b9"
        strokeWidth="2"
      />
      <text
        x={Number(patient.x) + 15}
        y={Number(patient.y) + 5}
        fontSize="12"
        fill="#34495e"
      >
        {patient.name}
      </text>
    </g>
  ) : null
))}

      </svg>
    </div>
  );
};

export default HospitalFloorPlan;

