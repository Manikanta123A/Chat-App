import { User } from "../Models/usermodel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


export const register  = async(req, res) =>{
    try {
        const {fullName, userName, password, confirmPassword , gender} = req.body;

        if ( !fullName ||  !userName || !password || !confirmPassword || !gender ) {
            return res.status(400).json({message : "All Fields are Required"});
        }

        if ( password != confirmPassword){
            return res.status(400).json({message : "Password , do not match"});
        }
        const user = await User.findOne({userName});

        if ( user ) {
            return res.status(400).json({message : "Try with different user name"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?userName=${userName}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?userName=${userName}`
        await User.create({
            fullName,
            userName, 
            password : hashedPassword,
            profilePhoto : gender === "male" ? maleProfilePhoto:femaleProfilePhoto,
            gender
        })
        return res.status(200).json({message: "Account created sucessfully", sucess : "true"})
    } catch (error){
        console.log("Some Error")
    }
}

export const login = async (req, res) =>{
    try {
        const {userName, password} = req.body;

        if ( !userName || !password ) {
            return res.status(400).json({message:"All fields are required"})
        }

        const user = await User.findOne({userName})
        if (!user) {
            return res.status(400).json({message : "User not found "})
        }
        const isPassword = await bcrypt.compare(password, user.password)


        if (!isPassword) {
            return res.status(400).json({message:"Incorrect Password"})
        }
        
        const webtoken = { userId: user._id };

        const token = await jwt.sign(webtoken, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res
            .status(200)
            .cookie("token", token, { maxAge: 86400000, httpOnly: true, sameSite: "strict" })
            .json({ _id: user._id, userName: user.userName, sucess:true , user : user });
    }
    catch (error) {
        console.log(error)
    }
}

export const logout = (req, res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({message : "Sucessfully logged out"})
    }
    catch(error){
        console.log(error)
    }
}

export const getOtherUsers = async (req, res)=>{
    try{
        const loggedInId = req.id;
        const otherUsers = await User.find({_id:{$ne:loggedInId}}).select("-password");
        return res.status(200).json({message:otherUsers});
    }
    catch(error){
        console.log(error)
    }
}