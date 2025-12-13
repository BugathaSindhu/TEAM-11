const Contact = require('../models/Contact');

const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = await Contact.create({ name, email, subject, message });

    res.status(201).json({ message: 'Contact message submitted successfully', contact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { submitContact };

