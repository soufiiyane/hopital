import React, { useState } from 'react';
import { auth, db } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './auth.css';

const RegisterForm = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    specialization: '',
    licenseNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      await setDoc(doc(db, "doctors", userCredential.user.uid), {
        fullName: formData.fullName,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        email: formData.email,
        role: 'doctor',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Doctor Registration</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Medical License Number"
          value={formData.licenseNumber}
          onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <button className="toggle-btn" onClick={onToggleForm}>
          Login
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;

