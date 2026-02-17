'use client';

import React, { useState, Suspense } from "react";
// import RegistrationFormContent from './register-form';
import { Mail, Phone, MapPin, Users } from 'lucide-react';

// export const metadata = {
//   title: 'Register | Our Lady of the Prairie, Council 5264',
//   description: 'Join our community as a new member, volunteer, or artist.',
// };

export default function RegisterPage() {
  const [formType, setFormType] = useState('member');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    parishName: '',
    yearsAsKnight: '',
    volunteerInterests: [],
    artistName: '',
    artForm: '',
    portfolio: '',
    experience: '',
    message: ''
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

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      volunteerInterests: prev.volunteerInterests.includes(value)
        ? prev.volunteerInterests.filter(i => i !== value)
        : [...prev.volunteerInterests, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, registrationType: formType })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          parishName: '',
          yearsAsKnight: '',
          volunteerInterests: [],
          artistName: '',
          artForm: '',
          portfolio: '',
          experience: '',
          message: ''
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
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
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
          {/* grid grid-cols-1 md:grid-cols-3 gap-4  */}
          <div className="mb-12 gap-4 items-center flex justify-center">
            <button
              onClick={() => {
                setFormType('member');
                setSubmitted(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all text-center ${formType === 'member'
                ? 'border-accent bg-accent/10'
                : 'border-border bg-card hover:border-accent'
                }`}
            >
              <div className="text-3xl mb-2 flex items-center justify-center text-accent"><Users/></div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-1">New Member</h3>
              <p className="text-sm text-muted-foreground">Join as a Knight</p>
            </button>

            {/* <button
              onClick={() => {
                setFormType('volunteer');
                setSubmitted(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all text-center ${formType === 'volunteer'
                ? 'border-accent bg-accent/10'
                : 'border-border bg-card hover:border-accent'
                }`}
            >
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-1">Volunteer</h3>
              <p className="text-sm text-muted-foreground">Help with programs & events</p>
            </button>

            <button
              onClick={() => {
                setFormType('artist');
                setSubmitted(false);
              }}
              className={`p-6 rounded-xl border-2 transition-all text-center ${formType === 'artist'
                ? 'border-accent bg-accent/10'
                : 'border-border bg-card hover:border-accent'
                }`}
            >
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-1">Artist</h3>
              <p className="text-sm text-muted-foreground">Exhibit at Artarama</p>
            </button> */}
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mb-8 p-6 bg-accent/10 border border-accent rounded-xl">
              <p className="text-accent font-semibold text-lg">
                ✓ Thank you for your registration! We'll be in touch soon.
              </p>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-8">
            {/* Common Fields */}
            <div className="mb-8">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-8">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Address</h3>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    maxLength={2}
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Member-Specific Fields */}
            {formType === 'member' && (
              <div className="mb-8 pb-8 border-b border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Membership Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Parish Name *</label>
                    <input
                      type="text"
                      name="parishName"
                      value={formData.parishName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Years as a Knight (if applicable)</label>
                    <input
                      type="text"
                      name="yearsAsKnight"
                      value={formData.yearsAsKnight}
                      onChange={handleInputChange}
                      placeholder="New member, 5 years, etc."
                      className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Volunteer-Specific Fields */}
            {formType === 'volunteer' && (
              <div className="mb-8 pb-8 border-b border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Volunteer Interests</h3>
                <p className="text-muted-foreground mb-4">What programs interest you? (Select all that apply)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Feed the Hungry', 'Homeless Care', 'Youth Programs', 'Faith Formation', 'Community Events', 'Artarama'].map(interest => (
                    <label key={interest} className="flex items-center gap-3 p-3 border border-border   hover:bg-background/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.volunteerInterests.includes(interest)}
                        onChange={() => handleCheckboxChange(interest)}
                        className="w-4 h-4 accent-accent"
                      />
                      <span className="text-foreground font-medium">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Artist-Specific Fields */}
            {formType === 'artist' && (
              <div className="mb-8 pb-8 border-b border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Artist Information</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Artist/Business Name *</label>
                    <input
                      type="text"
                      name="artistName"
                      value={formData.artistName}
                      onChange={handleInputChange}
                      required={formType === 'artist'}
                      className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Art Form/Medium *</label>
                    <input
                      type="text"
                      name="artForm"
                      value={formData.artForm}
                      onChange={handleInputChange}
                      placeholder="Painting, sculpture, jewelry, etc."
                      required={formType === 'artist'}
                      className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Portfolio/Website URL</label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Art Experience</label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Tell us about your artistic background and experience..."
                      rows={4}
                      className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-foreground mb-2">Additional Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us anything else we should know..."
                rows={4}
                className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground py-3   font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>

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
            {/* <div className="flex flex-col items-center gap-3">
              <Phone className="w-6 h-6 text-accent" />
              <div>
                <p className="font-semibold text-foreground">Phone</p>
                <a href="tel:+15551234567" className="text-muted-foreground hover:text-accent">
                  (555) 123-4567
                </a>
              </div>
            </div> */}
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
