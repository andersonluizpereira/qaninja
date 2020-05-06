import chai from "chai";
import chaiHttp from "chai-http";
import { before } from "mocha";
import taskModel from "../models/task";

chai.use(chaiHttp);

const app = require("../app");
const request = chai.request.agent(app);
const expect = chai.expect;

before((done) => {
  taskModel.deleteMany({});
  done();
});

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
      request.get("/task").end((err, res) => {
        expect(res).to.has.status(200);
        expect(res.body.data).to.be.an("array");
      });
      done();
    });
    it("deve filtrar por palavra chave", (done) => {
      request
        .get("/task")
        .query({ title: "Estudar" })
        .end((err, res) => {
          expect(res).to.has.status(200);
          expect(res.body.data[0].title).to.equal("Estudar NodeJs");
          expect(res.body.data[1].title).to.equal("Estudar MongoDB");
        });
      done();
    });
  });

  context("quando busco por id", () => {
    it("deve retornar uma única tarefa", (done) => {
      let tasks = [
        {
          title: "Ler um livro de Javascript",
          email: "andy2903.alp@gmail.com",
          done: false,
        },
      ];
      taskModel.insertMany(tasks, (err, result) => {
        let id = result[0]._id;
        request.get("/task/" + id).end((err, res) => {
          expect(res).to.has.status(200);
          expect(res.body.data[0].title).to.equal(tasks[0].title);
          done();
        });
      });
    });
  });

  context("quando a tarefa nao exite", () => {
    it("deve retornar 404", (done) => {
      let id = require("mongoose").Types.ObjectId();
      console.log('id ', id)
      request.get("/task/" + id).end((err, res) => {
        expect(res).to.has.status(404);
        expect(res.body).to.eql({});
        done();
      });
    });
  });
});
