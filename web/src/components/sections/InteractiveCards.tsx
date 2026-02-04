'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Card {
  id: string;
  frontImage: string;
  backImage: string;
  startX: number;
  startY: number;
}

interface InteractiveCardsProps {
  tag?: string;
  title?: string;
  description?: string;
  hint?: string;
  cards?: Card[];
}

const defaultCards: Card[] = [
  { id: '1', frontImage: '/cards/card-1-front.jpg', backImage: '/cards/card-1-back.jpg', startX: 10, startY: 15 },
  { id: '2', frontImage: '/cards/card-2-front.jpg', backImage: '/cards/card-2-back.jpg', startX: 38, startY: 25 },
  { id: '3', frontImage: '/cards/card-3-front.jpg', backImage: '/cards/card-3-back.jpg', startX: 65, startY: 10 },
];

interface CardState {
  x: number;
  y: number;
  zIndex: number;
  isFlipped: boolean;
}

export function InteractiveCards({
  tag = 'Try It Out',
  title = 'Experience Prayer Portals',
  description = 'Drag the cards around. Click one to flip it over and see how it works.',
  hint = 'Drag cards to move them • Click to flip and reveal Scripture',
  cards = defaultCards,
}: InteractiveCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>(() => {
    const initial: Record<string, CardState> = {};
    cards.forEach((card, index) => {
      initial[card.id] = {
        x: card.startX,
        y: card.startY,
        zIndex: index + 1,
        isFlipped: false,
      };
    });
    return initial;
  });

  const [dragging, setDragging] = useState<{
    cardId: string;
    startMouseX: number;
    startMouseY: number;
    startCardX: number;
    startCardY: number;
    hasMoved: boolean;
  } | null>(null);

  const [highestZ, setHighestZ] = useState(cards.length + 1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, cardId: string) => {
      e.preventDefault();
      const state = cardStates[cardId];

      // Bring to front
      const newZ = highestZ + 1;
      setHighestZ(newZ);
      setCardStates((prev) => ({
        ...prev,
        [cardId]: { ...prev[cardId], zIndex: newZ },
      }));

      // Start dragging
      setDragging({
        cardId,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startCardX: (state.x / 100) * containerSize.width,
        startCardY: (state.y / 100) * containerSize.height,
        hasMoved: false,
      });
    },
    [cardStates, highestZ, containerSize]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging || containerSize.width === 0) return;

      const deltaX = e.clientX - dragging.startMouseX;
      const deltaY = e.clientY - dragging.startMouseY;

      // Check if actually moved
      const hasMoved = Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3;

      const newX = dragging.startCardX + deltaX;
      const newY = dragging.startCardY + deltaY;

      // Convert back to percentage
      const percentX = (newX / containerSize.width) * 100;
      const percentY = (newY / containerSize.height) * 100;

      setDragging((prev) => (prev ? { ...prev, hasMoved: prev.hasMoved || hasMoved } : null));

      setCardStates((prev) => ({
        ...prev,
        [dragging.cardId]: {
          ...prev[dragging.cardId],
          x: Math.max(0, Math.min(80, percentX)),
          y: Math.max(0, Math.min(70, percentY)),
        },
      }));
    },
    [dragging, containerSize]
  );

  const handlePointerUp = useCallback(() => {
    if (dragging && !dragging.hasMoved) {
      // Toggle flip
      setCardStates((prev) => ({
        ...prev,
        [dragging.cardId]: {
          ...prev[dragging.cardId],
          isFlipped: !prev[dragging.cardId].isFlipped,
        },
      }));
    }
    setDragging(null);
  }, [dragging]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [dragging, handlePointerMove, handlePointerUp]);

  // Get responsive card dimensions
  const getCardDimensions = () => {
    if (containerSize.width < 480) return { width: 189, height: 135 }; // 45% of 420x300
    if (containerSize.width < 768) return { width: 231, height: 165 }; // 55%
    if (containerSize.width < 1024) return { width: 315, height: 225 }; // 75%
    return { width: 420, height: 300 };
  };

  const cardDimensions = getCardDimensions();

  return (
    <section id="try-cards" className="section relative z-10 bg-cream">
      <div className="container-custom">
        {/* Header */}
        <header className="section-header">
          <span className="section-tag">{tag}</span>
          <h2>{title}</h2>
          <p className="text-lg text-text-muted">{description}</p>
        </header>

        {/* Cards Area */}
        <div
          ref={containerRef}
          className="relative h-[280px] sm:h-[320px] md:h-[380px] lg:h-[450px] max-w-[1200px] mx-auto"
        >
          {cards.map((card) => {
            const state = cardStates[card.id];
            return (
              <div
                key={card.id}
                className={cn(
                  'absolute cursor-grab touch-none select-none',
                  dragging?.cardId === card.id && 'cursor-grabbing'
                )}
                style={{
                  left: `${state.x}%`,
                  top: `${state.y}%`,
                  zIndex: state.zIndex,
                  width: cardDimensions.width,
                  height: cardDimensions.height,
                  perspective: '1000px',
                }}
                onPointerDown={(e) => handlePointerDown(e, card.id)}
              >
                <div
                  className={cn(
                    'relative w-full h-full transition-transform duration-500 rounded-2xl shadow-lg',
                    state.isFlipped && '[transform:rotateY(180deg)_rotate(-90deg)]'
                  )}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-blush"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <Image
                      src={card.frontImage}
                      alt="Prayer card front"
                      fill
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-forest [transform:rotateY(180deg)]"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <Image
                      src={card.backImage}
                      alt="Prayer card back"
                      fill
                      className="object-cover pointer-events-none"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-center mt-8 text-text-muted text-[0.9375rem]">
          {hint}
        </p>
      </div>
    </section>
  );
}
