import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model'; // Adjust path if needed
import { logEvent } from '../config/logEvent';
export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Validation
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Find user by token and check expiration
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // still valid
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or expired' });
    }

    // Hash new password
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

  const passChange=  await user.save();

if(passChange){
  await logEvent(
  'user changed password',
  req.user?.email,
  req.user?.role,
  { technicianId: user._id, name: user.name }
);

}
    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error during password reset' });
  }
};
