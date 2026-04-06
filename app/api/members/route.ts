import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendNewMemberNotification } from '@/lib/email';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const members = await prisma.member.findMany({
        orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(members);
    } catch (error) {
        console.error('Failed to fetch members:', error);
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { firstName, lastName, email, phone, address, street, city, state, zipcode, knightYears, additionalMessage } = await request.json();

        if (!email || !firstName || !lastName || !phone ) {
        return NextResponse.json({ error: 'Email, name and phone are required' }, { status: 400 });
        }

        // Check if subscriber already exists
        const existingMember = await prisma.member.findUnique({
        where: { email },
        });

        if (existingMember) {
        return NextResponse.json({message:"Member already exists", member: existingMember}, { status: 200 });
        }

        // Create new subscriber
        const member = await prisma.member.create({
        data: {
            email,
            firstName,
            lastName,
            phone,
            address,
            street,
            city,
            state,
            zipcode,
            knightYears,
            additionalMessage,
        },
        });
        const sendemail = await sendNewMemberNotification({
            firstName, lastName, email, phone, registeredAt: new Date(), notes: additionalMessage,
        });


        if(!sendemail){
            console.log(sendemail)
        }
        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        console.error('Failed to subscribe:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
