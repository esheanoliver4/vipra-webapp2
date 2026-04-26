// Personal Information Form Step
import React from 'react';
import { User, Camera, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PersonalInformationStep = ({ profileData, handleInputChange, handleFileUpload }: any) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      {/* Photo Upload */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {profileData.personalInfo.profilePhoto ? (
            <img
              src={profileData.personalInfo.profilePhoto}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-border"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-border">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Button
            type="button"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full h-10 w-10"
            asChild
          >
            <label className="cursor-pointer flex items-center justify-center">
              <Plus className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2">First Name</Label>
          <Input
            type="text"
            value={profileData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="mb-2">Last Name</Label>
          <Input
            type="text"
            value={profileData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="mb-2">Date of Birth</Label>
          <Input
            type="date"
            value={profileData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="mb-2">Gender</Label>
          <Select
            value={profileData.personalInfo.gender}
            onValueChange={(value) => handleInputChange('personalInfo', 'gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2">Height</Label>
          <Input
            type="text"
            value={profileData.personalInfo.height}
            onChange={(e) => handleInputChange('personalInfo', 'height', e.target.value)}
            placeholder="e.g., 5'8&quot;"
          />
        </div>
        <div>
          <Label className="mb-2">Religion</Label>
          <Input
            type="text"
            value={profileData.personalInfo.religion}
            onChange={(e) => handleInputChange('personalInfo', 'religion', e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2">Mother Tongue</Label>
          <Input
            type="text"
            value={profileData.personalInfo.motherTongue}
            onChange={(e) => handleInputChange('personalInfo', 'motherTongue', e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-2">Marital Status</Label>
          <Select
            value={profileData.personalInfo.maritalStatus}
            onValueChange={(value) => handleInputChange('personalInfo', 'maritalStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationStep;
