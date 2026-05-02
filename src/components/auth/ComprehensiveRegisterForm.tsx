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
import { Eye, EyeOff, CheckCircle, XCircle, Loader2, ArrowLeft, Heart, Globe, Info } from 'lucide-react'
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
    mode: 'onChange',
    defaultValues: {
      siblings: 0,
      nri: 'no',
      disability: 'no',
      maritalStatus: 'Never Married',
    }
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
    const fieldsByStep: Record<number, (keyof RegistrationData)[]> = {
      1: ['name', 'email', 'password', 'confirmPassword'],
      2: ['gender', 'dob', 'profileFor', 'maritalStatus'],
      3: ['gotra', 'currentPracticedGotra', 'religion', 'caste', 'motherTongue'],
      4: ['city', 'timeOfBirth', 'placeOfBirth', 'nri', 'disability'],
      5: ['fatherName', 'motherName', 'parentsContactNumber', 'siblings', 'profession', 'education']
    }

    const fieldsToValidate = fieldsByStep[currentStep] || []
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-foreground mb-2">Join VipraPariwar</h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Step {currentStep} of {totalSteps}</p>
        </div>

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
          <Card className="rounded-2xl border-2 border-slate-900 shadow-none">
            <CardContent className="p-8">
              {/* Step 1: Basic Account */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <CardTitle className="text-2xl font-black mb-6">Create Your Account</CardTitle>
                  <div className="space-y-4">
                    <div>
                      <Label className="font-bold mb-1.5 block">Full Name *</Label>
                      <Input {...register('name')} placeholder="e.g. Nikita Bijawat" className="h-12 border-2" />
                      {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label className="font-bold mb-1.5 block">Email Address *</Label>
                      <Input type="email" {...register('email')} placeholder="e.g. name@example.com" className="h-12 border-2" />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email.message}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-bold mb-1.5 block">Password *</Label>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} {...register('password')} onChange={(e) => { register('password').onChange(e); onPasswordChange(e); }} placeholder="••••••••" className="h-12 border-2 pr-10" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label className="font-bold mb-1.5 block">Confirm Password *</Label>
                        <div className="relative">
                          <Input type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')} placeholder="••••••••" className="h-12 border-2 pr-10" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <CardTitle className="text-2xl font-black mb-6">Personal Details</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="font-bold">Gender *</Label>
                      <Select value={watch('gender') || ''} onValueChange={(v) => setValue('gender', v as any)}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                      </Select>
                      {errors.gender && <p className="text-red-500 text-xs font-bold">{errors.gender.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Date of Birth *</Label>
                      <Input type="date" {...register('dob')} className="h-12 border-2" />
                      {errors.dob && <p className="text-red-500 text-xs font-bold">{errors.dob.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Profile for *</Label>
                      <Select value={watch('profileFor') || ''} onValueChange={(v) => setValue('profileFor', v as any)}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {['self', 'sister', 'daughter', 'brother', 'son', 'friend', 'relative', 'other'].map(v => <SelectItem key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Marital Status *</Label>
                      <Select value={watch('maritalStatus') || ''} onValueChange={(v) => setValue('maritalStatus', v)}>
                        <SelectTrigger className="h-12 border-2"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Brahmin Identity */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <CardTitle className="text-2xl font-black mb-6">Cultural & Identity</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="font-bold">Rishi Gotra *</Label>
                      <Select value={watch('gotra') || ''} onValueChange={(v) => setValue('gotra', v)}>
                        <SelectTrigger className="h-12 border-2"><SelectValue placeholder="Select Gotra" /></SelectTrigger>
                        <SelectContent className="max-h-60">
                          {prioritizedGotras.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {errors.gotra && <p className="text-red-500 text-xs font-bold">{errors.gotra.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Practiced Gotra *</Label>
                      <Input {...register('currentPracticedGotra')} placeholder="e.g. Kaushika" className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Religion *</Label>
                      <Input {...register('religion')} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Caste *</Label>
                      <Input {...register('caste')} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="font-bold">Mother Tongue *</Label>
                      <Input {...register('motherTongue')} placeholder="e.g. Hindi" className="h-12 border-2" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Location & Status */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <CardTitle className="text-2xl font-black mb-6">Birth & Status</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="font-bold">Current City *</Label>
                      <Input {...register('city')} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Place of Birth *</Label>
                      <Input {...register('placeOfBirth')} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Time of Birth *</Label>
                      <Input type="time" {...register('timeOfBirth')} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">NRI Status</Label>
                      <Select value={watch('nri') || 'no'} onValueChange={(v) => setValue('nri', v as any)}>
                        <SelectTrigger className="h-12 border-2"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="no">No</SelectItem><SelectItem value="yes">Yes</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Disability Status</Label>
                      <Select value={watch('disability') || 'no'} onValueChange={(v) => setValue('disability', v as any)}>
                        <SelectTrigger className="h-12 border-2"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="no">No</SelectItem><SelectItem value="yes">Yes</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Family & Career */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <CardTitle className="text-2xl font-black mb-6">Family & Career</CardTitle>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <Label className="font-bold">Father&apos;s Name *</Label>
                      <Input {...register('fatherName')} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Mother&apos;s Name *</Label>
                      <Input {...register('motherName')} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Parents Contact *</Label>
                      <Input {...register('parentsContactNumber')} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Number of Siblings</Label>
                      <Input type="number" {...register('siblings', { valueAsNumber: true })} className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Education</Label>
                      <Input {...register('education')} placeholder="e.g. MBA" className="h-12 border-2" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold">Profession</Label>
                      <Input {...register('profession')} placeholder="e.g. HR Manager" className="h-12 border-2" />
                    </div>
                  </div>
                  <div className="pt-6 border-t">
                    <div className="flex items-start gap-3">
                      <Checkbox id="terms" checked={isTermsAgreed} onCheckedChange={(v) => setIsTermsAgreed(v as boolean)} />
                      <label htmlFor="terms" className="text-xs font-bold text-slate-500 leading-tight">
                        I agree to the terms and conditions and privacy policy of VipraPariwar.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 mt-10">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(currentStep - 1)} className="flex-1 h-12 border-2 font-black uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                )}
                <Button 
                  type={currentStep === totalSteps ? 'submit' : 'button'} 
                  onClick={currentStep < totalSteps ? handleNextStep : undefined}
                  disabled={isLoading || (currentStep === totalSteps && !isTermsAgreed)} 
                  className="flex-1 h-12 bg-primary hover:bg-primary font-black uppercase tracking-widest text-xs"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (currentStep === totalSteps ? 'Complete Registration' : 'Next Step')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
