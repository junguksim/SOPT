const mysql = require('mysql');
const config = {
    host: 'ec2-15-164-70-24.ap-northeast-2.compute.amazonaws.com',
    port: 3306,
    user: 'root',
    password: 'sgoh159753!!@@',
    database: 'new_schema',
}
const connection = mysql.createConnection(config);

const selectWomenQuery = 'SELECT * FROM membership WHERE gender = ?';

connection.connect((err) => {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
})

connection.query(selectWomenQuery, [1], (err, result) => {
    console.log(result)
});

connection.end();