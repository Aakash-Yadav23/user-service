import express, { Application, Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

export class ExpressApp {
  public express: Express;
  constructor() {
    this.express = express();
    this.setupMiddleware();
    this.setupDatabase();
  }

 

  private setupMiddleware() {
    this.express.use(helmet()); 
    this.express.use(compression()); 
    this.express.use(morgan('combined'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
  }

  private setupDatabase() {

  }
}