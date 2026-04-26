'use client';

import { Heart, MapPin, BookOpen, Briefcase, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  city: string;
  image?: string;
  education?: string;
  profession?: string;
  gotra?: string;
  religion?: string;
  onLike: () => void;
  onDislike: () => void;
}

export default function ProfileCard({
  id,
  name,
  age,
  city,
  image,
  education,
  profession,
  gotra,
  religion,
  onLike,
  onDislike,
}: ProfileCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  return (
    <motion.div
      drag="x"
      dragElastic={0.2}
      dragConstraints={{ left: -500, right: 500 }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100) {
          setSwipeDirection('right');
          setTimeout(onLike, 100);
        } else if (info.offset.x < -100) {
          setSwipeDirection('left');
          setTimeout(onDislike, 100);
        }
      }}
      whileHover={{ scale: 1.02 }}
      className="absolute w-full h-full max-w-sm cursor-grab active:cursor-grabbing"
      onHoverStart={() => setIsHovering(true)}
      onHoverEnd={() => setIsHovering(false)}
    >
      <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col border border-white/20 dark:border-white/10 backdrop-blur-sm">
        {/* Image Section */}
        <div className="relative h-96 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden flex-shrink-0">
          {image ? (
            <>
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
              {/* Shine effect on hover */}
              {isHovering && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
              <div className="text-center text-white">
                <div className="text-6xl font-bold mb-2">{name[0]}</div>
                <p className="text-xl">No photo yet</p>
              </div>
            </div>
          )}
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Swipe indicators */}
          {swipeDirection === 'right' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2"
            >
              <Heart className="w-5 h-5 fill-current" />
              LIKE
            </motion.div>
          )}
          {swipeDirection === 'left' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold"
            >
              PASS
            </motion.div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* Name and Age */}
          <div>
            <div className="flex items-baseline gap-3 mb-3">
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {name}
              </h3>
              <span className="text-xl md:text-2xl font-semibold text-foreground">{age}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-medium">{city}</span>
            </div>

            {/* Community Info Badges */}
            {(religion || gotra) && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-4 border border-primary/20 backdrop-blur-sm">
                <div className="flex flex-wrap gap-2">
                  {religion && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-xs font-semibold text-primary bg-primary/20 px-3 py-1.5 rounded-full border border-primary/30"
                    >
                      {religion}
                    </motion.span>
                  )}
                  {gotra && (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-xs font-semibold text-secondary bg-secondary/20 px-3 py-1.5 rounded-full border border-secondary/30"
                    >
                      {gotra} Gotra
                    </motion.span>
                  )}
                </div>
              </div>
            )}

            {/* Education and Profession */}
            <div className="space-y-3">
              {education && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{education}</span>
                </motion.div>
              )}
              {profession && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-secondary" />
                  </div>
                  <span className="font-medium">{profession}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-border/30">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDislike}
              className="flex-1 py-3 rounded-full bg-muted hover:bg-destructive/20 hover:text-destructive transition-all duration-300 flex items-center justify-center gap-2 font-semibold border-2 border-transparent hover:border-destructive/30"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Pass</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLike}
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-primary to-rose-500 hover:shadow-lg text-white flex items-center justify-center gap-2 font-semibold transition-all duration-300"
            >
              <Heart className="w-5 h-5 fill-current" />
              <span className="hidden sm:inline text-sm">Like</span>
            </motion.button>
          </div>

          {/* Swipe hint */}
          {!swipeDirection && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="text-xs text-muted-foreground text-center mt-3"
            >
              Swipe or use buttons
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
