import { useState } from 'react';
import Router from 'next/router';

export default function Login(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState(''), [err,setErr]=useState('');
  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.token){
      localStorage.setItem('token', data.token);
      Router.push('/');
    } else setErr(data.error || 'Login failed');
  };
  return (
    <div style={{padding:20}}>
      <h2>Login - ViorelShop</h2>
      <p style={{fontSize:'12px', color:'#888'}}>Aplicație dezvoltată de Jipeanu Viorel</p>
      <form onSubmit={submit}>
        <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /><br/>
        <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /><br/>
        <button>Login</button>
      </form>
      {err && <p style={{color:'red'}}>{err}</p>}
    </div>
  )
}
