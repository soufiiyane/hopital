import React, { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, set, remove, update, get } from "firebase/database";
import { auth, database } from "./utils/firebase";
import AuthPage from "./auth/components/AuthPage";
import HospitalFloorPlan from "./auth/components/HospitalFloorPlan";
import PatientMap from "./auth/components/PatientMap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import { zoneMapping } from "./utils/zoneMapping";

function App() {
  const [user, setUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: "", x: "", y: "", zone: "" });
  const [editPatient, setEditPatient] = useState(null);
  const [error, setError] = useState("");
  const [isSimulationRunning, setIsSimulationRunning] = useState(false); // Track simulation state
  const movementIntervalRef = useRef(null); // Reference for the interval ID

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchPatients();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPatients = () => {
    try {
      const patientsRef = ref(database, "patients");

      const handleValueChange = (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const patientsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setPatients(patientsArray);
        }
      };

      onValue(patientsRef, handleValueChange);
    } catch (error) {
      console.error("Error fetching patients: ", error);
      setError("Failed to fetch patients. Please try again later.");
    }
  };

  const getZoneForCoordinates = (x, y) => {
    for (const [zone, boundaries] of Object.entries(zoneMapping)) {
      const { xMin, xMax, yMin, yMax } = boundaries;
      if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
        return zone;
      }
    }
    return "Unknown";
  };

  const startSimulation = () => {
    movementIntervalRef.current = setInterval(async () => {
      try {
        const patientsRef = ref(database, "patients");
        const snapshot = await get(patientsRef);

        if (snapshot.exists()) {
          const patients = snapshot.val();
          const updates = {};

          Object.keys(patients).forEach((patientId) => {
            const patient = patients[patientId];
            const randomX = Math.floor(Math.random() * 800);
            const randomY = Math.floor(Math.random() * 600);
            const newZone = getZoneForCoordinates(randomX, randomY);

            if (newZone !== patient.zone) {
              toast.error(`⚠️ Movement detected for ${patient.name} in ${newZone}! Please check. 🚑`);
            }

            updates[`patients/${patientId}`] = {
              ...patient,
              x: randomX,
              y: randomY,
              zone: newZone,
            };
          });

          await update(ref(database), updates);
        }
      } catch (error) {
        console.error("Error during simulation:", error);
      }
    }, 5000); // Update every 5 seconds
  };

  const stopSimulation = () => {
    clearInterval(movementIntervalRef.current);
    movementIntervalRef.current = null;
  };

  const toggleSimulation = () => {
    if (isSimulationRunning) {
      stopSimulation();
    } else {
      startSimulation();
    }
    setIsSimulationRunning(!isSimulationRunning);
  };

  const validatePatientData = (patient) => {
    if (!patient.name.trim()) return "Patient name is required";
    if (!patient.zone.trim()) return "Zone is required";
    return null;
  };

  const handleAddPatient = (e) => {
    e.preventDefault();
    setError("");

    const validationError = validatePatientData(newPatient);
    if (validationError) {
      setError(validationError);
      return;
    }

    const zone = newPatient.zone;
    if (!zoneMapping[zone]) {
      setError("Invalid zone selected.");
      return;
    }

    const { xMin, xMax, yMin, yMax } = zoneMapping[zone];
    const randomX = Math.floor(Math.random() * (xMax - xMin + 1)) + xMin;
    const randomY = Math.floor(Math.random() * (yMax - yMin + 1)) + yMin;

    const patientId = `patient_${Date.now()}`;
    set(ref(database, `patients/${patientId}`), {
      name: newPatient.name.trim(),
      x: randomX,
      y: randomY,
      zone: newPatient.zone.trim(),
    });

    setNewPatient({ name: "", x: "", y: "", zone: "" });
    toast.success("Patient added successfully!");
  };

  const handleEditPatient = (patient) => {
    setEditPatient({ ...patient });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setError("");

    const validationError = validatePatientData(editPatient);
    if (validationError) {
      setError(validationError);
      return;
    }

    update(ref(database, `patients/${editPatient.id}`), {
      name: editPatient.name.trim(),
      x: Number(editPatient.x),
      y: Number(editPatient.y),
      zone: editPatient.zone.trim(),
    });

    setEditPatient(null);
    toast.success("Patient information updated successfully!");
  };

  const handleDeletePatient = (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    remove(ref(database, `patients/${id}`));
    toast.info("Patient deleted successfully!");
  };

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="App">
      <ToastContainer />
      <header className="App-header">
        <h1>Hospital Patient Tracking System</h1>
        <button
          onClick={toggleSimulation}
          className={`btn ${isSimulationRunning ? "btn-danger" : "btn-success"} simulation-btn`}
        >
          {isSimulationRunning ? "Stop" : "Start"} Simulation
        </button>
        <button
          onClick={() => auth.signOut()}
          className="btn btn-secondary logout-btn"
        >
          Logout
        </button>
      </header>
      <main className="App-main">
        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-container">
          <section className="patient-management">
            <h2>{editPatient ? "Edit Patient" : "Add New Patient"}</h2>
            <form onSubmit={editPatient ? handleSaveEdit : handleAddPatient} className="patient-form">
              <input
                type="text"
                placeholder="Name"
                value={editPatient ? editPatient.name : newPatient.name}
                onChange={(e) =>
                  editPatient
                    ? setEditPatient({ ...editPatient, name: e.target.value })
                    : setNewPatient({ ...newPatient, name: e.target.value })
                }
              />
              <select
                value={editPatient ? editPatient.zone : newPatient.zone}
                onChange={(e) =>
                  editPatient
                    ? setEditPatient({ ...editPatient, zone: e.target.value })
                    : setNewPatient({ ...newPatient, zone: e.target.value })
                }
              >
                <option value="">Select Zone</option>
                {Object.keys(zoneMapping).map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn btn-primary">
                {editPatient ? "Save Changes" : "Add Patient"}
              </button>
              {editPatient && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditPatient(null)}
                >
                  Cancel
                </button>
              )}
            </form>
          </section>

          <section className="patient-list">
            <h2>Patient List</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Zone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.name}</td>
                      <td>{patient.x}</td>
                      <td>{patient.y}</td>
                      <td>{patient.zone}</td>
                      <td>
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="btn btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="btn btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="visualization">
          <div className="floor-plan">
            <h2>Hospital Floor Plan</h2>
            <HospitalFloorPlan patients={patients} />
          </div>
          <div className="patient-map">
            <h2>Patient Map</h2>
            <PatientMap patients={patients} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
