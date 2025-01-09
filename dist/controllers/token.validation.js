"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || 'aksjdkl2aj3djaklfji32dj2dj9ld92jd92j';
const validateToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({
            success: false,
            message: 'Token is required',
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: decoded,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
        return;
    }
};
exports.validateToken = validateToken;
