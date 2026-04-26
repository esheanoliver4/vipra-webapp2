'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from './ProfileCard';

export interface ProfileImage {
  id: string;
  image_url: string;
  order: number;
  is_primary: boolean;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  location_city: string;
  location_state?: string;
  profile_image_url?: string;
  education?: string;
  profession?: string;
  occupation?: string;
  short_bio?: string;
  bio?: string;
  gotra?: string;
  religion?: string;
  profileImages?: ProfileImage[];
}

interface CardStackProps {
  profiles: Profile[];
  onLike: (profileId: string) => void;
  onDislike: (profileId: string) => void;
  isLoading?: boolean;
}

export default function CardStack({
  profiles,
  onLike,
  onDislike,
  isLoading = false,
}: CardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const currentProfile = profiles[currentIndex];
  const currentImages = currentProfile?.profileImages || (currentProfile?.profile_image_url ? [{ id: '1', image_url: currentProfile.profile_image_url, order: 0, is_primary: true }] : []);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleLike = () => {
    setDirection('right');
    if (currentProfile) {
      onLike(currentProfile.id);
    }
    resetCard();
  };

  const handleDislike = () => {
    setDirection('left');
    if (currentProfile) {
      onDislike(currentProfile.id);
    }
    resetCard();
  };

  const resetCard = () => {
    setCurrentIndex(prev => prev + 1);
    setImageIndex(0);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageIndex < currentImages.length - 1) {
      setImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imageIndex > 0) {
      setImageIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-muted/50 rounded-2xl">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No more profiles</p>
          <p className="text-sm text-muted-foreground">Check back later for more matches!</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-muted/50 rounded-2xl">
        <div className="text-center">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-lg font-semibold text-foreground mb-2">You&apos;ve reviewed all profiles!</p>
          <p className="text-sm text-muted-foreground">Come back tomorrow for new matches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full px-4 sm:px-0 max-w-full sm:max-w-2xl mx-auto py-8">
      <AnimatePresence>
        {currentIndex < profiles.length && (
          <motion.div
            key={currentProfile.id}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              x: direction === 'right' ? 500 : -500,
              rotate: direction === 'right' ? 15 : -15,
              scale: 0.8,
            }}
            transition={{ 
              duration: 0.4,
              type: 'spring',
              damping: 20,
              stiffness: 200,
            }}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden hover-lift"
          >
            {/* Image Carousel */}
            <div className="relative w-full h-80 sm:h-96 md:h-[500px] bg-gradient-to-b from-gray-200 to-gray-300">
              {currentImages.length > 0 ? (
                <>
                  <img
                    src={currentImages[imageIndex].image_url}
                    alt={`${currentProfile.first_name} ${imageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image Navigation */}
                  <div className="absolute top-0 left-0 right-0 h-12 flex">
                    {currentImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 transition-colors ${
                          idx === imageIndex ? 'bg-white/50' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Previous Image Button */}
                  {imageIndex > 0 && (
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                  )}

                  {/* Next Image Button */}
                  {imageIndex < currentImages.length - 1 && (
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {imageIndex + 1}/{currentImages.length}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <span className="text-gray-600 text-lg">No photos</span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="p-4 sm:p-6 space-y-4 animate-slideInUp">
              {/* Name and Age/Location */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentProfile.first_name} {currentProfile.last_name}
                  <span className="ml-2 text-gray-600">{calculateAge(currentProfile.date_of_birth)}</span>
                </h2>
                <p className="text-gray-500 flex items-center gap-1">
                  📍 {currentProfile.location_city}
                  {currentProfile.location_state && `, ${currentProfile.location_state}`}
                </p>
              </div>

              {/* Short Bio / Profession */}
              {(currentProfile.short_bio || currentProfile.profession) && (
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-gray-800">
                    {currentProfile.short_bio || currentProfile.profession}
                  </p>
                </div>
              )}

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {currentProfile.profession && (
                  <div className="bg-gray-100 rounded-lg p-2">
                    <span className="text-gray-600">💼 {currentProfile.profession}</span>
                  </div>
                )}
                {currentProfile.education && (
                  <div className="bg-gray-100 rounded-lg p-2">
                    <span className="text-gray-600">🎓 {currentProfile.education}</span>
                  </div>
                )}
                {currentProfile.religion && (
                  <div className="bg-gray-100 rounded-lg p-2">
                    <span className="text-gray-600">🙏 {currentProfile.religion}</span>
                  </div>
                )}
                {currentProfile.gotra && (
                  <div className="bg-gray-100 rounded-lg p-2">
                    <span className="text-gray-600">👨‍👩‍👧‍👦 {currentProfile.gotra}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 sm:gap-4 pt-4">
                <motion.button
                  onClick={handleDislike}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 hover:shadow-lg text-gray-800 font-semibold py-3 sm:py-4 rounded-full transition-all duration-300 text-base sm:text-lg"
                  aria-label="Pass"
                >
                  ✕
                </motion.button>
                <motion.button
                  onClick={handleLike}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gradient-red-pink hover:shadow-xl text-white font-semibold py-3 sm:py-4 rounded-full transition-all duration-300 text-base sm:text-lg animate-pulse"
                  aria-label="Like"
                >
                  ❤️
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="text-center mt-6 text-sm sm:text-base text-gradient-red-pink font-semibold animate-fadeInUp">
        {currentIndex + 1} of {profiles.length} matches
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / profiles.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="h-full bg-gradient-red-pink rounded-full"
        />
      </div>
    </div>
  );
}
