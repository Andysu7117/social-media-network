const { User, Thought } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findById(req.params.id);
      if (!thought) {
        return res.status(404).json({ error: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findByIdAndUpdate(
        req.body.userId,
        { $push: { thoughts: thought._id } },
        { new: true, runValidators: true }
      );
      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!thought) {
        return res.status(404).json({ error: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.id);
      res.json({ message: `${thought} deleted` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async addReaction(res, req) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!thought) {
        return res.status(404).json({ error: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteReaction(res, req) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ error: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};
