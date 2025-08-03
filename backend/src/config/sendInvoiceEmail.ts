import nodemailer from 'nodemailer';

export const sendInvoiceEmail = async (recipientEmail: string, invoice: any) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${process.env.APP_NAME || 'MyApp'}" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Invoice #${invoice.TicketId}`,
    html: `
      <h3>Thank you for your business!</h3>
      <p><strong>Invoice ID:</strong> ${invoice.TicketId}</p>
      <p><strong>Status:</strong> ${invoice.status}</p>
      <p><strong>Device:</strong> ${invoice.deviceInfo}</p>
      <p><strong>Amount:</strong> $${(invoice.cost || 0).toFixed(2)}</p>
      <p>We appreciate your prompt payment.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
