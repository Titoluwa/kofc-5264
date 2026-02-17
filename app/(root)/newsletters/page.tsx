'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Mail, Calendar, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import SubscribeNewsletter from '@/components/SubscribeNewsletter'

interface Newsletter {
    id: string
    title: string
    subtitle: string
    publishDate: string
    excerpt: string
    image?: string
    category: 'General' | 'Events' | 'Announcements' | 'Programs' | 'Charity'
}

const newsletters: Newsletter[] = [
    {
        id: '1',
        title: 'Spring into Service',
        subtitle: 'April 2025 Newsletter',
        publishDate: '2025-04-01',
        excerpt: 'Join us for an exciting spring season filled with charity drives, faith formation opportunities, and community fellowship events.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
        category: 'Programs'
    },
    {
        id: '2',
        title: 'Charity Spotlight: Our Impact',
        subtitle: 'March 2025 Newsletter',
        publishDate: '2025-03-01',
        excerpt: 'Discover how our members donated over $50,000 and 500 volunteer hours to local charities this quarter.',
        image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
        category: 'Charity'
    },
    {
        id: '3',
        title: 'Artarama 2025 Celebrates Local Artists',
        subtitle: 'February 2025 Newsletter',
        publishDate: '2025-02-15',
        excerpt: 'Our annual Artarama event showcases 150+ local artists. Learn how to participate and support the arts community.',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
        category: 'Events'
    },
//     {
//         id: '4',
//         title: 'Winter Blessings: Reflections on Leadership',
//         subtitle: 'January 2025 Newsletter',
//         publishDate: '2025-01-10',
//         excerpt: 'Grand Knight\'s message on the upcoming year, officer installations, and new initiatives for our council.',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
//         category: 'General'
//     },
//     {
//         id: '5',
//         title: 'Holiday Giving Campaign Success',
//         subtitle: 'December 2024 Newsletter',
//         publishDate: '2024-12-20',
//         excerpt: 'Thank you to all members who participated in our holiday food drive, toy distribution, and community outreach programs.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Announcements'
//     },
//     {
//         id: '6',
//         title: 'Fall Programs and Fellowship Roundup',
//         subtitle: 'November 2024 Newsletter',
//         publishDate: '2024-11-01',
//         excerpt: 'Recap of our fall events including the barbeque, family fun night, and upcoming Thanksgiving service projects.',
//         image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
//         category: 'Programs'
//     },
//     {
//         id: '7',
//         title: 'Member Spotlight: Stories of Service',
//         subtitle: 'October 2024 Newsletter',
//         publishDate: '2024-10-15',
//         excerpt: 'Meet three exceptional members who exemplify our principles of charity, unity, fraternity, and patriotism.',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
//         category: 'General'
//     },
//     {
//         id: '8',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs'
//     },
//     {
//         id: '9',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs'    
//     },
//     {
//         id: "10",
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '11',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '12',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '13',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '14',
//         title: 'Fall Programs and Fellowship Roundup',
//         subtitle: 'November 2024 Newsletter',
//         publishDate: '2024-11-01',
//         excerpt: 'Recap of our fall events including the barbeque, family fun night, and upcoming Thanksgiving service projects.',
//         image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
//         category: 'Programs'
//     },
//     {
//         id: '15',
//         title: 'Member Spotlight: Stories of Service',
//         subtitle: 'October 2024 Newsletter',
//         publishDate: '2024-10-15',
//         excerpt: 'Meet three exceptional members who exemplify our principles of charity, unity, fraternity, and patriotism.',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
//         category: 'General'
//     },
//     {
//         id: '16',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs'
//     },
//     {
//         id: '17',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs'    
//     },
//     {
//         id: "18",
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '19',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '20',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '21',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '22',
//         title: 'Fall Programs and Fellowship Roundup',
//         subtitle: 'November 2024 Newsletter',
//         publishDate: '2024-11-01',
//         excerpt: 'Recap of our fall events including the barbeque, family fun night, and upcoming Thanksgiving service projects.',
//         image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
//         category: 'Programs'
//     },
//     {
//         id: '23',
//         title: 'Member Spotlight: Stories of Service',
//         subtitle: 'October 2024 Newsletter',
//         publishDate: '2024-10-15',
//         excerpt: 'Meet three exceptional members who exemplify our principles of charity, unity, fraternity, and patriotism.',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
//         category: 'General'
//     },
//     {
//         id: '24',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs'
//     },
//     {
//         id: '25',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs'    
//     },
//     {
//         id: "26",
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '27',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '28',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '29',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '30',
//         title: 'Fall Programs and Fellowship Roundup',
//         subtitle: 'November 2024 Newsletter',
//         publishDate: '2024-11-01',
//         excerpt: 'Recap of our fall events including the barbeque, family fun night, and upcoming Thanksgiving service projects.',
//         image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop',
//         category: 'Programs'
//     },
//     {
//         id: '31',
//         title: 'Member Spotlight: Stories of Service',
//         subtitle: 'October 2024 Newsletter',
//         publishDate: '2024-10-15',
//         excerpt: 'Meet three exceptional members who exemplify our principles of charity, unity, fraternity, and patriotism.',
//         image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
//         category: 'General'
//     },
//     {
//         id: '32',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs'
//     },
//     {
//         id: '33',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs'    
//     },
//     {
//         id: "34",
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '35',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '36',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
//     {
//         id: '37',
//         title: 'Summer Camp and Youth Programs',
//         subtitle: 'August 2024 Newsletter',
//         publishDate: '2024-08-01',
//         excerpt: 'Exciting opportunities for youth development, leadership training, and faith-based summer activities.',
//         image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=400&h=250&fit=crop',
//         category: 'Programs' 
//     },
]

// const newsletters: Newsletter[] = [  
// ]

const categoryColors = {
    General: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30' },
    Events: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' },
    Announcements: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30' },
    Programs: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/30' },
    Charity: { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/30' }
}

const ITEMS_PER_PAGE = 6

export default function NewslettersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const filteredNewsletters = useMemo(() => {
        return newsletters.filter(newsletter => {
            const matchesSearch = newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                newsletter.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = !selectedCategory || newsletter.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [searchTerm, selectedCategory])

    // Pagination calculations
    const totalPages = Math.ceil(filteredNewsletters.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedNewsletters = filteredNewsletters.slice(startIndex, endIndex)

    // Reset to page 1 when filters change
    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
    }

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const categories = Array.from(new Set(newsletters.map(n => n.category)))

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i)
                }
                pageNumbers.push('...')
                pageNumbers.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1)
                pageNumbers.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i)
                }
            } else {
                pageNumbers.push(1)
                pageNumbers.push('...')
                pageNumbers.push(currentPage - 1)
                pageNumbers.push(currentPage)
                pageNumbers.push(currentPage + 1)
                pageNumbers.push('...')
                pageNumbers.push(totalPages)
            }
        }

        return pageNumbers
    }

    return (
        <main>
            {/* Hero Section */}
            <section className="bg-primary text-primary-foreground py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-balance">
                        Our Newsletters
                    </h1>
                    <p className="text-lg text-primary-foreground/90">
                        Stay informed with updates from Knights of Columbus - Our Lady of the Prairie, Council 5264. Read the latest news, upcoming events, and inspiring stories from our community.
                    </p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="bg-background py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search newsletters..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleCategoryChange(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === null
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    selectedCategory === category
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <p className="text-muted-foreground text-sm mt-4">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredNewsletters.length)} of {filteredNewsletters.length} newsletters
                    </p>
                </div>
            </section>

            {/* Newsletters Grid */}
            <section className="bg-background py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {paginatedNewsletters.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {paginatedNewsletters.map(newsletter => {
                                    const categoryColor = categoryColors[newsletter.category]
                                    const date = new Date(newsletter.publishDate)
                                    const formattedDate = date.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })

                                    return (
                                        <Link
                                            key={newsletter.id}
                                            href={`/newsletters/${newsletter.id}`}
                                            className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-accent flex flex-col"
                                        >
                                            {/* Newsletter Image */}
                                            {newsletter.image && (
                                                <div className="w-full h-48 bg-muted overflow-hidden">
                                                    <img
                                                        src={newsletter.image || "/placeholder.svg"}
                                                        alt={newsletter.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}

                                            {/* Newsletter Content */}
                                            <div className="flex flex-col flex-1 p-6">
                                                {/* Category Badge */}
                                                <div className={`inline-block w-fit mb-3 px-3 py-1 rounded-full text-xs font-semibold border ${categoryColor.bg} ${categoryColor.text} ${categoryColor.border}`}>
                                                    {newsletter.category}
                                                </div>

                                                {/* Title */}
                                                <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                                    {newsletter.title}
                                                </h3>

                                                {/* Subtitle */}
                                                <p className="text-sm text-muted-foreground mb-3">
                                                    {newsletter.subtitle}
                                                </p>

                                                {/* Excerpt */}
                                                <p className="text-foreground text-sm mb-4 flex-1 line-clamp-2">
                                                    {newsletter.excerpt}
                                                </p>

                                                {/* Date and CTA */}
                                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="w-4 h-4" />
                                                        {formattedDate}
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex gap-2">
                                        {getPageNumbers().map((pageNum, index) => (
                                            pageNum === '...' ? (
                                                <span
                                                    key={`ellipsis-${index}`}
                                                    className="px-4 py-2 text-muted-foreground"
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum as number)}
                                                    className={`min-w-[40px] px-4 py-2 rounded-lg border transition-colors ${
                                                        currentPage === pageNum
                                                            ? 'bg-primary text-primary-foreground border-primary'
                                                            : 'bg-card border-border hover:bg-muted'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                                No newsletters found
                            </h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search or filter criteria.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <SubscribeNewsletter />
        </main>
    )
}