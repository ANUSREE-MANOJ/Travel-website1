import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from './asyncHandler.js'

const authenticate= asyncHandler(async(req,res,next)=>{
     let token;

     // read jwt from the 'jwt' cookie
     token =req.cookies.jwt
     
     if(token)
        {
            try{
                const decoded = jwt.verify(token,process.env.JWT_SECRET)
                 req.user = await User.findById(decoded.userId).select('-password')
                 next();
            }
            
            catch(error){
            res.status(401)
             throw new Error("Not authorized , token failed")
            }

        }
        else{
            res.status(401)
            throw new Error("Not authorized , no token ")

        }
})

// check user as an admin

const autherizeAdmin =(req,res,next)=>{
       if(req.user && req.user.isAdmin){
        next()
       }
       else{
        res.status(401).send("Not autherized as an admin")
       }
}


const autherizeAgent=(req,res,next)=>{
    if(req.user && req.user.userType === "travelAgent"){
        next()
    }
    else{
        res.status(401).send("Not autherized as an agent")


    }

}
export { authenticate,autherizeAdmin , autherizeAgent}
