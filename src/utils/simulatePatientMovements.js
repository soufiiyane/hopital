import { ref, update, get } from "firebase/database";
import { database } from "./firebase";

const moveSpeed = 10; // Speed of movement per update (smaller = slower)

// Simulate Real-Time Patient Movement
export function simulatePatientMovements() {
  const updateInterval = 200; // Update every 200ms for smooth motion
  const floorPlanLimits = { xMax: 800, yMax: 600 };

  const getZoneForCoordinates = (x, y) => {
    const zones = {
      "Room 101": { xMin: 10, xMax: 95, yMin: 10, yMax: 255 },
      "Room 102": { xMin: 10, xMax: 95, yMin: 300, yMax: 555 },
      "ICU": { xMin: 155, xMax: 345, yMin: 10, yMax: 255 },
      "Operating Room": { xMin: 355, xMax: 545, yMin: 10, yMax: 255 },
      "Emergency": { xMin: 555, xMax: 795, yMin: 10, yMax: 255 },
      "Lab": { xMin: 155, xMax: 345, yMin: 300, yMax: 555 },
      "Pharmacy": { xMin: 355, xMax: 545, yMin: 300, yMax: 555 },
      "Radiology": { xMin: 555, xMax: 795, yMin: 300, yMax: 555 },
      "Hallway": { xMin: 0, xMax: 800, yMin: 250, yMax: 375 },
    };

    for (const [zone, boundaries] of Object.entries(zones)) {
      const { xMin, xMax, yMin, yMax } = boundaries;
      if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
        return zone;
      }
    }
    return "Unknown";
  };

  const updatePatientLocations = async () => {
    try {
      const patientsRef = ref(database, "patients");
      const snapshot = await get(patientsRef);

      if (snapshot.exists()) {
        const patients = snapshot.val();
        const updates = {};

        Object.values(patients).forEach((patient) => {
          const { id, x, y, targetX, targetY } = patient;

          // Initialize target if not set
          if (targetX === undefined || targetY === undefined) {
            const targetX = Math.floor(Math.random() * floorPlanLimits.xMax);
            const targetY = Math.floor(Math.random() * floorPlanLimits.yMax);
            updates[`patients/${id}`] = { ...patient, targetX, targetY };
            return;
          }

          // Calculate movement step
          const deltaX = targetX - x;
          const deltaY = targetY - y;

          const stepX = Math.abs(deltaX) > moveSpeed ? (deltaX > 0 ? moveSpeed : -moveSpeed) : deltaX;
          const stepY = Math.abs(deltaY) > moveSpeed ? (deltaY > 0 ? moveSpeed : -moveSpeed) : deltaY;

          const newX = x + stepX;
          const newY = y + stepY;

          const newZone = getZoneForCoordinates(newX, newY);

          // If target reached, assign a new target
          if (deltaX === 0 && deltaY === 0) {
            const newTargetX = Math.floor(Math.random() * floorPlanLimits.xMax);
            const newTargetY = Math.floor(Math.random() * floorPlanLimits.yMax);
            updates[`patients/${id}`] = { ...patient, targetX: newTargetX, targetY: newTargetY, x: newX, y: newY, zone: newZone };
          } else {
            // Update patient position
            updates[`patients/${id}`] = { ...patient, x: newX, y: newY, zone: newZone };
          }
        });

        // Push updates to Firebase
        await update(ref(database), updates);
      }
    } catch (error) {
      console.error("Error updating patient locations:", error);
    }
  };

  // Start real-time simulation
  setInterval(updatePatientLocations, updateInterval);
}
