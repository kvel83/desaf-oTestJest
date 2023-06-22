const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
    describe("GET /cafes/", () =>{
        it("Valida estado 200 y tipo de dato recibido", async() => {
            const response = await request(server).get("/cafes");
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.every(item => typeof item === 'object')).toBe(true);
        });
        it("Valida que encuentra un cafe por su id", async() => {
            const response = await request(server).get("/cafes/1");
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        });
        it("Valida error 404 cuando no encuentra un cafe", async() => {
            const response = await request(server).get("/cafes/5");
            expect(response.status).toBe(404);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBe("No se encontró ningún cafe con ese id")
        })
    } );
    describe("POST /cafes", () => {
        const newCoffe = {
            "id": 5,
            "nombre": "Irlandés"
        };
        const repeteadCoffe = {
            "id": 1,
            "nombre": "Irlandés"
        }
        it("Valida inserción de un nuevo café", async() => {
            const response = await request(server).post("/cafes").send(newCoffe);
            expect(response.status).toBe(201);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.every(item => typeof item === 'object')).toBe(true);
        });
        it("Valida error 400 al insertar un cafe que ya existe", async() => {
            const response = await request(server).post("/cafes").send(repeteadCoffe);
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBe("Ya existe un cafe con ese id")
        })
    });
    describe("PUT /cafes/:id", () => {
        const repeteadCoffe = {
            "id": 1,
            "nombre": "Irlandés"
        }
        const nonExistingCoffe = {
            "id": 9,
            "nombre": "Irlandés"
        }
        it("Valida error 400 si se actualiza un cafe con id incorrecto en payload", async() => {
            const response = await request(server).put("/cafes/2").send(repeteadCoffe);
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBe("El id del parámetro no coincide con el id del café recibido")
        });
        it("Valida correct actuallizacion de cafe", async() => {
            const response = await request(server).put("/cafes/1").send(repeteadCoffe);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.every(item => typeof item === 'object')).toBe(true);
        });
        it("Valida error 404 al no encontrar el id del café", async() => {
            const response = await request(server).put("/cafes/9").send(nonExistingCoffe);
            expect(response.status).toBe(404);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBe("No se encontró ningún café con ese id")
        })
    });
    describe("DELETE /cafes/:id",() => {
        const nonExistingCoffe = {
            "id": 8,
            "nombre": "Irlandés"
        };
        const existingCoffe = {
            "id": 1,
            "nombre": "Irlandés"
        }
        it("Valida error 400 al no se envió ningún token", async() => {
            const response = await request(server).delete("/cafes/8").send(nonExistingCoffe);
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBe("No recibió ningún token en las cabeceras")
        });
        it("Valida error 404 no se encontro ningun cafe al eliminar", async() => {
        const response = await request(server).delete("/cafes/8").set('Authorization', 'Bearer token').send(nonExistingCoffe);
        expect(response.status).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.message).toBe("No se encontró ningún cafe con ese id")
        });
        it("Valida correcta eliminación de café",async() => {
            const response = await request(server).delete("/cafes/1").set('Authorization', 'Bearer token').send(existingCoffe);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body.every(item => typeof item === 'object')).toBe(true);
        })
    });
    describe("Valida error 404 para rutas no existentes", () => {
        it("Valida error 404 de ruta no encontrada", async() => {
            const response = await request(server).delete("/cafe");
            expect(response.status).toBe(404);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.message).toBe("La ruta que intenta consultar no existe")
        })
    });
});
