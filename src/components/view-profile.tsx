'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Phone, Heart, CheckCircle, MessageCircle, User, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string
  email?: string
  password?: string
  profile_pic: string | null
  sub_caste?: string
  dob?: Date
  time_of_birth?: string | null
  place_of_birth?: string
  gender: string
  father_name?: string
  mother_name?: string
  profession: string
  education: string
  company_working_at?: string | null
  school_name?: string | null
  college_name?: string | null
  hobbies?: string | null
  fav_things?: string | null
  siblings?: number
  parents_contact_number?: string | null
  marital_status?: string
  mother_tongue?: string
  age: number
  city: string
  nri?: string | null
  disability?: string | null
  payment_id?: string | null
  status?: string
  payment_status?: boolean
  height?: string | null
  weight?: string | null
  color_complexion?: string | null
  family_type?: string | null
  languages_known?: string | null
  Manglik?: string | null
  gotra?: string | null
  graduation_year?: number | null
  industry?: string | null
  pronouns?: string | null
  paternal?: string | null
  maternal?: string | null
  created_at?: Date
  updated_at?: Date
}

interface ViewProfileProps {
  user: UserProfile | null
  isOpen: boolean
  onClose: () => void
  onContact?: (user: UserProfile) => void
  onConnect?: (user: UserProfile) => void
  onRemoveInterest?: (user: UserProfile) => void
  isInInterests?: boolean
  showContactButton?: boolean
  showConnectButton?: boolean
  currentUserPaymentStatus?: boolean
  isOwnProfile?: boolean
}

export function ViewProfile({
  user,
  isOpen,
  onClose,
  onContact,
  onConnect,
  onRemoveInterest,
  isInInterests = false,
  showContactButton = true,
  showConnectButton = true,
  currentUserPaymentStatus = false,
  isOwnProfile = false
}: ViewProfileProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())
  
  // Safely parse profile images
  let profileImages: string[] = []
  try {
    if ((user as any)?.profile_images) {
      const parsed = typeof (user as any).profile_images === 'string' 
        ? JSON.parse((user as any).profile_images) 
        : (user as any).profile_images
      profileImages = Array.isArray(parsed) ? parsed : []
    }
  } catch (error) {
    console.error('Error parsing profile images:', error)
    profileImages = []
  }

  const handleContact = () => {
    if (!currentUserPaymentStatus) {
      toast.error('Restricted until payment')
      return
    }
    
    // Check if both email and mobile are hidden
    const emailVisible = isOwnProfile || (user as any).show_email_public === true
    const mobileVisible = isOwnProfile || ((user as any).show_mobile_public === true && (user as any).hide_number !== true)
    
    if (!emailVisible && !mobileVisible) {
      toast.error('Contact information is hidden by the user')
      return
    }
    
    const allowPublicContact =
      isOwnProfile || ((user as any).show_mobile_public === true && (user as any).hide_number !== true)
    if (!allowPublicContact) {
      toast.error('Contact number is hidden by the user')
      return
    }
    if (onContact && user) {
      onContact(user)
    } else if (user?.parents_contact_number) {
      const phoneNumber = user.parents_contact_number.replace(/\s+/g, '')
      const phoneLink = `tel:${phoneNumber}`
      window.open(phoneLink, '_blank')
    } else {
      toast.error('Contact number not available')
    }
  }

  const handleConnect = () => {
    if (!currentUserPaymentStatus) {
      toast.error('Restricted until payment')
      return
    }
    if (onConnect && user) {
      onConnect(user)
    }
  }

  const handleRemoveInterest = () => {
    if (!currentUserPaymentStatus) {
      toast.error('Restricted until payment')
      return
    }
    if (onRemoveInterest && user) {
      onRemoveInterest(user)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card" style={{ 
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 0
      }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {user.name}'s Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40 bg-gradient-to-br bg-card rounded-lg overflow-hidden border-4 border-border shadow-lg aspect-square">
              {user.profile_pic && !imageFailed && (((user as any).show_photo_public ?? true) || isOwnProfile) ? (
                <Image
                  src={user.profile_pic}
                  alt={user.name}
                  fill
                  sizes="160px"
                  className={`object-cover object-center ${(currentUserPaymentStatus || isOwnProfile) ? '' : 'blur-md'}`}
                  style={{ objectPosition: 'center' }}
                  unoptimized={user.profile_pic?.startsWith('http://localhost')}
                  onError={() => {
                    console.error('Image failed to load:', user.profile_pic);
                    setImageFailed(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-20 w-20 text-muted-foreground" />
                </div>
              )}
              {/* Blur overlay for non-paying users */}
              {!currentUserPaymentStatus && !isOwnProfile && user.profile_pic && !imageFailed && ((user as any).show_photo_public ?? true) && (
                <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                    Payment Required
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Profile Images - respect hide_additional_pics */}
          {profileImages.length > 0 && (isOwnProfile || (currentUserPaymentStatus && (user as any).hide_additional_pics !== true)) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Additional Images
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {profileImages.map((imageUrl: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-border"
                  >
                    {!imageErrors.has(index) ? (
                      <Image
                        src={imageUrl}
                        alt={`Profile image ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                        onError={() => {
                          setImageErrors(prev => new Set(prev).add(index))
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-orange-700 mb-3 text-lg border-b border-orange-200 pb-1">Personal Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span className="font-medium">{user.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium capitalize">{user.gender}</span>
                </div>
                {user.pronouns && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pronouns:</span>
                    <span className="font-medium">{user.pronouns}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium">{user.city}</span>
                </div>
                {user.dob && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date of Birth:</span>
                    <span className="font-medium">
                      {(() => {
                        const date = new Date(user.dob);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                      })()}
                    </span>
                  </div>
                )}
                {user.height && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height:</span>
                    <span className="font-medium">{user.height} cm</span>
                  </div>
                )}
                {((user as any).current_practiced_gotra || user.gotra) && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gotra:</span>
                    <span className="font-medium">{(user as any).current_practiced_gotra || user.gotra}</span>
                  </div>
                )}
                {(user as any).blood_group && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood group:</span>
                    <span className="font-medium">{(user as any).blood_group}</span>
                  </div>
                )}
                {user.color_complexion && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Complexion:</span>
                    <span className="font-medium capitalize">{user.color_complexion.replace('_', ' ')}</span>
                  </div>
                )}
                {user.marital_status && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Marital Status:</span>
                    <span className="font-medium capitalize">{user.marital_status.replace('_', ' ')}</span>
                  </div>
                )}
                {user.nri && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">NRI Status:</span>
                    <span className="font-medium capitalize">{user.nri}</span>
                  </div>
                )}
                {user.disability && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disability Status:</span>
                    <span className="font-medium capitalize">{user.disability}</span>
                  </div>
                )}
                {(user as any).birth_pincode && (isOwnProfile || currentUserPaymentStatus) && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pin Code:</span>
                    <span className="font-medium">{(user as any).birth_pincode}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-orange-700 mb-3 text-lg border-b border-orange-200 pb-1">Family Information</h4>
              <div className="space-y-2 text-sm">
                {user.father_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Father's Name:</span>
                    <span className="font-medium">{user.father_name}</span>
                  </div>
                )}
                {user.mother_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mother's Name:</span>
                    <span className="font-medium">{user.mother_name}</span>
                  </div>
                )}
                {user.siblings !== undefined && user.siblings !== null && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Siblings:</span>
                    <span className="font-medium">{user.siblings}</span>
                  </div>
                )}
                {user.family_type && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Family Type:</span>
                    <span className="font-medium capitalize">{user.family_type.replace('_', ' ')}</span>
                  </div>
                )}
                {user.paternal && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paternal:</span>
                    <span className="font-medium">{user.paternal}</span>
                  </div>
                )}
                {user.maternal && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maternal:</span>
                    <span className="font-medium">{user.maternal}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h4 className="font-semibold text-orange-700 mb-3 text-lg border-b border-orange-200 pb-1">Professional Information</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profession:</span>
                  <span className="font-medium">{user.profession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Education:</span>
                  <span className="font-medium capitalize">{(user.education || 'Not specified').replace('_', ' ')}</span>
                </div>
                {user.company_working_at && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span>
                    <span className="font-medium">{user.company_working_at}</span>
                  </div>
                )}
                {user.industry && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="font-medium">{user.industry}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {user.school_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">School:</span>
                    <span className="font-medium">{user.school_name}</span>
                  </div>
                )}
                {user.college_name && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">College:</span>
                    <span className="font-medium">{user.college_name}</span>
                  </div>
                )}
                {user.graduation_year && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Graduation Year:</span>
                    <span className="font-medium">{user.graduation_year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cultural & Religious Information */}
          <div>
            <h4 className="font-semibold text-orange-700 mb-3 text-lg border-b border-orange-200 pb-1">Cultural & Religious Information</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                {(user as any).current_practiced_gotra && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gotra:</span>
                    <span className="font-medium">{(user as any).current_practiced_gotra}</span>
                  </div>
                )}
                {user.gotra && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rishi Gotra:</span>
                    <span className="font-medium">{user.gotra}</span>
                  </div>
                )}
                {user.sub_caste && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sub Caste:</span>
                    <span className="font-medium">{user.sub_caste}</span>
                  </div>
                )}
                {user.mother_tongue && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mother Tongue:</span>
                    <span className="font-medium">{user.mother_tongue}</span>
                  </div>
                )}
                {user.languages_known && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Languages Known:</span>
                    <span className="font-medium">{user.languages_known}</span>
                  </div>
                )}
                {user.Manglik && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manglik:</span>
                    <span className="font-medium capitalize">{user.Manglik}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {user.hobbies && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hobbies:</span>
                    <span className="font-medium">{user.hobbies}</span>
                  </div>
                )}
                {user.fav_things && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Favorite Things:</span>
                    <span className="font-medium">{user.fav_things}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          {(user.email || user.parents_contact_number || ((user as any).current_address || (user as any).current_address_line1) || (user as any).house) && (
            <div>
              <h4 className="font-semibold text-orange-700 mb-3 text-lg border-b border-orange-200 pb-1">Contact Information</h4>
              <div className="space-y-2 text-sm">
                {user.email && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium break-words sm:text-right">
                      {isOwnProfile || (user as any).show_email_public
                        ? (user.email ?? "").toLowerCase()
                        : 'Hidden by user'}
                    </span>
                  </div>
                )}
                {user.parents_contact_number && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Parents Contact:</span>
                    <span className="font-medium break-words sm:text-right">
                      {!currentUserPaymentStatus && !isOwnProfile
                        ? 'Restricted until payment'
                        : (isOwnProfile || ((user as any).show_mobile_public && (user as any).hide_number !== true))
                        ? user.parents_contact_number
                        : 'Hidden by user'}
                    </span>
                  </div>
                )}
                {/* {((user as any).current_address || (user as any).current_address_line1) && (isOwnProfile || currentUserPaymentStatus) && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Current Address:</span>
                    <span className="font-medium break-words sm:text-right">
                      {(() => {
                        const city = (user as any).current_city;
                        const district = (user as any).current_district;
                        const addressParts = [city, district].filter(Boolean);
                        return addressParts.length > 0 ? addressParts.join(", ") : ((user as any).current_address || "");
                      })()}
                    </span>
                  </div>
                )} */}
                {/* {(user as any).digi_pin && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Digi Pin:</span>
                    <span className="font-medium break-words sm:text-right">{(user as any).digi_pin}</span>
                  </div>
                )} */}
                {(user as any).house && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-muted-foreground">House:</span>
                    <span className="font-medium break-words sm:text-right">{(user as any).house}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 pt-4">
            <div className="flex space-x-3">
              {showContactButton && (() => {
                const emailVisible = isOwnProfile || (user as any).show_email_public === true
                const mobileVisible = isOwnProfile || ((user as any).show_mobile_public === true && (user as any).hide_number !== true)
                const contactDisabled = !currentUserPaymentStatus || (!emailVisible && !mobileVisible)
                
                return (
                  <Button 
                    onClick={handleContact}
                    className={`flex-1 ${currentUserPaymentStatus && (emailVisible || mobileVisible) ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
                    disabled={contactDisabled}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {contactDisabled 
                      ? (!currentUserPaymentStatus ? 'Contact (restricted)' : 'Contact (hidden)')
                      : 'Contact'}
                  </Button>
                )
              })()}
              
              {showConnectButton && (
                isInInterests ? (
                  <Button 
                    onClick={handleRemoveInterest}
                    variant="outline" 
                    className={`flex-1 ${currentUserPaymentStatus ? 'border-red-300 dark:border-red-500/50 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10' : 'border-border text-muted-foreground'}`}
                    disabled={!currentUserPaymentStatus}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {currentUserPaymentStatus ? 'Remove Interest' : 'Remove Interest (restricted)'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleConnect}
                    variant="outline" 
                    className={`flex-1 ${currentUserPaymentStatus ? '' : 'opacity-50'}`}
                    disabled={!currentUserPaymentStatus}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    {currentUserPaymentStatus ? 'Connect' : 'Connect (restricted)'}
                  </Button>
                )
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 opacity-50 cursor-not-allowed" 
              disabled
              onClick={(e) => e.preventDefault()}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Profile 
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
