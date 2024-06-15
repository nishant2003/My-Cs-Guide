import userModel from "../models/userModel.js"
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        //validation
        if (!name) {
            return res.send({ messege: "Name is Required" });
        }
        if (!email) {
            return res.send({ messege: "Email is Required" });
        }
        if (!password) {
            return res.send({ messege: "Password is Required" });
        }
        if (!phone) {
            return res.send({ messege: "Phone no is Required" });
        }
        if (!address) {
            return res.send({ error: "Address is Required" });
        }
        if (!answer) {
            return res.send({ messege: "answer is Required" });
        }

        //check user
        const existingUser = await userModel.findOne({ email });
        //existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                messege: "Already Register please login",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            answer,
            password: hashedPassword,
        }).save();

        res.status(201).send({
            success: true,
            messege: 'User Register Successfully',
            user,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            messege: "Error in registration",
            error,
        });
    }
};


//Post login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                messege: 'Invalid email or password',
            });
        }

        //check
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                messege: 'Email is not registered',
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                messege: "Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d", });
        res.status(200).send({
            sucess: true,
            messege: "Login done successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            messege: "Error in login",
            error,
        });
    }
};

// export default { registerController };

//forgotPasswordController
// export const forgotPasswordController = async (req, res) => {
//     try {
//         const { email, answer, newPassword } = req.body;
//         if (!email) {
//             res.send({ messege: 'Email is required' })
//         }
//         if (!answer) {
//             res.send({ messege: 'answer is required' })
//         }
//         if (!newPassword) {
//             res.send({ messege: 'newPassword is required' })
//         }
//         //check

//         const user = await userModel.findOne({ email, answer })
//         //validation
//         if (!user) {
//             return res.status(404).send({
//                 sucess: false,
//                 messege: 'Wrong Email or answer'
//             })
//         }
//         const hashed = await hashedPassword(newPassword)
//         await userModel.findByIdAndUpdate(user._id, { password: hashed })
//         res.status(200).send({
//             sucess: true,
//             messege: "Password Reset Successfully",
//         });
//     }

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" });
        }
        if (!answer) {
            res.status(400).send({ message: "answer is required" });
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" });
        }
        //check
        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
};


//test controoler
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};