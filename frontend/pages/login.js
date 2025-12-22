import { useState } from 'react';
import Router from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      Router.push('/');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '50px auto' }}>
      <h2>Login - ViorelShop</h2>
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
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          fontSize: 16
        }}>
          Login
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

      <p style={{ textAlign: 'center', marginTop: 20 }}>
        Nu ai cont? <a href='/register' style={{ color: '#007bff' }}>Înregistrează-te</a>
      </p>
    </div>
  )
}