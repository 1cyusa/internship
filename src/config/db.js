import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect:'mysql'
    }
)

export const connectToDatabase = async () => {
    try{
        await sequelize.authenticate();
        console.log('connection has been established successfully');
        return { success:true , message: 'connection to database has been successfull' }
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        return { success:false , message: 'connection failed' }
    }
}
export default sequelize