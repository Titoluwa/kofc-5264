"use client"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export default function SubscribeNewsletter() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<SubmitStatus>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')

        try {
        //   const response = await fetch('/api/newsletter/subscribe', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email }),
        //   })

        //   const data = await response.json()

        //   if (response.ok) {
            setStatus('success')
            setMessage('Successfully subscribed to our newsletter!')
            setEmail('') // Clear the input on success
        //   } else {
            // setStatus('error')
            // setMessage(data.error || 'Something went wrong. Please try again.')
        //   }
        } catch (error) {
        setStatus('error')
        setMessage('Network error. Please check your connection and try again.')
        console.error('Subscription error:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        // Reset status when user starts typing again
        if (status !== 'idle') {
            setStatus('idle')
            setMessage('')
        }
    }

    return (
        <section className="bg-primary/95 text-primary-foreground py-12 lg:py-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h2 className="font-serif text-3xl font-bold mb-4">
                Subscribe to Our Newsletter
                </h2>
                <p className="text-primary-foreground/90 mb-6 text-lg">
                    Get the latest news and updates delivered directly to your inbox.
                </p>
                
                <form className="flex gap-3 max-w-md mx-auto mb-4" onSubmit={handleSubmit}>
                    <input type="email" placeholder="Enter your email" required  value={email} onChange={handleChange} disabled={status === 'loading'}
                        className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground text-primary placeholder-primary/50 focus:outline-none focus:ring-2 focus:ring-accent" 
                    />
                    <button  type="submit"  className="bg-accent rounded-lg text-accent-foreground px-6 py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" disabled={status === 'loading'}>
                        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                    </button>
                </form>

                {/* Response message */}
                {message && (
                    <div className={`flex items-center justify-center gap-2 max-w-md mx-auto p-3 rounded ${
                        status === 'success' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
                    }`}>
                        {status === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                            ) : (
                            <AlertCircle className="w-5 h-5" />
                            )
                        }
                        <p className="text-sm">{message}</p>
                    </div>
                )}
            </div>
        </section>
    )
}