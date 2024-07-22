const User = require('../models/User');
const mailchimp = require('@mailchimp/mailchimp_transactional');
const { MANDRILL_API_KEY } = require('../config');

const mandrill = mailchimp(MANDRILL_API_KEY);

const generatePassword = (firstName, lastName, mobile) => {
    return `${firstName.substring(0, 2)}${lastName.substring(0, 2)}${mobile.substring(0, 4)}`;
};

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, mobile } = req.body;

    if (!firstName || !lastName || !email || !mobile) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const password = generatePassword(firstName, lastName, mobile);
        user = new User({ firstName, lastName, email, mobile, password });

        await user.save();

        const message = {
            from_email: 'your_email@example.com',
            subject: 'Account Created',
            text: `Your account has been created. Your password is ${password}`,
            to: [
                {
                    email: email,
                    type: 'to'
                }
            ]
        };

        await mandrill.messages.send({ message });

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.loginUser = async (req, res) => {
    const { firstName, password } = req.body;

    try {
        const user = await User.findOne({ firstName });
        if (!user || user.password !== password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.uploadVideo = async (req, res) => {
    const { userId, title, description, videoUrl } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.videos.push({ title, description, url: videoUrl });
        await user.save();
        res.status(200).json({ msg: 'Video uploaded successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
