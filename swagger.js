const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/admin/admin.js', './routes/user/googleAuth.js', './routes/user/user.js'];

swaggerAutogen(outputFile, endpointsFiles)