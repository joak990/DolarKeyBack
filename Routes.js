const { Router } = require('express');
const GetRouter = require ("./routesget")

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


router.use("/",GetRouter)



module.exports = router;