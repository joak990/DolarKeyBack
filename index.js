const { data, postuser, getUsersFromDatabase } = require("./Handlers/getdolar");
const server = require("./app");
const { conn } = require("./db.js");
const axios = require("axios");
const { Usuarios } = require("./db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const nodemailer = require("nodemailer");
const PORT = 3001;
let previousDollarValue = 422;
const intervalDuration = 30 * 1000;
let previousDollarcompra = null;
conn.sync({ alter: true }).then(() => {
  server.listen(PORT, async () => {
    console.log("%s listening at 3001"); // eslint-disable-line no-console
  });
});

server.use(cookieParser());
server.use(morgan("dev"));
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
server.use(morgan("dev"));

server.get("/", async (req, res) => {
  const results = await data();
  res.status(200).json(results);
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dolarkeyoficial@gmail.com",
    pass: "sidniziiflvgxcec",
  },
});

server.post("/newsletter", async (req, res) => {
  const { nombre, email } = req.body;

  try {
    const existingUser = await Usuarios.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      const responses = { sucess: true };
      return res.status(200).json(responses);
    }
    const newUser = await postuser(nombre, email);

    // Enviar el correo de bienvenida
    const mailOptions = {
      from: "dolarkeyoficial@gmail.com",
      to: email,
      subject: "Bienvenido a Dolarkey",
      html: `
    <html>
      <head>
        <style>
         
        </style>
      </head>
      <body>
        <h1>Hola ${nombre},</h1>
        <p>¡Gracias por suscribirte a la newsletter de Dolarkey! Estarás al tanto de las últimas noticias y movimientos del dólar.</p>
        <p>¡Bienvenido/a a nuestra comunidad!</p>
        <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px;">
          <a href="https://www.dolarkey.com" style="text-decoration: none; color: white;">Visita nuestra página web</a>
        </button>
        <p>Saludos,<br>El equipo de Dolarkey</p>
      </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);
    const responses2 = { sucess: false };
    res.status(200).json(responses2);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

const checkDollarAndSendEmails = async () => {
  try {
    const response = await axios.get(
      "https://dolar-api-argentina.vercel.app/v1/dolares"
    );
    const dollarValue = response.data[1].venta;
const previousDollarcompra = response.data[1].compra;
console.log(dollarValue)
console.log(previousDollarValue);
console.log(previousDollarcompra);;
    if (previousDollarValue !== null && dollarValue !== previousDollarValue) {
     
      const users = await getUsersFromDatabase();

      for (const user of users) {
        const email = user.email;
        const message = `¡Atención! El valor del dólar blue ha sufrido cambios  en DolarKey.
Nuevo valor: compra - ${previousDollarcompra} venta - ${dollarValue} 
No pierdas la oportunidad de estar al tanto de las fluctuaciones del dólar en tiempo real. Únete a DolarKey ahora y recibe actualizaciones instantáneas sobre los cambios en el mercado cambiario.
¡No te quedes atrás! Mantente informado y toma decisiones financieras acertadas con DolarKey. Regístrate hoy mismo en nuestro sitio web y comienza a aprovechar todas las ventajas que ofrecemos.
¡DolarKey, tu aliado confiable en el mundo del dólar!`;

        const mailOptions = {
          from: "joakhaidar@gmail.com",
          to: email,
          subject: "Actualización del valor del dólar",
          html: `
        <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e2e8f0; border-radius: 5px; font-size: 18px; font-weight: bold; color: #2d3748; max-width: 500px; margin: 0 auto; margin-top: 20px;">
          ${message}
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${email}`);
      }
    }

    // Almacenar el valor actual como valor anterior para la próxima verificación
    previousDollarValue = dollarValue;
    console.log(dollarValue);
    console.log("Verificación del valor del dólar completa");
  } catch (error) {
    console.error("Error al verificar el valor del dólar:", error);
  }
};

setInterval(checkDollarAndSendEmails, intervalDuration);

// Ruta para verificar el valor del dólar y enviar correos electrónicos
server.post("/check-dollars", async (req, res) => {
  res
    .status(200)
    .json({ message: "Verificación del valor del dólar programada" });
});
