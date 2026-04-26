'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  age?: number;
  relationship: string;
  profession?: string;
  education?: string;
  gotra?: string;
}

interface FamilyTreeComponentProps {
  userId: string;
  familyMembers?: FamilyMember[];
}

const relationshipTypes = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'paternal_grandfather', label: 'Paternal Grandfather' },
  { value: 'paternal_grandmother', label: 'Paternal Grandmother' },
  { value: 'maternal_grandfather', label: 'Maternal Grandfather' },
  { value: 'maternal_grandmother', label: 'Maternal Grandmother' },
  { value: 'brother', label: 'Brother' },
  { value: 'sister', label: 'Sister' },
];

export default function FamilyTreeComponent({ userId, familyMembers = [] }: FamilyTreeComponentProps) {
  const [members, setMembers] = useState<FamilyMember[]>(familyMembers);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    relationship: 'father',
    profession: '',
    education: '',
    gotra: ''
  });

  const handleAddMember = async () => {
    if (!formData.name) {
      toast.error('Please enter member name');
      return;
    }

    const newMember: FamilyMember = {
      id: editingId || `temp-${Date.now()}`,
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      relationship: formData.relationship,
      profession: formData.profession,
      education: formData.education,
      gotra: formData.gotra
    };

    if (editingId) {
      setMembers(members.map(m => m.id === editingId ? newMember : m));
      toast.success('Family member updated!');
    } else {
      setMembers([...members, newMember]);
      toast.success('Family member added!');
    }

    resetForm();
    setIsOpen(false);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    toast.success('Family member removed!');
  };

  const handleEditMember = (member: FamilyMember) => {
    setFormData({
      name: member.name,
      age: member.age?.toString() || '',
      relationship: member.relationship,
      profession: member.profession || '',
      education: member.education || '',
      gotra: member.gotra || ''
    });
    setEditingId(member.id);
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      relationship: 'father',
      profession: '',
      education: '',
      gotra: ''
    });
    setEditingId(null);
  };

  const getRelationshipLabel = (type: string) => {
    return relationshipTypes.find(r => r.value === type)?.label || type;
  };

  return (
    <Card className="w-full border-border/50 rounded-2xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Family Tree</CardTitle>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => resetForm()}
                className="bg-gradient-to-r from-primary to-secondary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Family Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {editingId ? 'Edit Family Member' : 'Add Family Member'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Age"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship *</Label>
                    <Select value={formData.relationship} onValueChange={(value) => setFormData({ ...formData, relationship: value })}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="Profession/Occupation"
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="Education"
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gotra">Gotra</Label>
                    <Input
                      id="gotra"
                      value={formData.gotra}
                      onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                      placeholder="Gotra"
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddMember}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    {editingId ? 'Update Member' : 'Add Member'}
                  </Button>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No family members added yet</p>
            <p className="text-sm text-muted-foreground/70">Add family members to build your family tree</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {members.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-gradient-to-r from-white/50 dark:from-slate-900/50 to-white/30 dark:to-slate-900/30 backdrop-blur-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{member.name}</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {getRelationshipLabel(member.relationship)}
                        </span>
                        {member.age && (
                          <span className="text-xs text-muted-foreground">Age: {member.age}</span>
                        )}
                      </div>
                      {(member.profession || member.education || member.gotra) && (
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {member.profession && <p>Profession: {member.profession}</p>}
                          {member.education && <p>Education: {member.education}</p>}
                          {member.gotra && <p>Gotra: {member.gotra}</p>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => handleEditMember(member)}
                        size="sm"
                        variant="ghost"
                        className="hover:bg-primary/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteMember(member.id)}
                        size="sm"
                        variant="ghost"
                        className="hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
