import User from './models/User.js';
import bcrypt from 'bcrypt'
import connectToDatabase from './Database/db.js';


const userRegister = async () => {
   
   await connectToDatabase()

    try {
        const hashpassword = await bcrypt.hash("admin", 10)
        const newUser = new User({
            name: "admin",
            email: "admin@gmail.com",
            password: hashpassword,
            role: "admin"
        })
        await newUser.save()

    } catch (error) {

        console.log(error)

    }
}
 
userRegister()
