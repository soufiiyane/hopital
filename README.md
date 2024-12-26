# Hospital Patient Tracking System

## **Overview**
The Hospital Patient Tracking System is a comprehensive solution designed to manage and track the real-time movements of patients within a hospital. The system uses React for the frontend, Firebase for backend services, and offers real-time visualization through dynamic floor plans and mapping tools. This system is built to improve patient safety, optimize resource allocation, and reduce risks of incidents in hospitals.

---

## **Features**

### **1. Patient Management**
- **Add, Edit, Delete Patients**:
  - Functionality to create new patient profiles.
  - Update or delete existing patient details.
  - Assign each patient to a specific zone.
- **Validation**:
  - Validates patient data such as name and zone.
  - Prevents creation of invalid entries.

### **2. Real-Time Localization**
- **Dynamic Zone Mapping**:
  - Zones (e.g., ICU, Radiology, Emergency) are predefined in `zoneMapping.js` with precise boundaries.
- **Simulation of Movements**:
  - Patients' locations are simulated with random movements.
  - Zone updates trigger alerts for specific conditions.

### **3. Visualization**
- **Floor Plan View**:
  - `HospitalFloorPlan.jsx` provides a graphical layout displaying patient locations.
- **Interactive Map**:
  - `PatientMap.jsx` uses Leaflet.js to show patients on an interactive geospatial map.

### **4. Notifications and Alerts**
- **Real-Time Alerts**:
  - Notify staff when a patient changes zones or enters unauthorized areas.
  - Alerts for critical events such as falls or abnormal movements.

### **5. User Authentication**
- **Login and Registration**:
  - Staff can log in or register.
  - Role-based access control (e.g., doctors).
- **Firebase Integration**:
  - Firebase Authentication for secure login.
  - Firestore for user role management.

### **6. Backend and Database**
- **Firebase Services**:
  - Realtime Database: Stores patient locations and profiles.
  - Authentication: Manages user accounts.
  - Firestore: Stores staff details and roles.
- **Centralized Services**:
  - `auth.service.js` provides modular functions for login, registration, and database updates.

### **7. Styling**
- **Responsive Design**:
  - Styled with `auth.css` to ensure consistent and user-friendly interfaces.
  - Supports various screen sizes with modern UI practices.

---

## **Technologies Used**
- **Frontend**:
  - React.js
  - Leaflet.js for interactive maps
  - CSS for styling
- **Backend**:
  - Firebase (Realtime Database, Firestore, Authentication)
- **Libraries**:
  - `react-toastify` for notifications
  - `firebase` for backend services
  - `react-leaflet` for map visualization

---

## **File Structure**

```
root
├── src
   ├── auth
   │   ├── AuthPage.jsx    // Main authentication component
   │   ├── LoginForm.jsx   // Login form
   │   ├── RegisterForm.jsx // Registration form
   │   └── auth.css       // Styling for authentication pages
   ├── components
   │   ├── HospitalFloorPlan.jsx // Graphical floor plan view
   │   ├── PatientMap.jsx        // Interactive map view
   │   └── simulatePatientMovements.js // Movement simulation logic
   ├── utils
   │   ├── firebase.js          // Firebase initialization
   │   ├── firebase.config.js   // Firebase configuration details
   │   └── zoneMapping.js       // Zone boundary definitions
   ├── App.js                  // Main application file
   └── index.js                // Entry point for the application
```

---

## **Setup Instructions**

### **1. Prerequisites**
- Node.js and npm installed.
- Firebase account and project setup.

### **2. Clone the Repository**
```bash
git clone https://github.com/iyad-khalil/Hospital_Tracking.git
cd Hospital_Tracking
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Configure Firebase**
- Replace the `firebaseConfig` object in `firebase.config.js` with your Firebase project credentials.

### **5. Run the Application**
```bash
npm start
```
- The application will be accessible at `http://localhost:3000`.

---

### **6. Deployment in the Cloud**
The Application is already deployed at 'http://hospitaltracking.s3-website-us-east-1.amazonaws.com/'

