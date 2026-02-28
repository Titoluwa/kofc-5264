'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Edit2, Plus, MapPin, Clock, Notebook, Users } from 'lucide-react';
import MemberRegisterForm from '@/components/memberRegisterForm';

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  knightYears: string;
  additionalMessage: string;
}

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  street: '',
  city: '',
  state: '',
  zipcode: '',
  knightYears: '',
  additionalMessage: '',
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/members');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/members/${editingId}` : '/api/members';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save member');

      await fetchMembers();
      setIsOpen(false);
      resetForm();
    } catch (err) {
      setError('Failed to save member');
      console.error(err);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      // Build address from individual fields, not stale formData
      address: [member.street, member.city, member.state, member.zipcode]
        .filter(Boolean)
        .join(' '),
      street: member.street,
      city: member.city,
      state: member.state,
      zipcode: member.zipcode,
      knightYears: member.knightYears,
      additionalMessage: member.additionalMessage,
    });
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const response = await fetch(`/api/members/${deleteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete member');
      await fetchMembers();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to delete member');
    }
  };

  // The member targeted for deletion (for showing name in confirm dialog)
  const memberToDelete = members.find((m) => m.id === deleteId);

  return (
    <div className="p-4 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Members Management</h1>
            {!loading && (
              <Badge variant="secondary" className="flex items-center gap-1.5 text-sm px-2.5 py-1">
                <Users className="w-3.5 h-3.5" />
                {members.length}
                {/* {members.length === 1 ? 'Member' : 'Members'} */}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Create and manage council members
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Member' : 'Create New Member'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update the member details below' : 'Fill in the member details below'}
              </DialogDescription>
            </DialogHeader>
            <MemberRegisterForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              loading={loading}
              formType={editingId ? 'edit' : 'create'}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i + 1} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-5 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {members.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground font-medium">No members yet.</p>
            <p className="text-muted-foreground text-sm mt-1">Click "Add Member" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-primary truncate">
                      {member.firstName} {member.lastName}
                    </CardTitle>
                    <CardDescription className="pt-1 text-blue-600 flex flex-wrap gap-x-1 gap-y-0.5 text-xs sm:text-sm">
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:underline decoration-2 underline-offset-2 truncate max-w-[160px]"
                      >
                        {member.email}
                      </a>
                      <span className="text-muted-foreground">•</span>
                      <a
                        href={`tel:${member.phone}`}
                        className="hover:underline decoration-2 underline-offset-2"
                      >
                        {member.phone}
                      </a>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-accent"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-600"
                      onClick={() => setDeleteId(member.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-2">
                {member.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{member.address}</p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {member.knightYears ?? 'Not specified'} (Membership)
                  </p>
                </div>
                {member.additionalMessage && (
                  <div className="flex items-start gap-2">
                    <Notebook className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {member.additionalMessage}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Single AlertDialog rendered outside the map loop */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              {memberToDelete
                ? `${memberToDelete.firstName} ${memberToDelete.lastName}`
                : 'this member'}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}