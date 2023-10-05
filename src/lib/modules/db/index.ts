/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import ConfigInterface from '../../../types/interfaces/config';
import LoggerInterface from "../../../types/interfaces/logger";

class DBConnection{
    logger: LoggerInterface;
    mongoose: typeof mongoose;
    mongod: any;
    dbUrl: string

    constructor(logger: LoggerInterface) {
        this.logger = logger
        this.mongoose = mongoose;
        this.dbUrl = '';
    }

    private connectForTest = async () => {
        if (process.env.NODE_ENV === 'test') {
            this.mongod = await MongoMemoryServer.create();
            this.dbUrl = this.mongod.getUri();
        }
    }

    connect = async ({config} : {config: ConfigInterface}) => {
        try{
            this.dbUrl = config.db.url;
            this.connectForTest();
            await this.mongoose.connect(this.dbUrl);
            this.mongoose.connection.once('open', (err)=>{
                this.logger.info(`${config.name} database connected successfully`);
            })
        }catch(err){
            this.logger.error(`Error: ${err}`);

            setTimeout(()=>{
                process.exit(1);
            }, 5000);
        }
    }

    close = async () => {
        try {
            await this.mongoose.connection.close();
            if (this.mongod) {
              await this.mongod.stop();
            }
          } catch (err) {
            console.log(err);
            process.exit(1);
          }
    }
}

export default DBConnection;