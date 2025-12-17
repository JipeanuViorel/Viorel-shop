import { useState } from 'react';
import Router from 'next/router';

export default function Register(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState(''), [msg,setMsg]=useState('');
  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/register', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('Registered, go login');
      Router.push('/login');
    } else setMsg(data.error || 'Error');
  };
  return (
    <div style={{padding:20}}>
      <h2>Register - ViorelShop</h2>
      <p style={{fontSize:'12px', color:'#888'}}>Aplicație dezvoltată de Jipeanu Viorel</p>
      <form onSubmit={submit}>
        <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button>Register</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  )
}
