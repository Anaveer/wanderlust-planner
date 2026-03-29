import React, { useState, useEffect } from 'react';
import './App.css';

// 🏠 LOCALHOST ENGINE (Kyunki deployment abhi band hai)
 const API_BASE_URL = "https://wanderlust-planner-npb0.onrender.com";

const TripCard = ({ trip, handleDelete }) => {
  const [showPlan, setShowPlan] = useState(false);

  // 🧮 PRICE CALCULATOR
  let grandTotal = 0;
  let totalDays = trip.itinerary ? trip.itinerary.length : 1;

  if (trip.itinerary) {
    trip.itinerary.forEach(day => {
      if (day.places) day.places.forEach(place => grandTotal += Number(place.costINR) || 0);
      if (day.food) day.food.forEach(item => grandTotal += Number(item.costINR) || 0);
    });
  }

  let perDayAvg = totalDays > 0 ? Math.round(grandTotal / totalDays) : grandTotal;

  return (
    <div className="trip-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '15px', marginBottom: '25px', backgroundColor: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      {trip.imageUrl && <img src={trip.imageUrl} alt={trip.destination} style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '10px' }} />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px' }}>
        <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.8rem' }}>📍 {trip.destination}</h2>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b', fontWeight: 'bold' }}>
                📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '0.95rem', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
            Per Day Avg: ₹{perDayAvg}
          </span>
          <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.2rem', backgroundColor: '#d1fae5', padding: '5px 10px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
            {totalDays} Days Total: ₹{grandTotal}
          </span>
        </div>
      </div>
      
      <p style={{ fontStyle: 'italic', color: '#475569', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginTop: '10px', lineHeight: '1.5' }}>
        {trip.summary}
      </p>

      <button 
        onClick={() => setShowPlan(!showPlan)} 
        style={{ padding: '12px', backgroundColor: showPlan ? '#e2e8f0' : '#2563eb', color: showPlan ? '#0f172a' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px', transition: '0.3s', fontSize: '1rem' }}>
        {showPlan ? 'Hide Itinerary 🔼' : "Let's view the plan 🗺️"}
      </button>

      {showPlan && trip.itinerary && (
        <div style={{ marginTop: '15px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
          {trip.itinerary.map((dayPlan, index) => {
            let dayTotal = 0;
            if (dayPlan.places) dayPlan.places.forEach(p => dayTotal += Number(p.costINR) || 0);
            if (dayPlan.food) dayPlan.food.forEach(f => dayTotal += Number(f.costINR) || 0);

            return (
              <div key={index} style={{ marginBottom: '25px', borderBottom: index === trip.itinerary.length - 1 ? 'none' : '1px solid #cbd5e1', paddingBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', backgroundColor: '#dbeafe', padding: '8px 15px', borderRadius: '20px' }}>
                  <h3 style={{ color: '#1e40af', margin: 0 }}>Day {dayPlan.day}: {dayPlan.title}</h3>
                  <span style={{ fontWeight: 'bold', color: '#1d4ed8', fontSize: '0.95rem' }}>Day Total: ₹{dayTotal}</span>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#334155', fontSize: '1.05rem' }}>🏛️ Places to Visit:</strong>
                  <ul style={{ paddingLeft: '20px', margin: '8px 0', lineHeight: '1.8' }}>
                    {dayPlan.places && dayPlan.places.map((place, i) => (
                      <li key={i} style={{ marginBottom: '5px' }}>
                        <span style={{ fontWeight: '500' }}>{place.name}</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>(₹{place.costINR})</span>
                        <a href={`http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(place.name + ' ' + trip.destination)}`} target="_blank" rel="noreferrer" style={{ marginLeft: '12px', textDecoration: 'none', fontSize: '0.85rem', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '5px', color: '#2563eb', border: '1px solid #cbd5e1', transition: '0.2s' }}>🗺️ View Map</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <strong style={{ color: '#334155', fontSize: '1.05rem' }}>🍔 Local Food to Try:</strong>
                  <ul style={{ paddingLeft: '20px', margin: '8px 0', lineHeight: '1.8' }}>
                    {dayPlan.food && dayPlan.food.map((food, i) => (
                      <li key={i} style={{ marginBottom: '5px' }}>
                        <span style={{ fontWeight: '500' }}>{food.name}</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>(₹{food.costINR})</span>
                        <a href={`http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(food.name + ' near ' + trip.destination)}`} target="_blank" rel="noreferrer" style={{ marginLeft: '12px', textDecoration: 'none', fontSize: '0.85rem', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '5px', color: '#e11d48', border: '1px solid #cbd5e1', transition: '0.2s' }}>📍 Find Place</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={() => handleDelete(trip._id)} style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', marginTop: '15px', fontWeight: 'bold', fontSize: '0.95rem' }}>
        🗑️ Delete Trip
      </button>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({ destination: '', startDate: '', endDate: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAuthChange = (e) => setAuthData({ ...authData, [e.target.name]: e.target.value });

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token); 
          localStorage.setItem('user', JSON.stringify(data.user)); 
          setToken(data.token); 
          setCurrentUser(data.user);
        } else if (data.message === "User registered successfully!") {
          alert('Registration successful! Please login now.'); 
          setIsLoginMode(true);
        } else {
          alert(data.message);
        }
      }).catch(err => console.error(err));
  };

  const handleLogout = () => {
    localStorage.clear(); 
    setToken(''); 
    setCurrentUser(null); 
    setTrips([]); 
    window.location.href = "/"; 
  };

  const fetchTrips = () => {
    if (!token) return;
    fetch(`${API_BASE_URL}/api/trips/all`, { headers: { 'auth-token': token } })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setTrips(data) : setTrips([]))
      .catch(err => console.error(err));
  };

  useEffect(() => { 
    if (token) fetchTrips(); 
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!token) { alert("Please login first!"); return; } 
    setIsGenerating(true);

    fetch(`${API_BASE_URL}/api/trips/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'auth-token': token },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        setIsGenerating(false);
        if(data.message) { alert("Backend Error: " + data.message); } 
        else { fetchTrips(); setFormData({ destination: '', startDate: '', endDate: '' }); }
      }).catch(err => { setIsGenerating(false); console.error(err); alert("Error generating trip."); });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this plan?")) {
      fetch(`${API_BASE_URL}/api/trips/${id}`, { method: 'DELETE', headers: { 'auth-token': token } })
        .then(() => fetchTrips()).catch(err => console.error(err));
    }
  };

  // =====================
  // FIX 2: LOGIN/SIGNUP SCREEN (AESTHETIC CHANGES)
  // =====================
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        // 👇 CHANGED: Old canyon image replaced with Indian transport combinational image 👇
        backgroundImage: 'url("https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2000&auto=format&fit=crop")', // Clean shot of Indian Railway/Station
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        
        {/* Semi-transparent blur container for the form */}
        <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', padding: '40px', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', maxWidth: '420px', width: '90%', textAlign: 'center' }}>
          
          {/* Changed Title */}
          <h1 style={{ margin: '0 0 5px 0', fontSize: '2.8rem', color: '#0f172a', fontWeight: '900', letterSpacing: '-1px' }}>🌍 Travel-Planner</h1>
          
          {/* Motivational Travel Sentences */}
          <p style={{ fontStyle: 'italic', color: '#475569', fontSize: '0.95rem', marginBottom: '30px', lineHeight: '1.6' }}>
            "The world is a book, and those who do not travel read only one page." <br/>
            <span style={{ fontWeight: 'bold', color: '#2563eb', display: 'block', marginTop: '10px' }}>Your next Indian adventure is just a click away. 🚂🚌✈️</span>
          </p>

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!isLoginMode && <input type="text" name="name" placeholder="Full Name" onChange={handleAuthChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}/>}
            <input type="email" name="email" placeholder="Email Address" onChange={handleAuthChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}/>
            <input type="password" name="password" placeholder="Password" onChange={handleAuthChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}/>
            <button type="submit" style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', marginTop: '5px', transition: '0.3s' }}>
              {isLoginMode ? 'Start Planning' : 'Create Account'}
            </button>
          </form>

          <p onClick={() => setIsLoginMode(!isLoginMode)} style={{ color: '#2563eb', cursor: 'pointer', marginTop: '20px', fontWeight: '600', fontSize: '0.95rem' }}>
            {isLoginMode ? 'New here? Create an account' : 'Already a traveler? Login here'}
          </p>
        </div>
      </div>
    );
  }

  // =====================
  // FIX 1: MAIN DASHBOARD (CLEANED UP BACKGROUND)
  // =====================
  return (
    // 👇 CHANGED: Removed Canyon Background and fixed positioning props 👇
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', // plain white background after login
        padding: '40px 20px' }}>
      
      {/* Semi-transparent blur effect container (Removed since background is solid white) */}
      <div style={{ maxWidth: '850px', margin: '0 auto', 
        // 👇 CHANGED: Made container cleaner against white background 👇
        backgroundColor: '#ffffff', // solid white
        padding: '30px', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' // softer shadow
        }}>
        
        {/* Navbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #f1f5f9' }}>
          <h1 style={{ margin: 0, color: '#0f172a', fontSize: '1.8rem', fontWeight: '900' }}>🌍 let's plan </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: '600', color: '#475569' }}>Hey, {currentUser?.name} 👋</span>
            <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>Logout</button>
          </div>
        </div>
        
        {/* Plan Input Area */}
        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginTop: 0, color: '#0f172a', fontSize: '1.3rem' }}>✨ Where is your next adventure?</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '15px', fontStyle: 'italic' }}>"Travel is the only thing you buy that makes you richer."</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input type="text" name="destination" placeholder="E.g. Goa, Paris, Kyoto..." value={formData.destination} onChange={handleChange} required style={{ flex: '1', minWidth: '200px', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem' }}/>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required style={{ padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#475569' }}/>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required style={{ padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', color: '#475569' }}/>
            <button type="submit" disabled={isGenerating} style={{ padding: '14px 25px', background: isGenerating ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', minWidth: '160px', fontSize: '1rem', transition: '0.3s' }}>
              {isGenerating ? 'Mapping Journey... 🗺️' : 'Create Itinerary 🚀'}
            </button>
          </form>
        </div>

        {/* Saved Trips */}
        <div>
          <h2 style={{ color: '#0f172a', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>Your Travel Diaries</h2>
          {trips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f8fafc', borderRadius: '15px', color: '#64748b', border: '1px dashed #cbd5e1' }}>
              <p style={{ fontSize: '1.2rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>Your passport is empty! 📖</p>
              <p style={{ margin: 0 }}>Type a destination above to magically generate your first trip.</p>
            </div>
          ) : (
            trips.map(trip => <TripCard key={trip._id} trip={trip} handleDelete={handleDelete} />)
          )}
        </div>

      </div>
    </div>
  );
}

export default App;