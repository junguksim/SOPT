const mysql = require('mysql');
const config = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'sgoh159753!!@@',
    database: 'new_schema',
}
const pool = mysql.createPool(config);

const selectWomenQuery = 'SELECT * FROM user WHERE gender = ?';

pool.getConnection((err, connection) => {
    connection.query(selectWomenQuery, [0], (err, result) => {
        if (err) {

        } else {
            console.log(result);
            connection.release();
        }
    });
    //connection.release(); 잘못된 위치!!!
    //release와 query 둘 다 비동기적으로 처리되기 때문에 query 날리기 전에 connection 반납될 수 있음
});