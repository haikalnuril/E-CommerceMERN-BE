import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field cannot be empty'],
        unique: [true, 'Name already exists'],
    },
    email: {
        type: String,
        required: [true, 'Email field cannot be empty'],
        unique: [true, 'Email already exists'],
        validate: {
            validator: validator.isEmail,
            message: 'Invalid email address format ex: foo@bar.com',
        }
    },
    password: {
        type: String,
        required: [true, 'Password field cannot be empty'],
        minLength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true,
});

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function (reqBody){
    return await bcrypt.compare(reqBody, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;