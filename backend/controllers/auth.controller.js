import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signup(req,res) {
    try {
        const {name, username, email, phone, password } = req.body;

        // MISSING FIELDS
        if (!name || !username || !email || !phone || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        // USER WITH THIS EMAIL ALREADY EXISTS
        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({message: "Account with this email already exists"});
        };

        // USER WITH THIS USERNAME ALREADY EXISTS
        const existingUsername = await User.findOne({username});
        if (existingUsername) {
            return res.status(400).json({message: "Account with this username already exists"});
        };

        // PASSWORD SUFFICIENT LENGTH
        if (password.length < 6) {
            return res.status(400).json({message: "Password needs to be at least 6 characters long"});
        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            username,
            email,
            phone,
            password:hashed_password
        });
        await newUser.save();

        // GENERATE TOKEN
        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: "3d"
        });

        // SET COOKIE
        res.cookie("jwt-truck-quoting", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(201).json({message: "Successfully signup user"});

    } catch (error) {
        console.log("Error in signup auth controller", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export async function login(req,res) {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Password needs to be at least 6 characters long"});
        }

        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({message: "Username incorrect or user not found"});
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        // GENERATE TOKEN
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: "3d"
        });

        // SET COOKIE
        res.cookie("jwt-asset-register", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({message: "Successfully logged in"});

    } catch (error) {
        console.log("Error in login auth controller", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

export function logout(req,res) {
    res.clearCookie("jwt-asset-register");
    res.json({success: true, message: "Logged out successfully"});
};

export function getCurrentUser(req,res) {
    try {
        res.json(req.user)
    } catch (error) {
        console.log("Error in getCurrentUser controller:", error.message);
        res.status(500).json({success:false, message: "Internal Server Error"});
    }
};

export function adminTest(req,res) {
    console.log("ADMIN")
}