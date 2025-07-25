
const dotenv=require('dotenv');
const app=require('./app');
const connectDb=require('./config/db');

dotenv.config();

connectDb();

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server running on PORT:${PORT}`);
});
