import SystemLog from '../models/SystemLog';

export const logEvent = async (
  action: string,
  actor?: string,
  role?: string,
  details: any = {}
) => {
  try {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    await SystemLog.create({
      action,
      actor,
      role,
      details,
      date: formattedDate,      
      timestamp: now            
    });
  } catch (err) {
    console.error('Logging error:', err);
  }
};
