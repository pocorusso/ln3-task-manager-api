const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (value.length < 3) {
                throw new Error("Description too short")
            }
        }
    },
    completed: {
        type: Boolean,
        required: false,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }  
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task