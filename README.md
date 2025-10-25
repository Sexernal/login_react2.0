git clone https://github.com/Sexernal/login_react2.0.git
cd login_react2.0
npm install          # instala dependencias
# si axios no está ejecutar:
npm install axios
# crear archivo local de variables
echo "NEXT_PUBLIC_API_URL=https://api-laravel-12-main-fv6pcf.laravel.cloud" > .env.local
# iniciar dev server
npm run dev


Proyecto Next.js que implementa un login con dos modos: modo local de prueba (gmail@ejemplo.com / 1234) y modo API real que utiliza POST /api/login y GET /api/profile de la API del curso. Para usarlo: clonar el repo, ejecutar npm install (y npm install axios si no está en package.json), crear .env.local con "NEXT_PUBLIC_API_URL=https://api-laravel-12-main-fv6pcf.laravel.cloud" y correr npm run dev. El token se guarda en localStorage y el dashboard muestra el perfil (incluye opción de avatar en base64).