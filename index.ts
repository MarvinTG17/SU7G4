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
app.post("/createUser", async (req: Request,res: Response) => {
    const { name, email, password,dateborn} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await prisma.usuarios.create({
        data: {
          name: name,
          email:email,
          password: passwordHash,
          date_born:dateborn
        },
    }); 
    // Retorna la informacion
    res.json(result)
});

app.get("/users", async (req: Request,res: Response) => {
    const user = await prisma.usuarios.findMany();
    return res.json(user);
});

// crear Playlist
app.post("/createPlaylist", async (req: Request,res: Response) => {
    const { name, useremail} = req.body;
    const result = await prisma.playlist.create({
        data: {
          name: name,
          user: {connect: {email :useremail}},
        },
    });
    res.json(result)    
});


// Crear canciones
app.post("/createSong", async (req: Request,res: Response) => {
    const {name, artist, album, year, genre, duration, nameplaylist } = req.body;
    const result = await prisma.song.create({
        data: {
          name: name,
          artist:artist,
          album:album,
          year:year,
          genre:genre,
          duration:duration,
          playlist: {connect: {name:nameplaylist}},
        },
    });
    res.json(result)        
});

// listar playlist
app.get("/playlists", async (req: Request,res: Response) => {
    const songs = await prisma.playlist.findMany({select:{
        id:true,
        name:true,
        userId: true,
        songs:true
    }});
    return res.json(songs);
});


//listar canciones
app.get("/songs", async (req: Request,res: Response) => {
    const songs = await prisma.song.findMany();
    return res.json(songs);
});

// buscar cancion por id
app.post('/songs/:id', async (req:Request, res:Response) => {
    const {id} = req.params 
    const songs = await prisma.song.findUnique({
      where :{
        id: Number(id)
      },
      select:{
        id:true,
        name: true,
        artist: true,
        album: true
      }
    });
    res.json(songs);
});

//Crear Login
app.post("/login",async (req:Request, res:Response) => {
    const {email,password} = req.body;
    const user = await prisma.usuarios.findUnique({
      where :{
        email:email,
      }
    });
    if (user) {
      const validatePassword = await bcrypt.compare(password, user?.password as string)
      //console.log(validatePassword)
      validatePassword ? res.json("Usuario logueado") : res.json("Contraseña incorrecta")
    }else{
      res.json("El email no existe")
    }
})




// la funcion flecha es anonima
app.listen(port, () =>{

    console.log(`Aplicación de ejemplo en el puerto ${port}`);
    console.log(`http://localhost:${port}`);

});










