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

let city : any;
let category: any;
let user: any;
let token: any;

async function createLoggedinUser(){
    const user = await createUser();
    const userToken = await login(user.email)
    return [user,userToken]
}

async function createUser(email:string="l@live.dk") {
     return await User.create({
        first_name: "Leon",
        last_name:"Løve",
        address:"Gaden 4",
        phone_number:"12345678",
        email:email,
        passwordHash:await bcrypt.hash("test1234", 10)
})
}
    
async function createCity(name="Helsingør",zip_code="3000"){
    return await City.create({
        zip_code,
        name,
    })
}

async function createCategory(name="Books"){
    return await Category.create({name});
}

async function createSaleOffer() {
  const saleOffer = await SaleOffer.create({
    "creator_id": user.id,
    "price": 129,
    "is_shippable": true,
    "imgs": null,
    "description": "Nice big Book",
    "city": city,
    "category": category
  })
  user.sale_offers.push(saleOffer);
      await user.save();
      return saleOffer;
}

function createCommentQuery(saleOfferId:any,comment:string,threadId:string | null=null){
  return {
    query: `
    mutation CreateComment($input: CommentInput) {
      createComment(input: $input) {
        is_read
        thread_id
        content
        author_id
        id
      }
    }
    `,
    variables:{
        "input": {
          "threadId": threadId,
          "saleOfferId": saleOfferId,
          "content": comment
      }
    }
  }
}

function createSaleofferQuery(cityId=city.id, categoryId=category.id) {
  return {
     query:`
    mutation CreateSaleOffer($input: SaleOfferInput) {
      createSaleOffer(input: $input) {
        description
        creator_id
      }
    }
    `,
      variables:{
        "input": {
          "price": 129,
          "is_shippable": true,
          "imgs": null,
          "description": "Nice big Book",
          "city": {"id": cityId},
          "category": {"id":categoryId}
        }
      }
  }}

  async function createRequest(queryData:{}, jwt=token){

    return await request("http://localhost:3004/graphql")
    .post("")
    .send(queryData)
    .set({ 'Authorization':`Bearer ${jwt}`, Accept: 'application/json' })
  }

 async function login(email:string): Promise<string> {
    const queryData = {
      query: `
        mutation LoginMutation($input: UserLoginInput) {
          login(input: $input) {
            jwtToken
          }
        }
      `,
      variables: {
        input: {
          email: email,
          password: "test1234",
        },
      },
    };

    const response = await request("http://localhost:3004/graphql").post("").send(queryData);
  
    if (response.statusCode !== 200) {
      throw new Error(`Invalid response status code: ${response.statusCode}`);
    }
    const jwtToken = response.body?.data?.login?.jwtToken;
  
    if (!jwtToken) {
      throw new Error('JWT token not found in response body');
    }
    return jwtToken;
  }
  

beforeAll(async() => {
    await startServer();
    await City.deleteMany({});
    await Category.deleteMany({});

    city = await createCity();
    category = await createCategory();
    
 
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

    [user,token] = await createLoggedinUser();
})

afterAll( async() => {
    await mongoose.disconnect();
})

test('createSaleOffer', async () => {
  const saleOfferQuery = createSaleofferQuery();

  const response = await createRequest(saleOfferQuery);
  
  expect(response.body.data.createSaleOffer.creator_id).toBe(user.id)
})

test('addCommentToSaleOffer', async () => {
  
  const saleOffer = await createSaleOffer();
  const commentQuery = createCommentQuery(saleOffer.id,"Har du stadig til salg?");
  const buyer = await createUser("bo@live.dk");
  const buyerJWT = await login(buyer.email);

  await createRequest(commentQuery, buyerJWT);
  const saleOfferFromDB = await SaleOffer.findById(saleOffer.id);
  
  expect(saleOfferFromDB?.threads.length).toBe(1);
})

//Lav test:
// hvor jeg markere en komentar som læst
// hvor en sælger knytter endnu en kommentar
// sletter et saleoffer
// sletter en bruger som sælger
// sletter en bruger som bare vil købe