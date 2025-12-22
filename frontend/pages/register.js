import { useState } from 'react';
import Router from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Înregistrare reușită! Mergi la login.');
      setTimeout(() => Router.push('/login'), 2000);
    } else {
      setMessage(data.error || 'Eroare la înregistrare');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '50px auto' }}>
      <h2>Register - ViorelShop</h2>
      <p style={{ fontSize: '12px', color: '#888' }}>Dezvoltat de Jipeanu Viorel</p>

      <form onSubmit={submit} style={{ marginTop: 20 }}>
        <input
          placeholder='Email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            margin: '10px 0',
            border: '1px solid #ddd',
            borderRadius: 5
          }}
        />
        <input
          placeholder='Password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            margin: '10px 0',
            border: '1px solid #ddd',
            borderRadius: 5
          }}
        />
        <button style={{
          width: '100%',
          padding: 12,
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          fontSize: 16
        }}>
          Register
        </button>
      </form>

      {message && <p style={{
        color: message.includes('reușită') ? 'green' : 'red',
        marginTop: 10
      }}>
        {message}
      </p>}

      <p style={{ textAlign: 'center', marginTop: 20 }}>
        Ai deja cont? <a href='/login' style={{ color: '#007bff' }}>Loghează-te</a>
      </p>
    </div>
  )
}