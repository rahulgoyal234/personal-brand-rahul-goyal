import React, { useEffect, useState } from 'react';

export default function EntranceCurtain() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="entrance-curtain fixed inset-0 z-[100] flex items-center justify-center bg-[#14110d] pointer-events-auto select-none">
      <style>{`
        .entrance-curtain {
          animation: entranceCurtainFade 0.35s ease-in 0.75s forwards;
        }

        @keyframes entranceCurtainFade {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        .entrance-mark {
          position: relative;
          z-index: 2;
          text-align: center;
          opacity: 0;
          transform: scale(0.96);
          animation: entranceMarkIn 0.35s ease-out 0.05s forwards,
                     entranceMarkOut 0.3s ease-in 0.55s forwards;
        }

        .entrance-mark-symbol {
          font-size: 2rem;
          letter-spacing: 0.3em;
          color: #c8a15a;
          font-weight: 400;
          font-family: 'Playfair Display', 'Georgia', 'Times New Roman', serif;
        }

        .entrance-mark-line {
          width: 0;
          height: 1px;
          background: #c8a15a;
          margin: 10px auto 0;
          animation: entranceLineGrow 0.3s ease-out 0.2s forwards;
        }

        @keyframes entranceMarkIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes entranceMarkOut {
          to {
            opacity: 0;
            transform: scale(1.02);
          }
        }

        @keyframes entranceLineGrow {
          to {
            width: 44px;
          }
        }
      `}</style>

      <div className="entrance-mark">
        <div className="entrance-mark-symbol">R G</div>
        <div className="entrance-mark-line"></div>
      </div>
    </div>
  );
}
