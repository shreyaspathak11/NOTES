const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema(
{
    user: {
            type: mongoose.Schema.Types.ObjectId,         //we wnna store the id of the user that created the note
            required: true,                                                     
            ref: 'User'                             //ref is the name of the model that we want to reference
    },
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    }
    );

noteSchema.plugin(AutoIncrement, {
    inc_field: 'noteId',
    id: 'noteNums',
    start_seq: 1
});

module.exports = mongoose.model('Note', noteSchema);
    