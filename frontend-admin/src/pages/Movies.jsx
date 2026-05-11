import React from 'react';

const Movies = () => {
  const MOCK_MOVIES = [
    { id:1, name:"The Real Goat", date:"24/01/2024 - 30/01/2024", screen:"Screen 3", lang:"Hindi, English", type:"2D/3D", status:"running" },
    { id:2, name:"Black Widow", date:"14/04/2024 - 20/04/2024", screen:"Screen 1", lang:"English", type:"IMAX", status:"pending" },
    { id:3, name:"Iron Man", date:"01/05/2024 - 15/05/2024", screen:"Screen 2", lang:"English, Hindi", type:"3D", status:"running" },
    { id:4, name:"Avengers: Endgame", date:"20/06/2024 - 30/06/2024", screen:"Screen 4", lang:"English", type:"IMAX 3D", status:"upcoming" }
  ];

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Movies Management</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" placeholder="Search movies..." style={{ height: '36px', borderRadius: '6px', border: '1px solid var(--border)', padding: '0 12px' }} />
          <button style={{ background: 'var(--accent)', color: 'white', padding: '0 16px', borderRadius: '6px', fontWeight: '600' }}>Add Movie</button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#F9FAFB', borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '16px 20px', color: 'var(--textSub)', fontWeight: '600' }}>MOVIE NAME</th>
            <th style={{ padding: '16px 20px', color: 'var(--textSub)', fontWeight: '600' }}>SCREENS</th>
            <th style={{ padding: '16px 20px', color: 'var(--textSub)', fontWeight: '600' }}>LANGUAGE</th>
            <th style={{ padding: '16px 20px', color: 'var(--textSub)', fontWeight: '600' }}>TYPE</th>
            <th style={{ padding: '16px 20px', color: 'var(--textSub)', fontWeight: '600' }}>STATUS</th>
            <th style={{ padding: '16px 20px', color: 'var(--textSub)', fontWeight: '600', textAlign: 'right' }}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_MOVIES.map(m => (
            <tr key={m.id} style={{ borderBottom: '1px solid var(--borderLight)' }}>
              <td style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '56px', background: 'var(--purpleBg)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎬</div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--textPrimary)' }}>{m.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--textSub)' }}>{m.date}</div>
                </div>
              </td>
              <td style={{ padding: '16px 20px' }}>{m.screen}</td>
              <td style={{ padding: '16px 20px' }}>{m.lang}</td>
              <td style={{ padding: '16px 20px' }}><span className="badge gray">{m.type}</span></td>
              <td style={{ padding: '16px 20px' }}>
                <span className={`badge ${m.status === 'running' ? 'success' : m.status === 'upcoming' ? 'accent' : 'warning'}`}>{m.status}</span>
              </td>
              <td style={{ padding: '16px 20px', textAlign: 'right', fontSize: '16px' }}>
                <span style={{ cursor: 'pointer', marginRight: '8px' }}>✏️</span>
                <span style={{ cursor: 'pointer' }}>🗑️</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Movies;
