import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as passport from 'passport';
import * as mongoose from 'mongoose';
import { users } from './routes/users';
import { database as dbConfig } from './config/database';
import { PassportConfig } from './config/passport';

//Declaring for compilation porpuses
declare var __dirname;

//Mongoose connect
mongoose.connect(dbConfig.database);

//On Connect
mongoose.connection.on('connected', () => {
    console.log(`Connected to database: ${dbConfig.database}`);
});

//On error
mongoose.connection.on('error', (err) => {
    console.log(`Database error: ${err}`);
});

//Express app
const app = express();

//port number
const port = 3000;

//Enabling Cors
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Enabling Body-Parser
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

PassportConfig(passport);

//Adding users route
app.use('/api/users', users);

//Index route
app.get('/', (req, res) => {
    res.send("Invalid endpoint");
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})