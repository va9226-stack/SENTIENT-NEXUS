'use client';

import React from 'react';

interface Entity3DModelProps {
  modelType: 'sphere' | 'cube' | 'pyramid' | 'icosahedron' | 'torus';
  color: string;
}

const ModelStyles: React.FC<{ color: string, children: React.ReactNode }> = ({ color, children }) => (
  <style jsx>{`
    .model-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 400px;
    }
    .model {
      width: 60px;
      height: 60px;
      position: relative;
      transform-style: preserve-3d;
      animation: spin 20s infinite linear;
    }
    .face {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 1px solid ${color};
      background: ${color}20;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: ${color};
    }
    .cube-front  { transform: rotateY(  0deg) translateZ(30px); }
    .cube-right  { transform: rotateY( 90deg) translateZ(30px); }
    .cube-back   { transform: rotateY(180deg) translateZ(30px); }
    .cube-left   { transform: rotateY(-90deg) translateZ(30px); }
    .cube-top    { transform: rotateX( 90deg) translateZ(30px); }
    .cube-bottom { transform: rotateX(-90deg) translateZ(30px); }

    .sphere {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: radial-gradient(circle at 20% 20%, ${color}, ${color}40 80%);
        box-shadow: 0 0 15px ${color}, inset 0 0 10px ${color}80;
        animation: spin 15s infinite linear, pulse 3s infinite ease-in-out;
    }

    @keyframes spin {
      from { transform: rotateY(0) rotateX(0); }
      to   { transform: rotateY(360deg) rotateX(360deg); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.05); opacity: 0.8; }
    }
  `}</style>
);


export default function Entity3DModel({ modelType, color }: Entity3DModelProps) {
    
  const renderModel = () => {
    switch(modelType) {
      case 'cube':
        return (
          <div className="model">
            <div className="face cube-front"></div>
            <div className="face cube-right"></div>
            <div className="face cube-back"></div>
            <div className="face cube-left"></div>
            <div className="face cube-top"></div>
            <div className="face cube-bottom"></div>
          </div>
        );
       case 'sphere':
       default:
        return <div className="sphere" />;
    }
  }

  return (
    <>
      <ModelStyles color={color}>{null}</ModelStyles>
      <div className="model-container">
        {renderModel()}
      </div>
    </>
  );
}
