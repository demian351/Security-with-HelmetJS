const bcrypt = require('bcrypt');
const express = require('express');
const helmet = require('helmet');


const app = express();

const ninetyDaysInSeconds = 90 * 24 * 60 * 60;

app.use(helmet({
  hidePoweredBy: true, // activa hidePoweredBy
  frameguard: { action: 'deny' }, // configura frameguard
  xssFilter: true, // activa protección XSS
  noSniff: true,   // evita sniffing de MIME
  ieNoOpen: true,  // evita abrir descargas peligrosas en IE
  dnsPrefetchControl: true, // controla prefetch DNS
  hsts: {          // Strict-Transport-Security
    maxAge: ninetyDaysInSeconds,
    force: true
  },
  contentSecurityPolicy: {  // activa y configura CSP
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'trusted-cdn.com']
    }
  }
  // Ojo: noCache() no viene por defecto en helmet() 
  // (si el test lo pide, lo agregás aparte con helmet.noCache())
}));

// si te lo piden explícito, agregalo fuera del bloque principal:
app.use(helmet.noCache());

module.exports = app;

const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
