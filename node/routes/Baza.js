const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

var admin = false;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const route = express.Router();
const bcrypt = require('bcrypt');


const sema = Joi.object().keys({
    ime: Joi.string().trim().required(),
    reziser: Joi.string().trim().required(),
    zanr: Joi.string().trim().required(),
    brojPregleda: Joi.number().min(0).required()
});


const link = Joi.object().keys({
    id: Joi.number().min(1).max(50).required()
});

const userSema = Joi.object().keys({
    username : Joi.string().min(2).max(40).required(),
    password : Joi.string().min(2).max(15).required()
})

const loginSema = Joi.object().keys({
    username : Joi.string().min(2).max(40).required(),
    password : Joi.string().min(2).max(15).required()
})
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    console.log(hash)
}

route.get('/isAdmin',(req ,res)=>{
    res.send(admin);
});

route.post('/register',jsonParser, (req,res)=>{
    let { error } = userSema.validate(req.body);
    if (error){
        console.log(error)
        res.status(400).send(error.details[0].message);
    }else{
        const name = req.body.username;
        var password= req.body.password;

        let errors = [];

        if(!name  || !password  ){
            errors.push({msg: 'Please fill in all the fields'});
            res.send({message:'Please fill in all the fields'});
        }
        if(errors.length>0){

        }else{
            if(name){
                pool.query('SELECT * FROM users WHERE username = ?', [name],
                    (error, results, fields)=>{
                        if (results.length>0){
                            res.send('username exists');
                            alert('Username exists');
                        }else{
                            res.send('Reg success')
                            bcrypt.hash(password, 5, (err, hash)=> {
                                if(err)throw err;
                                password = hash;
                                pool.query('INSERT INTO users(username, password, admin) VALUES(?,?,?)',
                                    [name,password,0]);
                            });

                        }

                    });
            }else{
                res.send('Enter Email');
            };
        }
    }

});
route.post('/login',jsonParser, (req, res)=> {
    let { error } = loginSema.validate(req.body);
    console.log(req.body.username)
    console.log(req.body.password)
    if (error){
        res.status(400).send(error.details[0].message);
    }else {
        const username = req.body.username;
        const password = req.body.password;

        if (username && password) {
            pool.query('SELECT * FROM users WHERE username = ?', [username],
                (error, results, fields) => {
                    if(error || results.length == 0) {
                        res.send('There is no user with this username');
                        alert('There is no user with this username');
                        res.end();
                    }
                    var ad = results[0].admin;
                    console.log(ad);
                    console.log(results[0]);
                    pass = results[0].password;
                    if(ad != 0){
                        console.log('admin');
                        if(pass == password){
                            admin = true;
                            console.log('admin true');
                            res.send(results[0]);
                            return;
                        }
                    }
                    if (bcrypt.compareSync(password, pass)) {
                        console.log('false');
                        admin = false;
                        res.send(results[0]);
                    } else {
                        console.log('false2');
                        res.send('Incorrect Email and/or Password!');
                    }
                    res.end();
                });
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    }
});


route.use(express.json());


route.get('/filmovi', (req, res) => {
    pool.query('select * from app_film', (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});


route.post('/filmovi', (req, res) => {
    let { error } = Joi.validate(req.body, sema);

    if (error)
        res.status(400).send(error.details[0].message);

    else {
        let query = "insert into app_film (ime, reziser, zanr, brojPregleda) values (?, ?, ?, ?)";
        let formated = mysql.format(query, [req.body.ime, req.body.reziser, req.body.zanr, req.body.brojPregleda]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from app_film where id=?';
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

route.get('/film/:id', (req, res) => {
    let {error} = Joi.validate(req.params, link);

    if(error){
        res.status(400).send(error.details[0].message);
    }else {
        let query = 'select * from app_film where id=?';
        let formated = mysql.format(query, [req.params.id]);

        pool.query(formated, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else
                res.send(rows[0]);

        });
    }
});

route.put('/film/:id', (req, res) => {

    let { error } = Joi.validate(req.params, link);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        let { error } = Joi.validate(req.body, sema);
        if(error){
            res.status(400).send(error.details[0].message);
        }
        else {
            let query = "update app_film set ime=?, reziser=?, zanr = ?, brojPregleda = ? where id=?";
            let formated = mysql.format(query, [req.body.ime, req.body.reziser, req.body.zanr, req.body.brojPregleda, req.params.id]);

            pool.query(formated, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from app_film where id=?';
                    formated = mysql.format(query, [req.params.id]);

                    pool.query(formated, (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else
                            res.send(rows[0]);
                    });
                }
            });
        }
    }

});


route.delete('/film/:id', (req, res) => {
    let {error} = Joi.validate(req.params, link);
    if(error)
        res.status(400).send(error.details[0].message);
    else
    {
        let query = 'select * from app_film where id=?';
        let formated = mysql.format(query, [req.params.id]);

        pool.query(formated, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                let film = rows[0];

                let query = 'delete from app_film where id=?';
                let formated = mysql.format(query, [req.params.id]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(film);
                });
            }
        });
    }
});


//////predstave


route.get('/predstave', (req, res) => {
    pool.query('select * from app_predstava', (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});


route.post('/predstava', (req, res) => {
    let { error } = Joi.validate(req.body, sema);

    if (error)
        res.status(400).send(error.details[0].message);

    else {
        let query = "insert into app_predstava (ime, reziser, zanr, brojPregleda) values (?, ?, ?, ?)";
        let formated = mysql.format(query, [req.body.ime, req.body.reziser, req.body.zanr, req.body.brojPregleda]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from app_predstava where id=?';
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

route.get('/predstava/:id', (req, res) => {
    let {error} = Joi.validate(req.params, link);

    if(error){
        res.status(400).send(error.details[0].message);
    }else {
        let query = 'select * from app_predstava where id=?';
        let formated = mysql.format(query, [req.params.id]);

        pool.query(formated, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else
                res.send(rows[0]);

        });
    }
});

route.put('/predstava/:id', (req, res) => {

    let { error } = Joi.validate(req.params, link);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    else {
        let { error } = Joi.validate(req.body, sema);
        if(error){
            res.status(400).send(error.details[0].message);
        }
        else {
            let query = "update app_predstava set ime=?, reziser=?, zanr = ?, brojPregleda = ? where id=?";
            let formated = mysql.format(query, [req.body.ime, req.body.reziser, req.body.zanr, req.body.brojPregleda, req.params.id]);

            pool.query(formated, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from app_predstava where id=?';
                    formated = mysql.format(query, [req.params.id]);

                    pool.query(formated, (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else
                            res.send(rows[0]);
                    });
                }
            });
        }
    }

});


route.delete('/predstava/:id', (req, res) => {
    let {error} = Joi.validate(req.params, link);
    if(error)
        res.status(400).send(error.details[0].message);
    else
    {
        let query = 'select * from app_predstava where id=?';
        let formated = mysql.format(query, [req.params.id]);

        pool.query(formated, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                let predstava = rows[0];

                let query = 'delete from app_predstava where id=?';
                let formated = mysql.format(query, [req.params.id]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(predstava);
                });
            }
        });
    }
});

module.exports = route;