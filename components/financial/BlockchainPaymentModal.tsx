
import React, { useState } from 'react';
import { RepairTicket ,RepairStatus } from '../../types';
// import { useMockApi } from '../../hooks/useMockApi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import { useApi } from '@/hooks/useApi';
import { ethers } from 'ethers';
// import { payByWaafiPay } from './paymentEvc';
import {payByWaafiPays} from './paymentWaafi'
import { useAuth } from '@/contexts/AuthContext';
interface BlockchainPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: RepairTicket;
  amount: number;
  onPaymentSuccess: (transactionId: string) => void;
}

const BlockchainPaymentModal: React.FC<BlockchainPaymentModalProps> = ({
  isOpen,
  onClose,
  ticket,
  amount,
  onPaymentSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const api = useApi();
  const [paymentMethod, setPaymentMethod] = useState<'blockchain' | 'waafi'>('blockchain');
const {user}=useAuth()
const handleWaafiPayment = async () => {
  setIsLoading(true);
  setPaymentStatus('processing');
  setErrorMessage(null);

  try {
const number = user?.contactNumber?.toString() || '';
await payByWaafiPays({
  phone: number,
  amount: 0.001,
  invoiceId: '7896504',
  description: 'Test USD',
});

    // const result = await payByWaafiPay({
    //   phone: number,
    //   amount:0.001,
    //   merchantUid:"M0910291",
    //   apiUserId: "1000416",
    //   apiKey: "API-675418888AHX",
    //   description: `Repair for ${ticket.deviceInfo}`,
    //   invoiceId: ticket.TicketId,
    //   referenceId: "12334"
    // });
    // if (!result.status) throw new Error(result.error);

    const txId = `waafi-${Date.now()}`;
    await api.processBlockchainPayment(ticket.TicketId, amount, txId); // you may rename this method to processPayment()
    await api.updateRepairTicket(ticket._id, { status: RepairStatus.PAID });

    setTransactionId(txId);
    setPaymentStatus('success');
    setTimeout(() => {
      onPaymentSuccess(txId);
      onClose();
    }, 2000);
  } catch (err: any) {
    setErrorMessage(err.message || 'WaafiPay payment failed.');
    setPaymentStatus('error');
  } finally {
    setIsLoading(false);
  }
};

const handlePayment = async () => {
  setIsLoading(true);
  setPaymentStatus('processing');
  setErrorMessage(null);
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Request MetaMask to connect
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const recipientAddress='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    // Send ETH payment to the smart contract (or predefined address)
const tx = await signer.sendTransaction({
  to: recipientAddress,
  value: ethers.parseEther("0.01"), // Keep it small
});


    console.log('Transaction submitted:', tx.hash);

    // Wait for transaction to confirm
    await tx.wait();

    // Call backend to store payment record
    const result = await api.processBlockchainPayment(ticket.TicketId, amount, tx.hash);
   const updates: Partial<RepairTicket> = { 
        status: ticket.status =RepairStatus.PAID
      };    
    if (result.success) {
      setTransactionId(tx.hash);
      setPaymentStatus('success');
      await api.updateRepairTicket( ticket._id,updates);
      setTimeout(() => {
        onPaymentSuccess(tx.hash);
        onClose();
      }, 2000);
    } else {
      throw new Error('Payment record failed on backend');
    }

  } catch (err: any) {
    console.error("Blockchain payment error:", err);
    setPaymentStatus('error');
    setErrorMessage(err.message || "Blockchain payment failed.");
  } finally {
    setIsLoading(false);
  }
};

  
  // Reset state when modal is closed/reopened
  React.useEffect(() => {
    if (isOpen) {
      setPaymentStatus('idle');
      setErrorMessage(null);
      setTransactionId(null);
      setIsLoading(false);
    }
  }, [isOpen]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Blockchain Payment (Simulated)">
      <div className="space-y-4">
        <p className="text-neutral-DEFAULT">
          You are about to pay for repair ticket <span className="font-semibold">{ticket.id}</span> for device <span className="font-semibold">{ticket.deviceInfo}</span>.
        </p>
        <p className="text-2xl font-bold text-primary">
          Amount: ${amount.toFixed(2)}
        </p>
        
        {/* {paymentStatus === 'idle' && (
          <Button onClick={handlePayment} isLoading={isLoading} className="w-full">
            Confirm & Pay with Wallet (Simulated)
          </Button>
        )} */}

{paymentMethod === 'blockchain' ? (
  <Button onClick={handlePayment} isLoading={isLoading} className="w-full">
    Confirm & Pay with Wallet
  </Button>
) : (
  <Button onClick={handleWaafiPayment} isLoading={isLoading} className="w-full">
    Confirm & Pay with WaafiPay
  </Button>
)}


<div className="flex space-x-2">
  <Button onClick={() => setPaymentMethod('blockchain')} variant={paymentMethod === 'blockchain' ? 'default' : 'outline'}>
    Pay with Wallet
  </Button>
  <Button onClick={() => setPaymentMethod('waafi')} variant={paymentMethod === 'waafi' ? 'default' : 'outline'}>
    Pay with WaafiPay
  </Button>
</div>

        {paymentStatus === 'processing' && (
          <div className="text-center">
            <Spinner size="md" />
            <p className="mt-2 text-neutral-DEFAULT">Processing payment through blockchain...</p>
            <p className="text-xs text-neutral-DEFAULT">(This is a simulation, no real transaction will occur)</p>
          </div>
        )}

        {paymentStatus === 'success' && transactionId && (
<a
  href={`https://sepolia.etherscan.io/tx/${transactionId}`} 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-blue-600 underline"
>
  View on Etherscan
</a>
        )}

        {paymentStatus === 'error' && errorMessage && (
          <>
            <Alert type="error" message={errorMessage} />
            <Button onClick={handlePayment} isLoading={isLoading} className="w-full mt-2">
              Retry Payment
            </Button>
          </>
        )}
         <Button onClick={onClose} variant="ghost" className="w-full mt-2" disabled={isLoading && paymentStatus === 'processing'}>
            Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default BlockchainPaymentModal;
