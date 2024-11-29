import { DataSource } from "typeorm";
import { dbConnection } from "../src/config/dbConnection";
let request = require("supertest");
import app from "../src/app";
import { settings } from "../src/config/settings";
import AppUtil from "../src/util/AppUtil";
import ConfirmationType from "../src/entities/ConfirmationType";

let connection : DataSource;
let server : any;
let tokenAdministrator : string;
let tokenUser : string;
let administratorUserId : string;

beforeAll(async() => {
    let response : any;
    connection = await dbConnection.initialize();
    server = app.listen(settings.TESTS.PORT);

    //get token administrator
    response = await request(app).post('/api/1/users/auth').send({
        email: settings.TESTS.USERS.ADMINISTRATOR.EMAIL,
        password: settings.TESTS.USERS.ADMINISTRATOR.PASSWORD
    });
    tokenAdministrator = response.body?.token ?? response.body.token;
    administratorUserId = response.body?.user?.id ?? response.body.user.id;

    //get token user
    response = await request(app).post('/api/1/users/auth').send({
        email: settings.TESTS.USERS.USER.EMAIL,
        password: settings.TESTS.USERS.USER.PASSWORD
    });
    tokenUser = response.body?.token ?? response.body.token;
});

afterAll(async() => {
    //trava de tempo para ter o tempo de gerar histórico de requisição
    await new AppUtil().sleep(100);

    await connection.close();
    await server.close();
});

describe('getAll', () => {
    let confirmationType : ConfirmationType = new ConfirmationType();

    beforeAll(async() => {
        confirmationType.id = '123';
        confirmationType.name = "getAllConfirmationTypeTest";
        confirmationType.createdByUserId = administratorUserId;
        confirmationType.createdDate = new Date();

        confirmationType = await confirmationType.save();
    });

    afterAll(async() => {
        await confirmationType.remove();
    });

    it('should list confirmations types for admin', async() => {
        const response = await request(app).get('/api/1/confirmation-types').set('Authorization', 'Bearer ' + tokenAdministrator);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should not list confirmations types for user', async() => {
        const response = await request(app).get('/api/1/confirmation-types').set('Authorization', 'Bearer ' + tokenUser);
        expect(response.statusCode).toBe(405);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should list confirmations types by name for admin', async() => {
        const response = await request(app).get('/api/1/confirmation-types?name=' + confirmationType.name).set('Authorization', 'Bearer ' + tokenAdministrator);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length === 1).toBe(true);
    });

    it('should return an empty list confirmations types by name for admin', async() => {
        const response = await request(app).get('/api/1/confirmation-types?name=00000').set('Authorization', 'Bearer ' + tokenAdministrator);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length === 0).toBe(true);
    });
});

describe('getById', () => {
    let confirmationType : ConfirmationType = new ConfirmationType();

    beforeAll(async() => {
        confirmationType.id = '123';
        confirmationType.name = "test";
        confirmationType.createdByUserId = administratorUserId;
        confirmationType.createdDate = new Date();

        confirmationType = await confirmationType.save();
    });

    afterAll(async() => {
        await confirmationType.remove();
    });

    it('should return confirmation type by id for admin', async() => {
        const response = await request(app).get('/api/1/confirmation-types/' + confirmationType.id).set('Authorization', 'Bearer ' + tokenAdministrator);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
    });

    it('should not return confirmation type by id for user', async() => {
        const response = await request(app).get('/api/1/confirmation-types/' + confirmationType.id).set('Authorization', 'Bearer ' + tokenUser);
        expect(response.statusCode).toBe(405);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe('insert', () => {
    let confirmationType : ConfirmationType = new ConfirmationType();

    afterEach(async() => {
        if(confirmationType?.id !== undefined){
            confirmationType = await confirmationType.remove();
        }
    });

    it('should save confirmation type for admin', async() => {
        const response = await request(app)
                                .post('/api/1/confirmation-types')
                                .set('Authorization', 'Bearer ' + tokenAdministrator)
                                .send({ name: 'confirmationTypeTest'});
        expect(response.statusCode).toBe(201);
        expect(response.body).toBeTruthy();
        expect(response.body.name).toBe('confirmationTypeTest');

        confirmationType.id = response.body.id;
    });

    it('should not save confirmation type for user', async() => {
        const response = await request(app)
                                .post('/api/1/confirmation-types')
                                .set('Authorization', 'Bearer ' + tokenUser)
                                .send({ name: 'confirmationTypeTest'});
        expect(response.statusCode).toBe(405);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return error if the name is not informed', async() => {
        const response = await request(app)
                                .post('/api/1/confirmation-types')
                                .set('Authorization', 'Bearer ' + tokenAdministrator)
                                .send({ name: '' });
        expect(response.statusCode).toBe(422);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.includes('O nome é de preenchimento obrigatório!')).toBe(true);
    });

    it('should return error if name exists', async() => {
        let response = await request(app)
                                .post('/api/1/confirmation-types')
                                .set('Authorization', 'Bearer ' + tokenAdministrator)
                                .send({ name: 'confirmationTypeTest'});

        confirmationType.id = response.body.id;

        response = await request(app)
                                .post('/api/1/confirmation-types')
                                .set('Authorization', 'Bearer ' + tokenAdministrator)
                                .send({ name: 'confirmationTypeTest'});
        expect(response.statusCode).toBe(422);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.includes('Já existe um registro cadastrado com o nome confirmationTypeTest')).toBe(true);
    });
});

describe('update', () => {
    let confirmationType : ConfirmationType = new ConfirmationType();
    let confirmationTypev2 : ConfirmationType = new ConfirmationType();

    beforeEach(async() => {
        confirmationType.id = '123';
        confirmationType.name = "test";
        confirmationType.createdByUserId = administratorUserId;
        confirmationType.createdDate = new Date();

        confirmationType = await confirmationType.save();

        confirmationTypev2.id = '1234';
        confirmationTypev2.name = "test2";
        confirmationTypev2.createdByUserId = administratorUserId;
        confirmationTypev2.createdDate = new Date();

        confirmationTypev2 = await confirmationTypev2.save();
    });

    afterEach(async() => {
        await confirmationType.remove();
        await confirmationTypev2.remove();
    });

    it('should update confirmation type for admin', async() => {
        const response = await request(app)
                                .put('/api/1/confirmation-types/' + confirmationType.id)
                                .set('Authorization', 'Bearer ' + tokenAdministrator)
                                .send({ name: 'confirmationTypeTest' });
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.id).toBe(confirmationType.id);
        expect(response.body.name).toBe('confirmationTypeTest');
    });

    it('should not update confirmation type for user', async() => {
        const response = await request(app)
                                .put('/api/1/confirmation-types/' + confirmationType.id)
                                .set('Authorization', 'Bearer ' + tokenUser)
                                .send({ name: 'confirmationTypeTest'});
        expect(response.statusCode).toBe(405);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return error if the name is not informed', async() => {
        const response = await request(app)
                                .put('/api/1/confirmation-types/' + confirmationType.id)
                                .set('Authorization', 'Bearer ' + tokenAdministrator)
                                .send({ name: '' });
        expect(response.statusCode).toBe(422);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.includes('O nome é de preenchimento obrigatório!')).toBe(true);
    });

    it('should return error if name exists', async() => {
        let response = await request(app)
                                .put('/api/1/confirmation-types/' + confirmationType.id)
                                .set('Authorization', 'Bearer ' + tokenAdministrator)
                                .send({ name: 'test2'});

        expect(response.statusCode).toBe(422);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.includes('Já existe um registro cadastrado com o nome test2')).toBe(true);
    });

    it('should return error if id not exists', async() => {
        const response = await request(app)
                                .put('/api/1/confirmation-types/0')
                                .set('Authorization', 'Bearer ' + tokenAdministrator)
                                .send({});
        expect(response.statusCode).toBe(422);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.includes('O id informado é inválido!')).toBe(true);
    });
});

describe('delete', () => {
    let confirmationType : ConfirmationType = new ConfirmationType();

    beforeEach(async() => {
        confirmationType.id = '123';
        confirmationType.name = "test";
        confirmationType.createdByUserId = administratorUserId;
        confirmationType.createdDate = new Date();

        confirmationType = await confirmationType.save();
    });

    afterEach(async() => {
        await confirmationType.remove();
    });

    it('should delete confirmation type for admin', async() => {
        const response = await request(app)
                                .delete('/api/1/confirmation-types/' + confirmationType.id)
                                .set('Authorization', 'Bearer ' + tokenAdministrator);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
    });

    it('should not delete confirmation type for user', async() => {
        const response = await request(app)
                                .delete('/api/1/confirmation-types/' + confirmationType.id)
                                .set('Authorization', 'Bearer ' + tokenUser);
        expect(response.statusCode).toBe(405);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return error if id not exists', async() => {
        const response = await request(app)
                                .delete('/api/1/confirmation-types/0')
                                .set('Authorization', 'Bearer ' + tokenAdministrator);
        expect(response.statusCode).toBe(422);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.includes('O id informado é inválido!')).toBe(true);
    });
});