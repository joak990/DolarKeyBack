const { Router} = require ("express")
const {  getdolars } = require("./Handlers/getdolar")


const GetRouter = Router()

GetRouter.get("/",getdolars)
GetRouter.post("/",getdolarsr)
module.exports =GetRouter