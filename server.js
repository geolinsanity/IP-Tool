const express = require('express');
const cors = require('cors');
const Auth = require('./src/controllers/auth.controller');
const db = require('./src/models');
const app = express();

const corsOptions = {
    origin:'http://localhost:3001'
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Connect DB
async function connectDB() {
    try {
        const dbURI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        const dbConnect = await db.mongoose.connect(dbURI);
        if(dbConnect) {
            console.log('Connected to DB successfully');
        }
        await initial();
    } catch (err) {
        console.error('Error Connect:', err);
        process.exit();
    }
}

async function initial() {
    try {
        const countRole = await db.role.countDocuments();
        const countUser = await db.user.countDocuments();
        if(countRole === 0) {
            await db.role.insertMany([
                { role_id: 1, name: 'user' },
                { role_id: 2, name: 'admin' },
                { role_id: 3, name: 'super_admin' }
            ]);
            console.log('Added default roles to DB');
        }
        if(countUser === 0) {
            const pass = 'adminpass';
            const encryptPass = await Auth.hashPass(pass);
            await db.user.insertOne(
                { username: 'admin', password: encryptPass, role_id: 3 },
            );
            console.log('Added default admin to DB');
        }
    } catch (err) {
        console.error('Error initialize roles:', err);
    }
}

connectDB();

app.get('/', (req, res) => {
    res.json({ message: 'Running IP-tool-BE' })
});

//Routes
app.use('/user', require('./src/routes/user.route'));
app.use('/', require('./src/routes/main.route'));
app.use('/audit', require('./src/routes/audit.route'));

//For Errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});