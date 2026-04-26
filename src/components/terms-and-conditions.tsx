'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TermsAndConditionsProps {
  isOpen: boolean
  onClose: () => void
  onAgree: () => void
  isAgreed: boolean
  onAgreementChange: (agreed: boolean) => void
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ 
  isOpen, 
  onClose, 
  onAgree, 
  isAgreed, 
  onAgreementChange 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-white border-2 border-orange-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-orange-800">
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4 text-gray-700">
            <p className="text-sm text-gray-600 mb-4">
              By registering on Viprapariwar Matrimony, you agree to these Terms and Conditions.
            </p>
            
            <ol className="list-decimal list-inside space-y-3 text-sm leading-relaxed">
              <li>
                <strong>Registration & Legal Age Requirements:</strong> To register on Viprapariwar Matrimony, you must be single, divorced, or widowed and provide accurate and truthful information about yourself. As per Indian law, the minimum legal age for marriage is <strong>18 years for females</strong> and <strong>21 years for males</strong>; you agree not to use this platform to facilitate any marriage below these legal age limits.
              </li>
              
              <li>
                <strong>Profile Ownership:</strong> Your profile is for your personal use only. You are responsible for maintaining the confidentiality of your account and password.
              </li>
              
              <li>
                <strong>Content Responsibility:</strong> You are responsible for all content you upload, post, or communicate on the website. You agree not to post any content that is obscene, defamatory, <strong>illegal</strong>, or harassing.
              </li>
              
              <li>
                <strong>No Harassment:</strong> You agree not to harass, abuse, or threaten other members or staff of Viprapariwar Matrimony.
              </li>
              
              <li>
                <strong>No Fake Profiles:</strong> You agree not to create fake profiles or impersonate others.
              </li>
              
              <li>
                <strong>Payment Terms:</strong> You agree to pay the registration fee of ₹995 to complete your registration. All payments are non-refundable.
              </li>
              
              <li>
                <strong>No Guarantee:</strong> Viprapariwar Matrimony does not guarantee successful matches or relationships.
              </li>
              
              <li>
                <strong>Termination:</strong> Viprapariwar Matrimony reserves the right to terminate or suspend your account at any time, without notice.
              </li>
              
              <li>
                <strong>Liability Limitation:</strong> Viprapariwar Matrimony is not liable for any damages or losses resulting from your use of the website.
              </li>
              
              <li>
                <strong>Governing Law:</strong> These Terms and Conditions are governed by the laws of India. Any disputes will be resolved through arbitration in accordance with Indian law.
              </li>
            </ol>
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2 pt-4 border-t border-orange-200">
          <Checkbox
            id="terms-agreement"
            checked={isAgreed}
            onCheckedChange={(checked) => onAgreementChange(checked as boolean)}
          />
          <label 
            htmlFor="terms-agreement" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-orange-800"
          >
            I agree to the Terms and Conditions
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} className="border-orange-300 text-orange-700 hover:bg-white ">
            Cancel
          </Button>
          <Button 
            onClick={onAgree} 
            disabled={!isAgreed}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
          >
            I Agree
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TermsAndConditions
