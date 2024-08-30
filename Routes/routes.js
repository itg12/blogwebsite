const express = require('express')
const app = express()
const router = express.Router()
const nodemailer = require('nodemailer')
const AuthenticateUser = require('../Middlewares/Auth.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../Models/UserSchema')
const Blogs = require('../Models/CreateBlogSchema.js')
const upload = require('../Middlewares/UploadImage.js')


// Signup Route

router.post('/signup', async (req,res)=>{
    const {name, email, password} = req.body

    try{

        if(!name || !email ||  !password){
            return res.status(502).json({message:"Please fill the field properly"})
        }

        const userExist = await User.findOne({email: email})
    
        if(userExist){
            return res.status(422).json({error: "User already Registered."});
        }

        if(!req.body.email.includes('@gmail.com')){
            return res.status(430).json({error: 'Enter valid email'})
        }

        if(req.body.password.length<8){
            return res.status(500).json({error: "Password should be greater than 8 characters."})               
        }

    
        // Now on this step i will hash the user password and confirm password.

        const salt = await bcrypt.genSalt(12);
        const securePassword = await bcrypt.hash(req.body.password, salt); 

        // Save the data in particular schema

        const user = new User({name, email, password:securePassword})  
        const userRegister = await user.save();

        if(userRegister){               
            res.status(200).json({message: "Signup Successfull", id:userRegister.id})              

            // Now we are sending the email for successfull signup to the user.

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'risansig.2019@gmail.com',
                    pass: 'ztnz okfg qrcp snqk'
                }
            })
          
            
            async function main() {
             // send mail with defined transport object
             const info = await transporter.sendMail({
               from: '"risansig.2019@gmail.com', // sender address
               to: req.body.email, // list of receivers
               subject: "Z-BLOG", // Subject line
               text:  `Thank you for signup on Z-BLOG with id: ${userRegister.id}`, // plain text body
             });
           
             console.log("Message sent: %s", info.messageId);
            }
            main().catch(console.error)
        }
       
    }catch(err){
        res.status(404).json({error: "Some Error Occured"+err})
    }
})


// Login Route

router.post('/login', async (req,res)=>{
    const {email,password} = req.body;
    try 
    {
        if(!email || !password){
            return res.status(500).json({message:"Please fill the field properly"})
        }

        const userAuth  = await User.findOne({email: email})

        if(!userAuth){
            return res.status(422).json({message:"Invalid Details"})
        }

         // Match user password with hash password
        const isMatch = await bcrypt.compare(password, userAuth.password);

        if(!isMatch){
            return res.status(422).json({message: "Invalid Details"})
        }
        else{

            // Now i will store jwt token during login

            const data = {
                id:userAuth._id
            }
            
            // Signing the JWT Token
            const token = jwt.sign(data, process.env.SECRET_KEY);
            

             return res
            .status(200)
            .json({Result:"Success", Token:token})
        }
    } catch (error) {
        console.log("Error Occured",error)
    }

})


// Profile Route

router.get('/profile',AuthenticateUser,async (req,res)=>{
    try {
        return res.status(200).json({profileData:req.user})
    } catch (error) {
        return res.status(404).json({message:"Some Error Occured"})
    }
})


// Upload-Profile-Photo Route

router.post('/upload-profile-img',AuthenticateUser, upload.single('file'), async (req,res)=>{
    try {
        req.user.image = req.file.filename
        await req.user.save()
        return res.status(200).json({message:"File Uploaded Successfully"})   
    } catch (error) {
        return res.status(404).json({message:"Some Error Occured"})
    }
})


// Create Blog Route

router.post('/create-blog', AuthenticateUser, upload.single('file'), async(req,res)=>{
    const {title, description, tag, category,image} = req.body
    try {       
        if(title=="" || description=="" || tag=="" || category==""){
            return res.status(500).json({message:"Kindly fill all fields properly."})
        }

        // Creating a blog and save it in blog schema.

        const blog = new Blogs({title, desc:description, tag, category, image})  
        const saveBlog = await blog.save();

        return res.status(200).json({message:"Blog created successfully"})
    } catch (error) {
        return res.status(404).json({message:"Some Error Occured"})
    }
})

module.exports = router;