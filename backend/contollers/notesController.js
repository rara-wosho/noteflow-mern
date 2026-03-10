import Note from "../models/Note.js";

export async function getNotes(req, res) {
    try {
        const notes = await Note.find().sort({
            createdAt: -1,
        });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
export function getAcceptedNotes(req, res) {
    res.status(200).send({ message: "This is sample response." });
}

export async function createNote(req, res) {
    try {
        const { title, content } = req.body;

        const note = new Note({ title, content });

        // Return the new saved notes
        const savedNotes = await note.save();
        res.status(200).json(savedNotes);
    } catch (error) {
        console.error(
            "Something went wrong while creating the note.",
            error.message,
        );
    }
}

export async function updateNote(req, res) {
    try {
        const { title, content } = req.body;

        const result = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
            },
            { new: true },
        );

        if (!result) {
            return res.status(200).json({ message: "Note not found" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteNote(req, res) {
    try {
        const result = await Note.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(200).json({ message: "Note not found" });
        }

        res.json({ message: "Note delete successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
