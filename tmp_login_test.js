(async ()=>{
  try{
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'aloner8@gmail.com', password: 'TempPass123!' })
    });
    const txt = await res.text();
    console.log('status', res.status);
    console.log(txt);
  } catch (e) { console.error(e); process.exit(1); }
})();