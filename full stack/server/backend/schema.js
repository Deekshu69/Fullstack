/*import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true },
    domain: { type: String, required: true },
    qualification: { type: String, required: true }
});

const MonumentSchema = new mongoose.Schema({
    title: { type: String },
    bannerImg: { type: String },
    description: { type: String },
    city: { type: String },
    address: { type: String },
    otherThings: { type: String },
    contributor: { type: String },
    contributorId: { type: String },
    images: { type: Array }
});

const ContributionSchema = new mongoose.Schema({
    monumentId: { type: String },
    contributor: { type: String },
    contributorId: { type: String },
    title: { type: String },
    city: { type: String },
    address: { type: String },
    contribution: { type: String },
    date: { type: String }
});

const CitySchema = new mongoose.Schema({
    name: { type: String },
    bannerImg: { type: String }
});


const User = mongoose.model('User', UserSchema);
const Monument = mongoose.model("Monument", MonumentSchema);
const Contribution = mongoose.model("Contribution", ContributionSchema);
const City = mongoose.model("City", CitySchema);

export { User, Monument, Contribution, City };*/

import mongoose from "mongoose";

// URL validation function
const urlValidator = (value) => {
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(value);
};

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    usertype: { type: String, required: true },
    password: { type: String, required: true },
    domain: { type: String, required: true },
    qualification: { type: String, required: true }
});

const MonumentSchema = new mongoose.Schema({
    title: { type: String },
    bannerImg: { 
        type: String, 
        validate: {
            validator: urlValidator,
            message: props => `${props.value} is not a valid URL!`
        },
        required: [true, 'Banner image URL is required']
    },
    description: { type: String },
    city: { type: String },
    address: { type: String },
    otherThings: { type: String },
    contributor: { type: String },
    contributorId: { type: String },
    images: { type: Array }
});

const ContributionSchema = new mongoose.Schema({
    monumentId: { type: String },
    contributor: { type: String },
    contributorId: { type: String },
    title: { type: String },
    city: { type: String },
    address: { type: String },
    contribution: { type: String },
    date: { type: String }
});

const CitySchema = new mongoose.Schema({
    name: { type: String },
    bannerImg: { 
        type: String, 
        validate: {
            validator: urlValidator,
            message: props => `${props.value} is not a valid URL!`
        },
        required: [true, 'Banner image URL is required']
    }
});

const User = mongoose.model('User', UserSchema);
const Monument = mongoose.model("Monument", MonumentSchema);
const Contribution = mongoose.model("Contribution", ContributionSchema);
const City = mongoose.model("City", CitySchema);

export { User, Monument, Contribution, City };
