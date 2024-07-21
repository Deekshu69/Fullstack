import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { User, Monument, Contribution, City } from './schema.js';

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = 6001;

mongoose.connect('mongodb://localhost:27017/SBLocal', {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Use new topology engine
})
.then(() => {
    console.log('MongoDB connected successfully');

// Registration endpoint
// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, email, usertype, password, domain, qualification } = req.body;

    console.log('Received registration request:', req.body);

    // Check if all required fields are provided
    if (!username || !email || !usertype || !password || !domain || !qualification) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            usertype,
            password: hashedPassword,
            domain,
            qualification
        });

        const userCreated = await newUser.save();
        console.log('User registered successfully:', userCreated);
        return res.status(201).json(userCreated);

    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
});

    
    // Login endpoint
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            return res.json(user);

        } catch (error) {
            console.error('Error in login:', error);
            return res.status(500).json({ message: 'Server Error' });
        }
    });

    app.post('/add-location', async (req, res) => {
        try {
            const { title, bannerImg, description, city, newCity, cityBannerImg, address, otherThings, contributor, contributorId } = req.body;

            if (city === "other") {
                const newCityData = {
                    name: newCity,
                    bannerImg: cityBannerImg
                };

                const newCityObj = await City.create(newCityData);

                const newLocation = new Monument({
                    title, bannerImg, description, city: newCityObj._id, address, otherThings, contributor, contributorId
                });
                const newLocationObj = await newLocation.save();

                const newContribution = new Contribution({
                    monumentId: newLocationObj._id,
                    contributor, contributorId, title, city: newCityObj._id, address, contribution: "Location Added", date: new Date().toISOString()
                });
                await newContribution.save();

            } else {
                const newLocation = new Monument({
                    title, bannerImg, description, city, address, otherThings, contributor, contributorId
                });
                const newLocationObj = await newLocation.save();

                const newContribution = new Contribution({
                    monumentId: newLocationObj._id,
                    contributor, contributorId, title, city, address, contribution: "Location Added", date: new Date().toISOString()
                });
                await newContribution.save();
            }

            res.json({ message: 'New monument added successfully' });

        } catch (error) {
            console.error('Error adding location:', error);
            res.status(500).json({ message: 'Error adding location' });
        }
    });

    // Fetch cities endpoint
    app.get('/fetch-cities', async (req, res) => {
        try {
            const cities = await City.find();
            res.json(cities);
        } catch (error) {
            console.error('Error fetching cities:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // Fetch monuments endpoint
    app.get('/fetch-monuments', async (req, res) => {
        try {
            const monuments = await Monument.find();
            res.json(monuments);
        } catch (error) {
            console.error('Error fetching monuments:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // Fetch monument by ID endpoint
    app.get('/fetch-monument/:id', async (req, res) => {
        try {
            const monument = await Monument.findById(req.params.id);
            res.json(monument);
        } catch (error) {
            console.error('Error fetching monument by ID:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // Upload monument image endpoint
    app.post('/upload-monument-img/:id', async (req, res) => {
        try {
            const { newImg, contributor, contributorId } = req.body;
            const monument = await Monument.findById(req.params.id);
            if (!monument) {
                return res.status(404).json({ message: 'Monument not found' });
            }

            monument.images.push(newImg);
            await monument.save();

            const newContribution = new Contribution({
                monumentId: req.params.id,
                contributor, contributorId, title: monument.title, city: monument.city, address: monument.address, contribution: "Image Added", date: new Date().toISOString()
            });
            await newContribution.save();

            res.json(monument);

        } catch (error) {
            console.error('Error uploading monument image:', error);
            res.status(500).json({ message: 'Error uploading monument image' });
        }
    });

    // Fetch contributions endpoint
    app.get('/fetch-contributions', async (req, res) => {
        try {
            const contributions = await Contribution.find();
            res.json(contributions);
        } catch (error) {
            console.error('Error fetching contributions:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});
