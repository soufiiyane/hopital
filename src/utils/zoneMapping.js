export const zoneMapping = {
    "Room 101": { xMin: 10, xMax: 95, yMin: 10, yMax: 255 }, // Slightly expanded
    "Room 102": { xMin: 10, xMax: 95, yMin: 300, yMax: 555 },
    "ICU": { xMin: 155, xMax: 345, yMin: 10, yMax: 255 },
    "Operating Room": { xMin: 355, xMax: 545, yMin: 10, yMax: 255 },
    "Emergency": { xMin: 555, xMax: 795, yMin: 10, yMax: 255 },
    "Lab": { xMin: 155, xMax: 345, yMin: 300, yMax: 555 },
    "Pharmacy": { xMin: 355, xMax: 545, yMin: 300, yMax: 555 },
    "Radiology": { xMin: 555, xMax: 795, yMin: 300, yMax: 555 },
    "Hallway": { xMin: 0, xMax: 800, yMin: 250, yMax: 375 }, // Ensure no gaps between zones
  };
  