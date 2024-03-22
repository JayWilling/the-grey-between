const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const celestialBodySchema = mongoose.Schema({
    _id: {
        type: ObjectId,
        required: true,
    },
    name: {},
    description: {},
    starParent: {},
    radius: {},
    orbitRadius: {},
    orbitVelocity: {},
    colour: {},
});

const CelestialBody = new mongoose.model("CelestialBody", celestialBodySchema);

module.exports = CelestialBody;