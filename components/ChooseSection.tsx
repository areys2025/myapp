import React from 'react';
import { Card } from 'react-bootstrap';

function ChooseSection() {
  return (
    <div>
        <div className="container">
            <div className='row g-4'>
                <div className='col-lg-4'>
                    <Card className='d-flex align-items-center border-0 h-100'>
                        <div className='mt-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="70" height="16" fill="currentColor" className="bi bi-record-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
</svg>
                        </div>
                        <Card.Body>
                            <Card.Title className='text-center text-capitalize mb-3'>
                              Vision
                            </Card.Title>
                            <Card.Text className='text-center'>
                           Our envisions itself as a beacon of knowledge and innovation, dedicated to shaping future leaders who will positively impact society. Our vision is rooted in a commitment to academic excellence, diversity, and inclusivity, fostering a learning environment where critical thinking, creativity, and ethical responsibility are nurtured.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className='col-lg-4'>
                    <i >
                    <Card className='d-flex align-items-center border-100 h-100'>
                        <div className='mt-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-record-circle" viewBox="0 0 16 16">
                     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                     <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                     </svg>
                        </div>
                        <Card.Body className='fade-in-section'>
                            <Card.Title className='text-center text-capitalize mb-3'>
                               Mission
                            </Card.Title>
                            <Card.Text className='text-center'>
                          Our mission is to provide a transformative educational experience that prepares students to thrive in a complex and interconnected world. We are committed to offering rigorous academic programs that blend theoretical knowledge with practical skills, ensuring graduates are equipped to meet the challenges of their professions. 
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    </i>
                </div>
                <div className='col-lg-4'>
                    <Card className='d-flex align-items-center border-0 h-100'>
                        <div className='mt-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-record-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
</svg>
                        </div>
                        <Card.Body>
                            <Card.Title className='text-center text-capitalize mb-3'>
                               Core Value
                            </Card.Title>
                            <Card.Text className='text-center'>
                          Our  core values form the foundation of everything we do. Integrity guides our actions, ensuring honesty, transparency, and ethical behavior in all interactions. We prioritize academic excellence, striving for continuous improvement and innovation in teaching, research, and community service. 
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChooseSection;