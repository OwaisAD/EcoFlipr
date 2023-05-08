import startServer from "../app";
import request from "supertest"
import { cityResolver } from "../graphql/resolvers/city.resolver";
import City from "../models/city";
import mongoose, { Error } from "mongoose";
import {PORT,MONGO_URI} from "../utils/config"
import Category from "../models/category";
import SaleOffer from "../models/saleoffer";
import Thread from "../models/thread";
import User from "../models/user";
import Comment from "../models/comment";
import bcrypt from "bcrypt";



beforeAll(async() => {

    await startServer();


//Move to none resolvers
//     const URL = MONGO_URI || "";
//   mongoose.set("strictQuery", false);

    // await mongoose
    //     .connect(URL)




    await City.deleteMany({});
    await Category.deleteMany({});

    //Should be debugged later (namespace error sometimes):
    // await mongoose.connection.collections["cities"].drop()
    // await mongoose.connection.collections["categories"].drop()
    // await mongoose.connection.collections["users"].drop()
    // await mongoose.connection.collections["saleoffers"].drop()
    // await mongoose.connection.collections["threads"].drop()
    // await mongoose.connection.collections["comments"].drop()
}) 

beforeEach(async() => {
    await SaleOffer.deleteMany({});
    await Thread.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});

})

afterEach(() => {

})

afterAll( async() => {
    await mongoose.disconnect();
})

test('example', async() => {
    
    expect(await City.findOne({ zip_code: 2800 })).toBeNull()
})

test('example 2', async () => {
   await User.create({
    first_name: "Leon",
    last_name:"Løve",
    address:"Gaden 4",
    phone_number:"12345678",
    email:"l@live.dk",
    passwordHash:await bcrypt.hash("test1234", 10)

   })
    const queryData = {
        operationName: "Mutation",//possibly remove
        query:`
        mutation Mutation($input: UserLoginInput) {
            login(input: $input) {
              jwtToken
            }
          }
        `,
          variables:{
            "input": {
              "email": "l@live.dk",
              "password": "test1234"
            }
          }
    }
    const response = await request("http://localhost:3004/graphql").post("").send(queryData);
    // console.log('Response',response.statusCode);
    
    expect(response.statusCode).toBe(200);
    expect(response.body?.data?.login?.jwtToken).toBeTruthy()
    
    
    
})
