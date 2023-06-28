const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("usuarios", {
  
    nombre: {
      type: DataTypes.STRING,
      
    },
    email:{
      type: DataTypes.STRING
    },

  },{timestamps:false});
};

