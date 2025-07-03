const db = require('./connection'); // Importa la conexión a la base de datos

// Nombre de la tabla de la que quieres visualizar los datos
const nombreTabla = 'item_general'; // Cambia 'usuarios' por el nombre de tu tabla

db.serialize(() => {
  // Consulta todos los datos de la tabla especificada
  db.all(`SELECT * FROM ${nombreTabla}`, [], (err, rows) => {
    if (err) {
      console.error(`Error al consultar datos de la tabla "${nombreTabla}":`, err.message);
    } else {
      if (rows.length === 0) {
        console.log(`La tabla "${nombreTabla}" está vacía.`);
      } else {
        console.log(`\n--- Datos de la tabla "${nombreTabla}" ---`);
        rows.forEach((row) => {
          console.log(`ID: ${row.id}, Nombre: ${row.nombre}, Código: ${row.codigo}, Tipo: ${row.tipo}`);
        })
      }
    }
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('\nConexión a la base de datos SQLite cerrada.');
        }
    })
  })
})
