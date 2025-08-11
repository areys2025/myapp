
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button'; // Import Button
import AssignedTasksList from '../components/technician/AssignedTasksList';
import { ChartBarIcon, WrenchScrewdriverIcon } from '../constants'; 
import { Feedback, RepairStatus, RepairTicket } from '@/types';
import { useApi } from '@/hooks/useApi';

const TechnicianPortalPage: React.FC = () => {
  const { user } = useAuth();
  const [feedbackhRate, setFeedbackRate] = useState(0);
    const [completedTas, setCompletedTas] = useState(0);
        const [actTsk, setActTsk] = useState(0);
const api=useApi();
const feedback = async () => {
        const feedbackRes:Feedback[]= await api.getAllFeedBacks();
         const Reps:RepairTicket[]= await api.getRepairs();
        const assignedTsk=Reps.filter(tsk=>(tsk.assignedTechnicianId==user?.id))
         const numOfActvTasks=assignedTsk.filter(t=>(t.status==RepairStatus.REQUESTED||t.status==RepairStatus.IN_PROGRESS||t.status==RepairStatus.WAITING_FOR_PARTS)).length;
      const  numOfComplt=assignedTsk.filter(t=>(t.status==RepairStatus.PAID||t.status==RepairStatus.COMPLETED)).length;
        const filteredTechRate: any=feedbackRes.filter(t=>(t.assignedTechnicianId==user?.id)).map((tech: any) => ({
        ticketId: tech.ticketId,
        rating:tech.rating, 
        date:tech.date, 
        userEmail:tech.userEmail, 
        walletAddress:tech.walletAddress,
        assignedTechnicianId:tech.assignedTechnicianId
      }));   
      setCompletedTas(numOfComplt);
      console.log(numOfComplt)
     const techRateAvg=filteredTechRate.reduce((sum: any, inv: { rating: any; }) => sum + (inv.rating || 0), 0).toFixed(2)/filteredTechRate.length
    if(isNaN(techRateAvg))
    {
           setFeedbackRate(0.001);    
    }
    else{
         setFeedbackRate(techRateAvg);    
    }
setActTsk(numOfActvTasks)
    }
  useEffect(() => {
    feedback();
  }, [ ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-dark">Technician Dashboard</h1>
      <p className="text-neutral-DEFAULT">Welcome back, {user?.name}!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        <Card title="My Stats " className="bg-primary ">
          <div className="space-y-2">
            <p>Active Tasks: <span className="font-bold">{actTsk}</span></p>
            <p>Completed Today: <span className="font-bold">{completedTas}</span></p>
            <p>Avg. Rating: <span className="font-bold">{feedbackhRate} ★</span></p>
          </div>
        </Card>

        {/* Updated Quick Links Card */}
        <Card className="bg-gradient-to-r from-primary to-primary-dark text-white" bodyClassName="p-0">
          <div className="px-4 py-3 border-b border-primary-light">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          </div>
          <div className="p-4 space-y-3">
            <Link to="/assigned-tasks">
              <Button className="w-full bg-transparent border border-white text-white hover:bg-primary-light hover:text-primary-dark focus:ring-white">
                <WrenchScrewdriverIcon className="w-5 h-5 mr-2" />
                View All My Tasks
              </Button> 
            </Link>
            <Link to="/inventory">
              <Button className="w-full bg-transparent border border-white text-white hover:bg-primary-light hover:text-primary-dark focus:ring-white">
                <ChartBarIcon className="w-5 h-5 mr-2" />
                Check Parts Stock
              </Button>
            </Link>
          </div>
        </Card>
        
        <Card title="Notifications (Placeholder)">
          <p className="text-neutral-DEFAULT">No new critical notifications.</p>
          <ul className="mt-2 space-y-1 text-sm text-neutral-DEFAULT">
            <li>Part 'iPhone Screen X' low stock.</li>
          </ul>
        </Card>
      </div>

      <AssignedTasksList />
    </div>
  );
};

export default TechnicianPortalPage;
