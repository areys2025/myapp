
import React, { useState } from 'react';
import Button from '../common/Button';
import { Textarea } from '../common/Input'; // Assuming Input.tsx exports Textarea
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
interface FeedbackFormProps {
  ticketId: string;
  assignedTechnicianId:string;
  onSuccess: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ ticketId,assignedTechnicianId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user } = useAuth(); // Assuming login can update user details

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user) {
    setError('You must be logged in to submit feedback.');
    return;
  }

  setIsLoading(true);
  setError(null);
  setSuccessMessage(null);

  try {

  axios.post('http://localhost:5000/api/feedback', {
      ticketId,
      rating,
      comment,
      date: new Date().toISOString(),
      userEmail: user.email,
      walletAddress: user.walletAddress,
      assignedTechnicianId
    });
console.log(ticketId , rating , comment , user.email,user.walletAddress)
    setSuccessMessage('Thank you for your feedback!');
    setTimeout(() => onSuccess(), 1500);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to submit feedback.');
  } finally {
    setIsLoading(false);
  }
};



  const StarRating = () => (
    <div className="flex space-x-1 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !isLoading && setRating(star)}
          className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
          disabled={isLoading}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );

  if (successMessage) {
    return <Alert type="success" message={successMessage} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <div>
        <label className="block text-sm font-medium text-neutral-dark mb-1">Your Rating</label>
        <StarRating />
      </div>
      <Textarea
        label="Comments (Optional)"
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us about your experience..."
        rows={3}
        disabled={isLoading}
      />
      <Button type="submit" isLoading={isLoading} disabled={isLoading || !!successMessage} className="w-full">
        Submit Feedback
      </Button>
    </form>
  );
};

export default FeedbackForm;
