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
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
// primera ruta
app.get('/', (req, res) => {
    res.send('HOLA!!');
});
// crear Usuarios
app.post("/createUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, dateborn } = req.body;
    const passwordHash = yield bcryptjs_1.default.hash(password, 10);
    const result = yield prisma.usuarios.create({
        data: {
            name: name,
            email: email,
            password: passwordHash,
            date_born: dateborn
        },
    });
    // Retorna la informacion
    res.json(result);
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.usuarios.findMany();
    return res.json(user);
}));
// crear Playlist
app.post("/createPlaylist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, useremail } = req.body;
    const result = yield prisma.playlist.create({
        data: {
            name: name,
            user: { connect: { email: useremail } },
        },
    });
    res.json(result);
}));
// crear canciones
app.post("/createSong", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, artist, album, year, genre, duration, nameplaylist } = req.body;
    const result = yield prisma.song.create({
        data: {
            name: name,
            artist: artist,
            album: album,
            year: year,
            genre: genre,
            duration: duration,
            playlist: { connect: { name: nameplaylist } },
        },
    });
    res.json(result);
}));
// listar playlist
app.get("/playlists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield prisma.playlist.findMany({ select: {
            id: true,
            name: true,
            userId: true,
            songs: true
        } });
    return res.json(songs);
}));
//listar canciones
app.get("/songs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield prisma.song.findMany();
    return res.json(songs);
}));
// buscar cancion por id
app.post('/songs/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const songs = yield prisma.song.findUnique({
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
    res.json(songs);
}));
//Crear Login
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.usuarios.findUnique({
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
// la funcion flecha es anonima
app.listen(port, () => {
    console.log(`Aplicación de ejemplo en el puerto ${port}`);
    console.log(`http://localhost:${port}`);
});
