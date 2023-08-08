const admin = require("../config/firebase.config");
const users = require("../models/users");
const router = require("express").Router();

const newUserData = async (decodeValue, req, res) => {
    const newUser = new users({
        name: decodeValue.name,
        email: decodeValue.email,
        imageURL: decodeValue.picture,
        userId: decodeValue.user_id,
        email_verified: decodeValue.email_verified,
        auth_time: decodeValue.auth_time,
    });

    try {
        const savedUser = await newUser.save();
        res.status(200).send({user : savedUser});
    } catch (error) {
        res.status(400).send({ success: false, msg: error });
    }
};

const updateUserData = async (decodeValue, req, res) => {
    const filter = {userId : decodeValue.user_id };
    const options = {
        upsert : true,
        new : true,
    };

    try {
        const result = await users.findOneAndUpdate(filter, {auth_time : decodeValue.auth_time}, options);
        res.status(200).send({ user: result });
    } catch (error) {
        res.status(400).send({ success: false, msg: error});
    }
}

router.post("/login", async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({ message: "Invalid Token"});
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (!decodeValue) {
            return res
            .status(500)
            .json({ success: false, message: "Unauthorised user"});
        }

        // checking the user already exists or not
        const userExists = await users.findOne({userId : decodeValue.user_id});
        if (!userExists) {
            newUserData(decodeValue, req, res);
        } else {
            updateUserData(decodeValue, req, res);
        }

    } catch (error) {
        return res.status(500).send({ success: false, msg: error });
    }
});

module.exports = router;