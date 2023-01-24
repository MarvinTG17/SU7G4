import express, {Express,Request,Response} from "express"
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

dotenv.config();

const prisma = new PrismaClient()

const app:Express = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req:Request, res:Response) => {
  res.send('INICIO DEL PROYECTO');
});

//Crear usuarios
app.post("/createUser",async (req:Request, res:Response) => {
  const {email,name,password} = req.body;
  //console.log(hashedPassword)
  const hashedPassword = await bcrypt.hash(password,10)
  const createUser = await prisma.user.create({
    data:{
      email:email,
      name:name,
      password:hashedPassword 
    }
  });
  res.json(createUser);
})

//Listar usuarios
app.get('/users', async (req:Request, res:Response) => {
  const users = await prisma.user.findMany({
    select:{
      id: true,
      name: true,
      email:true,
      password:true
    }
  });
  res.json(users);
});

//Crear musica
app.post("/createSong",async (req:Request, res:Response) => {
  const {name,artist,album,year,duration,genre} = req.body;
  const song = await prisma.song.create({
    data:{
      name: name,
      artist: artist,
      album:  album,
      year: year,
      duration: duration,
      genre:  genre
    }
  });
  res.json(song);
})

//Listar Musica
app.get('/songs', async (req:Request, res:Response) => {
  const songs = await prisma.song.findMany({
    select:{
      name: true,
      artist: true,
      album: true,
      year: true,
      genre: true
    }
  });
  res.json(songs);
});

//Crear Lista de musica
app.post("/createPlaylist",async (req:Request, res:Response) => {
  const {name,usuario} = req.body;
  const playlist = await prisma.playlist.create({
    data:{
      name: name,
      usuario:  { connect: { id: usuario } },
    }
  });
  res.json(playlist);
})

//Listar Playlist
app.get('/playlists', async (req:Request, res:Response) => {
  const playlist = await prisma.playlist.findMany({
    select:{
      id: true,
      name: true,
      userId: true,
      songs:{
        select:{
          musica:true
        }
      }
    }
  });
  res.json(playlist);
});

//Buscar playlist por id
app.post('/songs/:id', async (req:Request, res:Response) => {
  const {id} = req.params  
  const playlist = await prisma.song.findUnique({
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
  res.json(playlist); 
});

//Agregar musica en lista
app.post("/addSongPlaylist",async (req:Request, res:Response) => {
  const {playlist,song} = req.body;
  const addSong = await prisma.addSongPlaylist.create({
    data:{
      songId: song,
      playlistId:playlist
    }
  });
  res.json(addSong);
})

//Crear Login
app.post("/login",async (req:Request, res:Response) => {
  const {email,password} = req.body;
  const user = await prisma.user.findUnique({
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

/*-------------------------------------------------------------*/
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});