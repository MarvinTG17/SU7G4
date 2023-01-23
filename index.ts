import express, {Express,Request,Response} from 'express';
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";


const prisma = new PrismaClient();



dotenv.config();



const app: Express = express();
const port = process.env.PORT;

app.use(express.json());


// primera ruta
app.get('/', (req: Request, res: Response) => {

    res.send('HOLA!!');

});




// crear Usuarios
app.post("/user", async (req: Request,res: Response) => {

    const { name, email, password,date_born} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await prisma.usuarios.create({
        data: {
          name: name,
          email:email,
          password: passwordHash,
          date_born: date_born,
          
        },
    }); 
    // Retorna la informacion
    res.json(result)
});



// crear Playlist
app.post("/playlist", async (req: Request,res: Response) => {

    const { name, useremail  } = req.body;
    const result = await prisma.playlist.create({
        data: {
          name: name,
          user: {connect: {email :useremail }},
        },
    });
    res.json(result)    
});


// crear canciones
app.post("/songs", async (req: Request,res: Response) => {
    const {name, artist, album, year, genre, duration, nameplaylist } = req.body;
    const result = await prisma.song.create({
        data: {
          name: name,
          artist:artist,
          album:album,
          year:year,
          genre:genre,
          duration:duration,
          playlist: {connect: {name :nameplaylist}},
        },
    });
    res.json(result)         
    
});













exports.create_song = async(req:Request,res:Response)=>{
    const { name, artist,album,year,genre,duration,namePlaylist } = req.body;
    const result = await prisma.song.create({
        data: {
          name: name,
          artist:artist,
          album:album,
          year:year,
          genre:genre,
          duration:duration,
          playlist: {connect: {name :namePlaylist}},
        },
    });
    return res.json(result);      
};








// la funcion flecha es anonima
app.listen(port, () =>{

    console.log(`Aplicación de ejemplo en el puerto ${port}`);

});










