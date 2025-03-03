"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
// 5.Model
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
    avatar: { type: String, default: 'https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg', required: false },
}, { timestamps: true });
exports.userModel = (0, mongoose_1.model)('User', userSchema);
