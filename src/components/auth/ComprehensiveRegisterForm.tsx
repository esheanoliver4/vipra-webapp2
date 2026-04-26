'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registrationSchema, type RegistrationData } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import gotras from '@/data/gotras.json'

const COMMON_RISHI_GOTRAS = [
  'Vashistha',
  'Kashyapa',
  'Gautama',
  'Bharadwaja',
  'Vishvamitra',
  'Atri',
  'Bhrigu',
]

const uniqueGotras = Array.from(new Set(gotras))
const prioritizedGotras = [
  ...COMMON_RISHI_GOTRAS.filter((g) => uniqueGotras.includes(g)),
  ...uniqueGotras.filter((g) => !COMMON_RISHI_GOTRAS.includes(g)),
]

export default function ComprehensiveRegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isTermsAgreed, setIsTermsAgreed] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange'
  })

  const password = watch('password', '')

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })

  const checkPasswordStrength = (pwd: string) => {
    setPasswordStrength({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    })
  }

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    checkPasswordStrength(value)
  }

  const handleNextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ['name', 'email', 'password', 'confirmPassword']
      : currentStep === 2
      ? ['gender', 'dob', 'profileFor']
      : currentStep === 3
      ? ['gotra', 'currentPracticedGotra', 'religion', 'caste']
      : currentStep === 4
      ? ['city', 'timeOfBirth', 'placeOfBirth']
      : ['fatherName', 'motherName', 'parentsContactNumber']

    const isValid = await trigger(fieldsToValidate as any)
    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const onSubmit = async (data: RegistrationData) => {
    if (!isTermsAgreed) {
      toast.error('You must agree to the terms and conditions')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || 'Registration failed')
        return
      }

      toast.success('Registration successful! Redirecting to login...')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error) {
      toast.error('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  const totalSteps = 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Join VipraPariwaar
          </h1>
          <p className="text-muted-foreground">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all ${
                i < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-8">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <CardTitle className="mb-6">Create Your Account</CardTitle>
                  </div>

                  <div>
                    <Label htmlFor="name" className="mb-2 block">Full Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter your full name"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email" className="mb-2 block">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password" className="mb-2 block">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        onChange={(e) => {
                          register('password').onChange(e)
                          onPasswordChange(e)
                        }}
                        placeholder="Create a strong password"
                        className="h-11 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          {passwordStrength.length ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm text-muted-foreground">At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordStrength.uppercase ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm text-muted-foreground">One uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordStrength.lowercase ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm text-muted-foreground">One lowercase letter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordStrength.number ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm text-muted-foreground">One number</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {passwordStrength.special ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm text-muted-foreground">One special character (!@#$%^&*)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="mb-2 block">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        placeholder="Confirm your password"
                        className="h-11 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <CardTitle className="mb-6">Personal Information</CardTitle>
                  </div>

                  <div>
                    <Label htmlFor="gender" className="mb-2 block">Gender *</Label>
                    <Select
                      value={watch('gender') || ''}
                      onValueChange={(value) => setValue('gender', value as any)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="dob" className="mb-2 block">Date of Birth (YYYY-MM-DD) *</Label>
                    <Input
                      id="dob"
                      type="date"
                      {...register('dob')}
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="profileFor" className="mb-2 block">Profile is for *</Label>
                    <Select
                      value={watch('profileFor') || ''}
                      onValueChange={(value) => setValue('profileFor', value as any)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select who this profile is for" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Myself</SelectItem>
                        <SelectItem value="sister">Sister</SelectItem>
                        <SelectItem value="daughter">Daughter</SelectItem>
                        <SelectItem value="brother">Brother</SelectItem>
                        <SelectItem value="son">Son</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.profileFor && <p className="text-red-500 text-sm mt-1">{errors.profileFor.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Brahmin Identity */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <CardTitle className="mb-6">Brahmin Community Details</CardTitle>
                  </div>

                  <div>
                    <Label htmlFor="gotra" className="mb-2 block">Rishi Gotra *</Label>
                    <Select
                      value={watch('gotra') || ''}
                      onValueChange={(value) => setValue('gotra', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your Rishi Gotra" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {prioritizedGotras.map((gotra) => (
                          <SelectItem key={gotra} value={gotra}>
                            {gotra}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.gotra && <p className="text-red-500 text-sm mt-1">{errors.gotra.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="currentPracticedGotra" className="mb-2 block">Currently Practiced Gotra *</Label>
                    <Input
                      id="currentPracticedGotra"
                      {...register('currentPracticedGotra')}
                      placeholder="Enter your current practiced gotra"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.currentPracticedGotra && <p className="text-red-500 text-sm mt-1">{errors.currentPracticedGotra.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="religion" className="mb-2 block">Religion *</Label>
                    <Input
                      id="religion"
                      {...register('religion')}
                      placeholder="e.g. Hinduism"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="caste" className="mb-2 block">Caste *</Label>
                    <Input
                      id="caste"
                      {...register('caste')}
                      placeholder="e.g. Brahmin"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.caste && <p className="text-red-500 text-sm mt-1">{errors.caste.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 4: Birth & Location */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <CardTitle className="mb-6">Birth Details</CardTitle>
                  </div>

                  <div>
                    <Label htmlFor="city" className="mb-2 block">City *</Label>
                    <Input
                      id="city"
                      {...register('city')}
                      placeholder="Enter your city"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="timeOfBirth" className="mb-2 block">Time of Birth (HH:MM) *</Label>
                    <Input
                      id="timeOfBirth"
                      type="time"
                      {...register('timeOfBirth')}
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.timeOfBirth && <p className="text-red-500 text-sm mt-1">{errors.timeOfBirth.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="placeOfBirth" className="mb-2 block">Place of Birth *</Label>
                    <Input
                      id="placeOfBirth"
                      {...register('placeOfBirth')}
                      placeholder="Enter your place of birth"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.placeOfBirth && <p className="text-red-500 text-sm mt-1">{errors.placeOfBirth.message}</p>}
                  </div>
                </div>
              )}

              {/* Step 5: Family & Completion */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <CardTitle className="mb-6">Family Information</CardTitle>
                  </div>

                  <div>
                    <Label htmlFor="fatherName" className="mb-2 block">Father's Name *</Label>
                    <Input
                      id="fatherName"
                      {...register('fatherName')}
                      placeholder="Enter father's name"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="motherName" className="mb-2 block">Mother's Name *</Label>
                    <Input
                      id="motherName"
                      {...register('motherName')}
                      placeholder="Enter mother's name"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.motherName && <p className="text-red-500 text-sm mt-1">{errors.motherName.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="parentsContactNumber" className="mb-2 block">Parents' Contact Number *</Label>
                    <Input
                      id="parentsContactNumber"
                      {...register('parentsContactNumber')}
                      placeholder="Enter contact number"
                      className="h-11"
                      disabled={isLoading}
                    />
                    {errors.parentsContactNumber && <p className="text-red-500 text-sm mt-1">{errors.parentsContactNumber.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="education" className="mb-2 block">Education</Label>
                    <Input
                      id="education"
                      {...register('education')}
                      placeholder="e.g. B.Tech, M.Com"
                      className="h-11"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="profession" className="mb-2 block">Profession</Label>
                    <Input
                      id="profession"
                      {...register('profession')}
                      placeholder="e.g. Software Engineer, Doctor"
                      className="h-11"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={isTermsAgreed}
                        onCheckedChange={(checked) => setIsTermsAgreed(checked as boolean)}
                        disabled={isLoading}
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                        I agree to the terms and conditions and privacy policy of VipraPariwaar
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isLoading}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !isTermsAgreed}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
