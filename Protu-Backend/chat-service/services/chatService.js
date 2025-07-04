const { PrismaClient } = require('@prisma/client');
const { ulid } = require('ulid');
const prisma = new PrismaClient();

const {
  DatabaseError,
  ValidationError,
  NotFoundError,
  UnauthorizedError
} = require('../utils/errorTypes');

const createChat = async (userId, name) => {
  try {
    if (!name) {
      throw new ValidationError('Chat name is required');
    }

    const user = await prisma.user.findUnique({
      where: {
        publicId: userId
      },
      select: {
        publicId: true,
        id: true
      }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const chat = await prisma.chat.create({
      data: {
        id: ulid(),
        userId: userId,
        name: name
      }
    });

    return chat;
  } catch (error) {
    console.error('Error in createChat:', error);
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }

    if (error.code === 'P2003') {
      throw new ValidationError('Invalid user ID');
    }
    throw new DatabaseError('Failed to create chat');
  }
};

const getUserChats = async (userId, page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const chats = await prisma.chat.findMany({
      where: { userId: userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const totalChats = await prisma.chat.count({
      where: { userId: userId }
    });

    return {
      chats,
      pagination: {
        total: totalChats,
        page,
        limit,
        totalPages: Math.ceil(totalChats / limit)
      }
    };
  } catch (error) {
    throw new DatabaseError('Failed to fetch user chats');
  }
};

const verifyOwnership = async (chatId, userId) => {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId }
  });

  if (!chat) {
    throw new NotFoundError('Chat');
  }

  if (chat.userId !== userId) {
    throw new UnauthorizedError(
      'You do not have permission to access this chat'
    );
  }

  return chat;
};

const getSingleChat = async (chatId, page, limit, userId) => {
  try {
    const chat = await verifyOwnership(chatId, userId);

    const messages = await prisma.message.findMany({
      where: { chatId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        attachments: true
      }
    });

    const totalMessages = await prisma.message.count({
      where: { chatId }
    });

    return {
      chat,
      messages,
      pagination: {
        total: totalMessages,
        page,
        limit,
        totalPages: Math.ceil(totalMessages / limit)
      }
    };
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof UnauthorizedError)
      throw error;
    throw new DatabaseError('Failed to fetch chat');
  }
};

const deleteChat = async (chatId, userId) => {
  await verifyOwnership(chatId, userId);

  const result = await prisma.chat.delete({
    where: { id: chatId }
  });
  return result;
};

const updateChatName = async (chatId, userId, newName) => {
  try {
    if (!newName || newName.trim() === '') {
      throw new ValidationError('Chat name is required');
    }

    const trimmedName = newName.trim();
    if (trimmedName.length > 100) {
      throw new ValidationError('Chat name cannot exceed 100 characters');
    }

    await verifyOwnership(chatId, userId);

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        name: trimmedName,
        updatedAt: new Date()
      }
    });

    return updatedChat;
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof NotFoundError ||
      error instanceof UnauthorizedError
    ) {
      throw error;
    }
    throw new DatabaseError('Failed to update chat name');
  }
};

const generateChatNameFromMessage = messageContent => {
  if (!messageContent || messageContent.trim() === '') {
    return 'New Chat';
  }

  const words = messageContent.trim().split(/\s+/);
  const prefix = words.slice(0, 4).join(' ');

  if (prefix.length > 50) {
    return prefix.substring(0, 47) + '...';
  }

  return prefix || 'New Chat';
};

const getOrCreateChatForMessage = async (
  userId,
  messageContent,
  chatId = null
) => {
  try {
    if (chatId) {
      const chat = await verifyOwnership(chatId, userId);
      return chat;
    }

    const user = await prisma.user.findUnique({
      where: {
        publicId: userId
      },
      select: {
        publicId: true,
        id: true
      }
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const chatName = generateChatNameFromMessage(messageContent);

    const chat = await prisma.chat.create({
      data: {
        id: ulid(),
        userId: userId,
        name: chatName
      }
    });

    return chat;
  } catch (error) {
    console.error('Error in getOrCreateChatForMessage:', error);
    if (
      error instanceof ValidationError ||
      error instanceof NotFoundError ||
      error instanceof UnauthorizedError
    ) {
      throw error;
    }

    if (error.code === 'P2003') {
      throw new ValidationError('Invalid user ID');
    }
    throw new DatabaseError('Failed to get or create chat for message');
  }
};

module.exports = {
  createChat,
  getUserChats,
  deleteChat,
  getSingleChat,
  verifyOwnership,
  updateChatName,
  generateChatNameFromMessage,
  getOrCreateChatForMessage
};
