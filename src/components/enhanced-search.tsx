'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, X } from 'lucide-react'

export interface SearchFilters {
  city: string
  familyMemberName: string
  keyword: string
  name: string
  profileId: string
}

interface EnhancedSearchProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  onReset: () => void
  hideHeader?: boolean
}

export function EnhancedSearch({ filters, onFiltersChange, onSearch, onReset, hideHeader = false }: EnhancedSearchProps) {
  const [activeTab, setActiveTab] = useState('quick')

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Search profiles</h3>
          <Button onClick={onReset} variant="outline" size="sm">
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
       
        <TabsContent value="quick" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Search by name"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="profileId">Profile ID</Label>
              <Input
                id="profileId"
                placeholder="Search by Profile ID"
                value={filters.profileId}
                onChange={(e) => handleFilterChange('profileId', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city name"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="familyMemberName">Family member</Label>
              <Input
                id="familyMemberName"
                placeholder="Father, mother, Dada, Dadi, Nana, Nani, etc."
                value={filters.familyMemberName}
                onChange={(e) => handleFilterChange('familyMemberName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="keyword">Keyword</Label>
              <Input
                id="keyword"
                placeholder="Name, profession, education, gotra, etc."
                value={filters.keyword}
                onChange={(e) => handleFilterChange('keyword', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onSearch} className="bg-orange-600 hover:bg-orange-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 