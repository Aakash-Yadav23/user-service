import express, { Application, Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from '../schemas';
import { resolvers } from '../resolvers';
import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import { connectDb } from '../config/connectDb';

export class ExpressApp {
  public express: Express;
  private server?: ApolloServer;

  constructor() {
    this.express = express();
    this.setupMiddleware();
    this.setupDatabase();

  }



  private setupMiddleware() {
    this.express.use(helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }));
    this.express.use(compression());
    // this.express.use(morgan('combined'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.setupGraphl();
    this.setupDatabase();

  }

  private setupGraphl = async () => {
    this.server = new ApolloServer({
      typeDefs: typeDefs,
      resolvers: resolvers,

      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
      ],

    });

    await this.server.start();


    this.express.use('/graphql', expressMiddleware(this.server, {
      context: async ({ req, res }) => ({
        req,
        res,
        userAgent: req.headers['user-agent'],
        token: req.cookies?.token || null
      }),
    }));


    this.express.get('/', (req: Request, res: Response) => {
      res.send('Welcome to the GraphQL API. Please use the /graphql endpoint.');
    });

  }


  private setupDatabase = async () => {

    await connectDb();

  }
}