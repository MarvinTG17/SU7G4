"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('INICIO DEL PROYECTO');
});
//Crear usuarios
app.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    //console.log(hashedPassword)
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const createUser = yield prisma.user.create({
        data: {
            email: email,
            name: name,
            password: hashedPassword
        }
    });
    res.json(createUser);
}));
//Listar usuarios
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            password: true
        }
    });
    res.json(users);
}));
//Crear musica
app.post("/createSong", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, artist, album, year, duration, genre } = req.body;
    const song = yield prisma.song.create({
        data: {
            name: name,
            artist: artist,
            album: album,
            year: year,
            duration: duration,
            genre: genre
        }
    });
    res.json(song);
}));
//Listar Musica
app.get('/songs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield prisma.song.findMany({
        select: {
            name: true,
            artist: true,
            album: true,
            year: true,
            genre: true
        }
    });
    res.json(songs);
}));
//Crear Lista de musica
app.post("/createPlaylist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, usuario } = req.body;
    const playlist = yield prisma.playlist.create({
        data: {
            name: name,
            usuario: { connect: { id: usuario } },
        }
    });
    res.json(playlist);
}));
//Listar Playlist
app.get('/playlists', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const playlist = yield prisma.playlist.findMany({
        select: {
            id: true,
            name: true,
            userId: true,
            songs: {
                select: {
                    musica: true
                }
            }
        }
    });
    res.json(playlist);
}));
//Buscar playlist por id
app.post('/songs/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const playlist = yield prisma.song.findUnique({
        where: {
            id: Number(id)
        },
        select: {
            id: true,
            name: true,
            artist: true,
            album: true
        }
    });
    res.json(playlist);
}));
//Agregar musica en lista
app.post("/addSongPlaylist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { playlist, song } = req.body;
    const addSong = yield prisma.addSongPlaylist.create({
        data: {
            songId: song,
            playlistId: playlist
        }
    });
    res.json(addSong);
}));
//Crear Login
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: {
            email: email,
        }
    });
    if (user) {
        const validatePassword = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        //console.log(validatePassword)
        validatePassword ? res.json("Usuario logueado") : res.json("Contraseña incorrecta");
    }
    else {
        res.json("El email no existe");
    }
}));
/*-------------------------------------------------------------*/
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
