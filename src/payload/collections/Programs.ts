import { CollectionConfig } from 'payload';

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'startDate', 'status'],
    hidden: ({ user }) => user?.role !== 'admin', // Hidden from non-admins
  },
  access: {
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'moderator',
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Charity', value: 'charity' },
        { label: 'Education', value: 'education' },
        { label: 'Youth', value: 'youth' },
        { label: 'Community Service', value: 'community_service' },
        { label: 'Mentorship', value: 'mentorship' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerType: 'datetime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerType: 'datetime',
        },
      },
    },
    {
      name: 'coordinator',
      type: 'text',
      label: 'Program Coordinator',
    },
    {
      name: 'targetAudience',
      type: 'text',
      label: 'Target Audience',
    },
    {
      name: 'budget',
      type: 'number',
      label: 'Program Budget (USD)',
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'planned',
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
        { label: 'On Hold', value: 'on_hold' },
      ],
    },
  ],
};
