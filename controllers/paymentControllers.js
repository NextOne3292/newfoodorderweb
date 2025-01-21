import { Payment } from '../models/paymentModel.js';
import { Order } from '../models/orderModel.js';

// Process a payment (Protected route)
export const processPayment = async (req, res) => {
  const { orderId, paymentMethod, amount, transactionId } = req.body;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed for this order' });
    }

    const payment = new Payment({
      orderId,
      paymentMethod,
      status: 'completed', // Assuming payment is completed successfully
      amount,
      transactionId,
    });

    await payment.save();

    // Update the order's payment status
    order.paymentStatus = 'paid';
    await order.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

// Get payment status by order ID (Protected route)
export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment status', error: error.message });
  }
};
