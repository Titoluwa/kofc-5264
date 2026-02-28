// model Member {
//   id                Int      @id @default(autoincrement())
//   firstName         String
//   lastName          String
//   email             String   @unique
//   phone             String?
//   address           String?
//   street            String?
//   city              String?
//   state             String?
//   zipcode           String?
//   knightYears       String? 
//   additionalMessage String?  @db.Text
//   createdAt         DateTime @default(now())
//   updatedAt         DateTime @updatedAt
// }

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const member = await prisma.member.findUnique({
            where: { id: Number.parseInt(id) },
        });

        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error('Failed to fetch member:', error);
        return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
    }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { firstName, lastName, email, phone, address, street, city, state, zipcode, knightYears, additionalMessage } = await request.json();

        const member = await prisma.member.update({
        where: { id: Number.parseInt(id) },
        data: {
            firstName: firstName === undefined ? undefined : firstName,
            lastName: lastName === undefined ? undefined : lastName,
            email: email === undefined ? undefined : email, 
            phone: phone === undefined ? undefined : phone,
            address: address === undefined ? undefined : address,
            street: street === undefined ? undefined : street,
            city: city === undefined ? undefined : city,
            state: state === undefined ? undefined : state,
            zipcode: zipcode === undefined ? undefined : zipcode,
            knightYears: knightYears === undefined ? undefined : knightYears,
            additionalMessage: additionalMessage === undefined ? undefined : additionalMessage,
        },

        });

        return NextResponse.json(member);
    } catch (error) {
        console.error('Failed to update member:', error);
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.member.delete({
            where: { id: Number.parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete member:', error);
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}
