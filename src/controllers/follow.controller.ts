import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const follow = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { followingId } = req.body;
  try {
    const result = await prisma.userFollow.create({
      data: {
        followingId: Number(followingId),
        followerId: Number(id), // yang difollow
      },
    });
    res.status(201).json({
      message: 'Follow user success',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const unfollow = async (req: Request, res: Response) => {
  const {id} = req.params;
  const { followingId } = req.body;
  try {
    const followExists = await prisma.userFollow.findFirst({
      where: {
        followingId: Number(followingId),
        followerId: Number(id), // yang diunfollow
      },
    });

    if (!followExists) {
      res.status(404).json({ message: 'Follow relationship does not exist.' });
      return;
    }

    await prisma.userFollow.deleteMany({
      where: {
        followingId: Number(followingId),
        followerId: Number(id), // yang diunfollow
      },
    });
    res.status(201).json({
      message: 'Unfollow user success',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getFollowingUsers = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.userFollow.findMany({
      where: {
        followingId: Number(id) 
      },
      include: {
        follower: true
      }
    });
    res.status(200).json({
      message: 'GET all following SUCCESS',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getFollowerUsers = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.userFollow.findMany({
      where: {
        followerId: Number(id) 
      },
      include: {
        following: {
          include: {
            follower: true
          }
        },
        follower: true
      },
    });
    res.status(200).json({
      message: 'GET all followers SUCCESS',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
    });
  }
};

export const getSuggestionUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // ID user dari token

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Step 1: Users you follow but haven't followed you back
    const notFollowedBack = await prisma.user.findMany({
      where: {
        following: {
          some: {
            followerId: Number(userId),
          },
        },
        follower: {
          none: {
            followingId: Number(userId),
          },
        },
        isDeleted: 0,
      },
      take: 5
    });

    // Extract IDs from level 1 suggestions
    const level1Ids = notFollowedBack.map((user) => user.id);

    // Step 2: Users followed by the users you follow but haven't followed you
    const secondLevelSuggestions = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...level1Ids, Number(userId)], // Exclude level 1 IDs and current user
        },
        isDeleted: 0,
        follower: {
          none: {
            followingId: Number(userId),
          },
        },
        following: {
          some: {
            followerId: {
              in: (
                await prisma.userFollow.findMany({
                  where: { followerId: Number(userId) },
                  select: { followingId: true },
                })
              ).map((follow) => follow.followingId),
            },
          },
        },
      },
      take: 5,
    });

    // Extract IDs from level 2 suggestions
    const level2Ids = secondLevelSuggestions.map((user) => user.id);

    // Step 3: Users with the same following but haven't followed you
    const sameFollowingNotFollowed = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...level1Ids, ...level2Ids, Number(userId)], // Exclude level 1, level 2 IDs, and current user
        },
        isDeleted: 0,
        follower: {
          none: {
            followingId: Number(userId),
          },
        },
        following: {
          some: {
            followingId: {
              in: (
                await prisma.userFollow.findMany({
                  where: { followerId: Number(userId) },
                  select: { followingId: true },
                })
              ).map((follow) => follow.followingId),
            },
          },
        },
      },
      take: 5,
    });

    const level3Ids = sameFollowingNotFollowed.map((user) => user.id);

    const allRandomUsersOrderByMostFollowers = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...level1Ids, ...level2Ids, ...level3Ids, Number(userId)],
        },
        isDeleted: 0,
        follower: {
          none: {
            followingId: Number(userId),
          },
        },
      },
      orderBy: {
        follower: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Combine suggestions with prioritization
    const suggestions = [
      ...notFollowedBack,
      // ...secondLevelSuggestions,
      // ...sameFollowingNotFollowed,
      ...allRandomUsersOrderByMostFollowers
    ];

    res.status(200).json({
      message: 'GET user suggestions SUCCESS',
      data: suggestions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Oops! Something went wrong...',
      detail: error,
    });
  }
};
