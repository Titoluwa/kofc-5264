'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from "sonner"
import { Trash2, Edit2, Plus, MapPin, Clock, Notebook, Users, Mail, Phone, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MemberRegisterForm from '@/components/memberRegisterForm';
import { MemberCardSkeleton } from '@/components/skeleton';
import { PaginationMeta, PAGE_SIZE } from '@/lib/constants';
import Pagination from '@/components/admin/pagination';

interface Member {
  id: number;
  firstName: string
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

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

// Deterministic avatar color based on name
const AVATAR_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-orange-100 text-orange-700',
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (name.codePointAt(i) ?? 0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/members');
      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load members', 
        { description: 'There was a problem fetching the member list. Please try again.',}
      );
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

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

      toast.success(editingId ? 'Member updated' : 'Member added',
        { description: editingId
          ? `${formData.firstName} ${formData.lastName}'s details have been updated.`
          : `${formData.firstName} ${formData.lastName} has been added to the council.`,
      });
    } catch (err) {
      console.error(err);
      toast.error(editingId ? 'Failed to update member' : 'Failed to add member',
        { description: 'Something went wrong. Please check your connection and try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const target = members.find((m) => m.id === deleteId);
    try {
      const response = await fetch(`/api/members/${deleteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete member');
      await fetchMembers();
      setDeleteId(null);
      toast.success('Member removed',
        { description: target
          ? `${target.firstName} ${target.lastName} has been removed from the council.`
          : 'The member has been removed.',
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete member',
        { description: 'Something went wrong while removing this member. Please try again.',
      });
    }
  };

  const memberToDelete = members.find((m) => m.id === deleteId);
 
  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.city?.toLowerCase().includes(q)
    );
  });
 
  // Reset to page 1 whenever search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
 
  const paginationMeta: PaginationMeta = {
    page: currentPage,
    limit: PAGE_SIZE,
    total: filteredMembers.length,
    totalPages: Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE)),
  };
 
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-8">
 
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-1">
              {/* <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold tracking-widest uppercase mb-2">
                <UserCheck className="w-4 h-4" />
                <span>Council Registry</span>
              </div> */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">Members</h1>
                {!loading && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1.5 text-sm px-2.5 py-0.5 rounded-full"
                  >
                    <Users className="w-3.5 h-3.5" />
                    {members.length}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                View, add, and manage council members
              </p>
            </div>
 
            <Dialog
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={resetForm} className="w-full sm:w-auto gap-2 rounded-xl">
                  <Plus className="w-4 h-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? 'Edit Member' : 'Add New Member'}</DialogTitle>
                  <DialogDescription>
                    {editingId
                      ? 'Update the member details below.'
                      : 'Fill in the details to register a new council member.'}
                  </DialogDescription>
                </DialogHeader>
                <MemberRegisterForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  loading={saving}
                  formType={editingId ? 'edit' : 'create'}
                />
              </DialogContent>
            </Dialog>
          </div>
 
          {/* Search bar */}
          {!loading && members.length > 0 && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, city…"
                className="pl-9 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center italic text-sm text-muted-foreground m-0">
            <span className='mb-3'>Sorted: Newest to Oldest</span>
          </div>
 
          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <MemberCardSkeleton key={i.toFixed()} />
              ))}
            </div>
          )}
 
          {/* Empty state */}
          {!loading && members.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-2xl bg-muted/20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-muted-foreground opacity-60" />
              </div>
              <p className="font-semibold text-lg">No members yet</p>
              <p className="text-muted-foreground text-sm mt-1 mb-5">
                Add your first council member to get started.
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setIsOpen(true);
                }}
                className="gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </div>
          )}
 
          {/* No search results */}
          {!loading && members.length > 0 && filteredMembers.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <p className="font-medium">No members match "{search}"</p>
              <p className="text-sm mt-1">Try a different name, email, or city.</p>
            </div>
          )}
 
          {/* Member Cards Grid */}
          {!loading && filteredMembers.length > 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedMembers.map((member) => {
                const initials = getInitials(member.firstName, member.lastName);
                const colorClass = avatarColor(`${member.firstName}${member.lastName}`);
                const fullAddress = [member.street, member.city, member.state, member.zipcode]
                  .filter(Boolean)
                  .join(', ');
 
                return (
                  <Card
                    key={member.id}
                    className="group flex flex-col border border-border hover:border-border/80 hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        {/* Avatar + name */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${colorClass}`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm leading-tight truncate">
                              {member.firstName} {member.lastName}
                            </p>
                            {member.knightYears && (
                              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {member.knightYears}
                              </p>
                            )}
                          </div>
                        </div>
 
                        {/* Actions */}
                        <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                            onClick={() => handleEdit(member)}
                            title="Edit member"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                            onClick={() => setDeleteId(member.id)}
                            title="Delete member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
 
                    <CardContent className="flex-1 space-y-2 pt-0">
                      {/* Divider */}
                      <div className="h-px bg-border/60 mb-3" />
 
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group/link"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate group-hover/link:underline underline-offset-2">
                          {member.email}
                        </span>
                      </a>
 
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group/link"
                        >
                          <Phone className="w-3.5 h-3.5 shrink-0" />
                          <span className="group-hover/link:underline underline-offset-2">
                            {member.phone}
                          </span>
                        </a>
                      )}
 
                      {fullAddress && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{fullAddress}</span>
                        </div>
                      )}
 
                      {member.additionalMessage && (
                        <div className="flex items-start gap-2 text-xs text-muted-foreground mt-1 pt-2 border-t border-border/50">
                          <Notebook className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <p className="line-clamp-2 italic">{member.additionalMessage}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
 
              <Pagination
                meta={paginationMeta}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
 
          {/* Delete confirmation */}
          <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove{' '}
                  <span className="font-semibold text-foreground">
                    {memberToDelete
                      ? `${memberToDelete.firstName} ${memberToDelete.lastName}`
                      : 'this member'}
                  </span>{' '}
                  from the council? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex gap-2 justify-end mt-2">
                <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90 rounded-lg"
                >
                  Remove Member
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
 
        </div>
    </div>
  );
}