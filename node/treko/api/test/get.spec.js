import chai from "chai";
import chaiHttp from "chai-http";
import { before } from "mocha";
import taskModel from "../models/task";

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request(app);
const expect = chai.expect;

describe("get", () => {
  context("quando eu tenho tarefas cadastradas", () => {
    before((done) => {
      let tasks = [
        {
          title: "Estudar NodeJs",
          email: "anderson.io@gmail.com",
          done: false,
        },
        { title: "Fazer compras", email: "anderson.io@gmail.com", done: false },
        {
          title: "Estudar MongoDB",
          email: "anderson.io@gmail.com",
          done: true,
        },
      ];
      taskModel.insertMany(tasks);
      done();
    });

    it("deve retornar uma lista", (done) => {
        request
        .get('/task')
        .end((err, res) => {
            expect(res).to.has.status(200);
            expect(res.body.data).to.be.an('array')
        })
        done();
    });
  });
});
