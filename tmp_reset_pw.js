(async ()=>{
  try{
    let bcrypt;
    try{ bcrypt = require('bcrypt'); } catch(e) { bcrypt = require('bcryptjs'); }
    const {PrismaClient} = require('@prisma/client');
    const p = new PrismaClient();
    const email = 'aloner8@gmail.com';
    const plain = 'TempPass123!';
    const saltRounds = 12;
    const hash = bcrypt.hashSync(plain, saltRounds);
    const u = await p.user.update({ where: { email }, data: { passwordHash: hash } });
    console.log('Updated user:', JSON.stringify({ id: u.id, email: u.email }, null, 2));
    await p.$disconnect();
  } catch (e) { console.error(e); process.exit(1); }
})();