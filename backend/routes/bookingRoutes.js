const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userBookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(userBookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user bookings", details: err.message });
  }
});

router.get('/available-slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const bookedBookings = await Booking.find({ date });

    let allSlots = [];
    let startMinutes = 9 * 60;
    const endMinutes = 21 * 60;

    const timeToMinutes = (timeStr) => {
      const [time, ampm] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    while (startMinutes < endMinutes) {
      const hours = Math.floor(startMinutes / 60);
      const minutes = startMinutes % 60;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      let displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
      const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
      const timeString = `${displayHours}:${displayMinutes} ${ampm}`;

      const isBusy = bookedBookings.find(b => {
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        return startMinutes >= bStart && startMinutes < bEnd;
      });

      allSlots.push({
        time: timeString,
        available: isBusy ? false : true
      });

      startMinutes += 30;
    }

    res.status(200).json(allSlots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch slots", details: err.message });
  }
});

router.post('/process-booking', async (req, res) => {
  try {
    const { 
      userId, 
      totalAmount, 
      paymentStatus, 
      paymentType,
      serviceId, 
      serviceName, 
      startTime, 
      duration, 
      date 
    } = req.body;

    if (paymentStatus === 'Success') {
      const earnedPoints = Math.floor(totalAmount / 100) * 5;

      const [time, ampm] = startTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      let startTotal = hours * 60 + minutes;
      if (ampm === 'PM' && hours !== 12) startTotal += 12 * 60;
      if (ampm === 'AM' && hours === 12) startTotal = 0;

      let endTotal = startTotal + parseInt(duration);
      let endHours = Math.floor(endTotal / 60);
      let endMins = endTotal % 60;
      let endAmpm = endHours >= 12 ? 'PM' : 'AM';
      let displayEndHours = endHours > 12 ? endHours - 12 : (endHours === 0 ? 12 : endHours);
      let displayEndMins = endMins < 10 ? '0' + endMins : endMins;
      const endTimeString = `${displayEndHours}:${displayEndMins} ${endAmpm}`;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { loyaltyPoints: earnedPoints } },
        { new: true }
      );

      const newBooking = new Booking({
        serviceId,
        serviceName,
        userId,
        startTime,
        endTime: endTimeString,
        duration,
        date,
        price: totalAmount,
        paymentType,
        paymentStatus: 'Success'
      });

      await newBooking.save();

      res.status(200).json({
        message: "Booking confirmed",
        earned: earnedPoints,
        totalPoints: updatedUser.loyaltyPoints,
        bookingDetails: {
          ...newBooking._doc,
          totalAmount: newBooking.price
        }
      });
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

module.exports = router;