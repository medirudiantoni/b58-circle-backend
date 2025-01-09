import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchUser = async (req: Request, res: Response) => {
    const { query } = req.query;
    const userId = req.user?.id;

    const searchQuery = query ? (query as string) : "";
    try {
        const result = await prisma.user.findMany({
            where: {
                OR: [
                    { fullname: { contains: searchQuery, mode: 'insensitive' } },
                    { username: { contains: searchQuery, mode: 'insensitive' } },
                    { email: { contains: searchQuery, mode: 'insensitive' } },
                    { bio: { contains: searchQuery, mode: 'insensitive' } },
                ],
                NOT: [
                    {id: Number(userId)}
                ]
            },
            orderBy: {
                follower: {
                    _count: 'desc'
                }
            },
            include: {
                follower: {
                    include: {
                        following: true
                    }
                }
            },
        });

        if(searchQuery.length < 1){
            res.status(200).json({
                message: "Please enter the Search keyword!"
            });
            return;
        }
        res.status(200).json({
            message: "Find user success",
            count: result.length,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            message: 'Oops!, There is something wrong...',
            detail: error
        })
    }
}