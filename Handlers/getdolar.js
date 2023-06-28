const axios = require("axios");
const { Usuarios} = require("../db");

const data = async () => {
  try {
    const response = await axios.get("https://dolar-api-argentina.vercel.app/v1/dolares");
   
    return response.data;
  } catch (error) {
    console.error(error);
  }
};



const postuser =  (nombre,email)=>{
  try {
    
       return Usuarios.create({
        nombre,email
       })

  } catch (error) {
  console.log(error);
  }
}

const getUsersFromDatabase = async () => {
  try {
    const allUsers = await Usuarios.findAll({
      attributes:["email"]
    });
    
    return allUsers
  } catch (error) {
    console.log(error);
  }
};







module.exports = {
   data,
   postuser,
   getUsersFromDatabase
  };
  