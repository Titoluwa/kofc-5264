'use client'

import { Users2, HandHeart } from 'lucide-react'
import { Event } from '@/lib/constants'
import EventRegisterForm from '@/components/eventRegisterForm'
import VolunteerRegisterForm from '@/components/volunterRegisterForm'
import VolunteerSidebar from '@/components/p-events/voluntneerSidebar'

type Tab = 'register' | 'volunteer'

interface FormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    city: string
    state: string
    zipcode: string
    additionalMessage: string
    shifts?: string[]
}

interface EventFormPanelProps {
    program: Event
    activeTab: Tab
    formData: FormData
    formLoading: boolean
    formSuccess: boolean
    formError: string
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    onSubmit: (e: React.SubmitEvent) => void
    onBackToDetails: () => void
    onAlsoVolunteer: () => void
}

export default function EventFormPanel({
    program,
    activeTab,
    formData,
    formLoading,
    formSuccess,
    formError,
    onInputChange,
    onSubmit,
    onBackToDetails,
    onAlsoVolunteer,
}: Readonly<EventFormPanelProps>) {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                {activeTab === 'register' ? 'Event Registration' : 'Volunteer Sign-up'}
                </h2>
                <p className="text-muted-foreground text-sm">
                {activeTab === 'register'
                    ? `Complete the form below to register for "${program.name}".`
                    : `Complete the form below to volunteer for "${program.name}".`}
                </p>
            </div>

            {activeTab === 'volunteer' ? (
                <div className="flex flex-col-reverse gap-6 lg:flex-row lg:items-start lg:gap-8">
                    <div className="w-full lg:w-64 lg:shrink-0">
                        <VolunteerSidebar eventId={program.id} refreshKey={formSuccess} />
                    </div>

                    <div className="flex-1 min-w-0">
                        {formSuccess ? (
                        <SuccessBanner
                            activeTab={activeTab}
                            allowVolunteer={!!program.allowVolunteer}
                            onBackToDetails={onBackToDetails}
                            onAlsoVolunteer={onAlsoVolunteer}
                        />
                        ) : (
                        <>
                            {formError && <ErrorBanner message={formError} />}
                            <VolunteerRegisterForm
                            formData={formData}
                            handleInputChange={onInputChange}
                            handleSubmit={onSubmit}
                            loading={formLoading}
                            formType="volunteer"
                            availableShifts={program.volunteersShifts || []}
                            />
                        </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-2xl space-y-4">
                    {formSuccess ? (
                        <SuccessBanner
                        activeTab={activeTab}
                        allowVolunteer={!!program.allowVolunteer}
                        onBackToDetails={onBackToDetails}
                        onAlsoVolunteer={onAlsoVolunteer}
                        />
                    ) : (
                        <>
                        {formError && <ErrorBanner message={formError} />}
                        <EventRegisterForm
                            formData={formData}
                            handleInputChange={onInputChange}
                            handleSubmit={onSubmit}
                            loading={formLoading}
                            formType="register"
                        />
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

function SuccessBanner({
    activeTab,
    allowVolunteer,
    onBackToDetails,
    onAlsoVolunteer,
}: Readonly<{
    activeTab: Tab
    allowVolunteer: boolean
    onBackToDetails: () => void
    onAlsoVolunteer: () => void
}>) {
    return (
        <div className="rounded-2xl border border-border bg-card p-10 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                {activeTab === 'register' ? 
                    <Users2 className="w-7 h-7 text-emerald-600" />
                : 
                    <HandHeart className="w-7 h-7 text-emerald-600" />
                }
            </div>
            <div className="space-y-1">
                <p className="font-semibold text-lg text-foreground">
                    {activeTab === 'register' ? 'Registration Received!' : 'Volunteer Sign-up Received!'}
                </p>
                <p className="text-muted-foreground text-sm">
                    Thank you! We'll be in touch with next steps.
                </p>
            </div>
            <div className="flex gap-3 pt-2">
                <button onClick={onBackToDetails} className="px-5 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors" >
                    Back to Details
                </button>
                {activeTab === 'register' && allowVolunteer && (
                    <button onClick={onAlsoVolunteer} className="px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity" >
                        Also Volunteer
                    </button>
                )}
            </div>
        </div>
    )
}

function ErrorBanner({ message }: Readonly<{ message: string }>) {
    return (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 mb-3">
            {message}
        </div>
    )
}