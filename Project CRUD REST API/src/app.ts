import express,{ Request, Response, NextFunction} from 'express'
//import { getAllEmployees } from './services/employee.service'; //for testing of the json DB
import router from './routes/employee.route'
import { urlencoded } from 'body-parser';

const app = express();
const port_number = 3000;

app.use(express.json())                 // support json
app.use(urlencoded({extended:true}));   // support url encoding of params

app.get("/",(req: Request , res: Response) =>
{
    return res.send("hello worlds");
})

app.use('/',router);


app.listen(port_number, ()=>{
    console.log("Application listening at http://localhost:"+port_number);
    //console.log(getAllEmployees()); // typeof object
});