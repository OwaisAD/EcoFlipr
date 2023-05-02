import User from "../models/user"
import jwt from "jsonwebtoken"

const getUser = async (token:string) => {
    try {
        if(token) {
            let newT = token.replace("Bearer ", "")
            //@ts-ignore
            const user = jwt.verify(newT, process.env.SECRET)
            return user
        }
    } catch (error) {
        return null
    }
}

const context = async ({req,res}: any) => {
  if(req.body.operationName === "CreateUser" || 
  req.body.operationName === "Login"
  ){return {}}

  const token = req.headers.authorization || null

  if(!token || !token.startsWith("Bearer ")) {
    throw new Error("User is not Authenticated")
  }

      const user = await getUser(token)
      if(!user) {
        throw new Error("User is not Authenticated")
      }
    
      return {user}
}

export default context