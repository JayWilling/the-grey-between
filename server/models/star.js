const mongoose = require('mongoose');

const starSchema = mongoose.Schema();

starSchema.add({
    
});

const Star = mongoose.Model("Star", starSchema);

module.exports = Star;