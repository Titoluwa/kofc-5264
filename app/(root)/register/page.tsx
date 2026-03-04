'use client';

import React, { useState } from "react";
import { Mail, MapPin, Users } from 'lucide-react';
import MemberRegisterForm from "@/components/memberRegisterForm";

export default function RegisterPage() {
  const [formType, setFormType] = useState('member');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    // parishName: '',
    knightYears: '',
    additionalMessage: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.street ?? ""} ${formData.city ?? ""} ${formData.state ?? ""} ${formData.zipcode ?? ""}`,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipcode: formData.zipcode,
            // parishName: formData.parishName,
            knightYears: formData.knightYears,
            additionalMessage: formData.additionalMessage
          }
        )
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          street: '',
          city: '',
          state: '',
          zipcode: '',
          // parishName: '',
          knightYears: '',
          additionalMessage: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-[#071A4D] to-[#0451A0] text-primary-foreground py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Join Our Community
          </h1>
          <p className="text-lg text-primary-foreground/90">
            Whether you're ready to become a knight, volunteer your time, or showcase your talent at Artarama, we're here to welcome you.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Form Type Selection */}
          <div className="mb-12 gap-4 items-center flex justify-center">
            <button
              onClick={() => {
                setFormType('create');
                setSubmitted(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all text-center ${formType === 'create'
                ? 'border-accent bg-accent/10'
                : 'border-border bg-card hover:border-accent'
                }`}
            >
              <div className="text-3xl mb-2 flex items-center justify-center text-accent"><Users /></div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-1">New Member</h3>
              <p className="text-sm text-muted-foreground">Join as a Knight</p>
            </button>
          </div>


          {/* Registration Form */}
          <MemberRegisterForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} loading={loading} formType={formType} />

          {/* Success Message */}
          {submitted && (
            <div className="mt-8 mb-3 p-6 bg-accent/10 border border-accent rounded-xl">
              <p className="text-accent font-semibold text-lg">
                ✓ Thank you for your registration! We'll be in touch soon.
              </p>
            </div>
          )}
          {/* <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-8">
            // {/* Common Fields
            <div className="mb-8">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-foreground mb-2">First Name *</label>
                  <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-foreground mb-2">Last Name *</label>
                  <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                  <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">Phone *</label>
                  <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            // {/* Address
            <div className="mb-8">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Address</h3>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label htmlFor="street" className="block text-sm font-semibold text-foreground mb-2">Street *</label>
                  <input id="street" type="text" name="street" value={formData.street} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-foreground mb-2">City *</label>
                  <input id="city" type="text" name="city" value={formData.city} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-foreground mb-2">State *</label>
                  <input id="state" type="text" name="state" value={formData.state} onChange={handleInputChange} required 
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label htmlFor="zipcode" className="block text-sm font-semibold text-foreground mb-2">ZIP Code *</label>
                  <input id="zipcode" type="text" name="zipcode" value={formData.zipcode} onChange={handleInputChange} required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            // {/* Member-Specific Fields 
            {/* {/* {formType === 'member' && ( 
              <div className="mb-8 pb-8 border-b border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Membership Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="parishName" className="block text-sm font-semibold text-foreground mb-2">Parish Name *</label>
                    <input id="parishName" type="text" name="parishName" value={formData.parishName} onChange={handleInputChange} required
                      className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                    />
                  </div> 
                  <div>
                    <label htmlFor="knightYears" className="block text-sm font-semibold text-foreground mb-2">Years as a Knight (if applicable)</label>
                    <input id="knightYears" type="text" name="knightYears" value={formData.knightYears} onChange={handleInputChange} placeholder="New member, 5 years, etc."
                      className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            {/* )} 

            // {/* Message
            <div className="mb-8">
              <label htmlFor="additionalMessage" className="block text-sm font-semibold text-foreground mb-2">Additional Message</label>
              <textarea id="additionalMessage" name="additionalMessage" value={formData.additionalMessage} onChange={handleInputChange} placeholder="Tell us anything else we should know..." rows={4}
                className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>

            // {/* Submit Button 
            <button type="submit" disabled={loading}
              className="w-full bg-accent text-accent-foreground py-3   font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form> */}

          {/* Contact Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Mail className="w-6 h-6 text-accent" />
              <div>
                <p className="font-semibold text-foreground">Email</p>
                <a href="mailto:info@kofc5264.ca" className="text-muted-foreground hover:text-accent">
                  info@kofc5264.ca
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin className="w-6 h-6 text-accent" />
              <div>
                <p className="font-semibold text-foreground">Location</p>
                <p className="text-muted-foreground">See us at our next event</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
