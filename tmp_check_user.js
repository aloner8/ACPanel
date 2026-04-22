(async ()=>{
  try{
    const {PrismaClient}=require('@prisma/client');
    const p=new PrismaClient();
    const u=await p.user.findUnique({where:{email:'aloner8@gmail.com'}});
    console.log(JSON.stringify(u,null,2));
    await p.$disconnect();
  }catch(e){console.error(e);process.exit(1)}
})();