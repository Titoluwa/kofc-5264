

export default function VolunteerRegisterForm({ formData, handleInputChange, handleSubmit, loading, formType }: Readonly<{ formData: any, handleInputChange: any, handleSubmit: any, loading: boolean, formType: string }>) {

  return (

    <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-8">

      <div className="mb-8">
        {/* <h3 className="font-serif text-2xl font-bold text-foreground mb-6">Personal Information</h3> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="volunteersToken" className="block text-sm font-semibold text-accent mb-2">Event Volunteer Token*</label>
            <input id="volunteersToken" type="text" name="volunteersToken" value={formData.volunteersToken} onChange={handleInputChange} required
              className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Common Fields */}
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

      {/* Address */}
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

      {/* Message */}
      <div className="mb-8">
        <label htmlFor="additionalMessage" className="block text-sm font-semibold text-foreground mb-2">Why do you want to volunteer for this event?</label>
        <textarea id="additionalMessage" name="additionalMessage" value={formData.additionalMessage} onChange={handleInputChange} placeholder="Tell us anything else we should know..." rows={4}
          className="w-full px-4 py-3 border border-border   bg-background text-foreground focus:outline-none focus:border-accent resize-none"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={loading}
        className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit Volunteer Registration'}
      </button>
    </form>
  )
}