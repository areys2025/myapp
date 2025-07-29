import { Request, Response } from 'express';
import Payment from '../models/Payment';
import RepairTicket from '../models/RepairTicket';
import { logEvent } from '../config/logEvent';
import { ethers } from 'ethers';

export const processBlockchainPayment = async (req: Request, res: Response) => {
const { ticketId, amount, transactionId } = req.body;
  console.log('Incoming payment payload:', { ticketId, amount, transactionId });

  if (!ticketId || !amount || !transactionId) {
    return res.status(400).json({ success: false, message: 'ticketId, amount, and transactionId are required' });
  }
  try {
    const paymentRecord = await Payment.create({
      ticketId,
      amount,
      transactionId, // blockchain transaction hash from MetaMask
      status: 'success',
    });
if(paymentRecord){
  await logEvent(
  'Cusetomer paid',
  req.body.LoginfoEml,
  req.body.LoginfoRle,
  { CusetomerId: req.params.id }
);

}
    // Optionally update repair status to PAID
    await RepairTicket.findOneAndUpdate({ TicketId: ticketId }, { status: 'Paid' });

    return res.status(200).json({
      success: true,
      transactionId: paymentRecord.transactionId,
      paymentId: paymentRecord._id,
      createdAt: paymentRecord.createdAt,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment processing failed on the server',
    });
  }
};
