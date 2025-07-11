const path = require('path');
const fs = require('fs');
const { getAIResponse, generateChatTitle } = require('../services/aiService');
const messageService = require('../services/messageService');
const { asyncWrapper } = require('../middleware/errorMiddleware');
const { buildResponse } = require('../utils/responseHelper');
const chatService = require('../services/chatService');
const { ValidationError } = require('../utils/errorTypes');

const createMessage = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.params;
  const { content } = req.body;
  const file = req.file;

  await chatService.verifyOwnership(chatId, userId);

  let attachmentPath = null;
  let attachmentName = null;

  if (file) {
    attachmentPath = path.join(
      __dirname,
      '..',
      'uploads',
      chatId,
      file.filename
    );
    attachmentName = file.originalname;
  }

  const userMessage = await messageService.createMessage(
    chatId,
    'user',
    content,
    attachmentPath,
    attachmentName
  );

  try {
    const hasAttachment = !!file;
    const aiResponse = await getAIResponse(chatId, hasAttachment);

    const aiMessage = await messageService.createMessage(
      chatId,
      'model',
      aiResponse.answer
    );
    // const aiMessage = await messageService.createMessage(
    //   chatId,
    //   'model',
    //   'No response from AI'
    // );

    res.status(201).json(
      buildResponse(
        req,
        'CREATED',
        {
          userMessage,
          aiMessage
        },
        'Messages created successfully'
      )
    );
  } catch (error) {
    res.status(500).json(
      buildResponse(
        req,
        'ERROR',
        {
          userMessage
        },
        'Failed to get AI response'
      )
    );
  }
});

const createMessageWithAutoChat = asyncWrapper(async (req, res) => {
  const userId = req.user.id;
  const { content, chatId } = req.body;
  const file = req.file;

  if (!content || content.trim() === '') {
    throw new ValidationError('Message content is required');
  }

  const chat = await chatService.getOrCreateChatForMessage(
    userId,
    content,
    chatId
  );
  const targetChatId = chat.id;

  let attachmentPath = null;
  let attachmentName = null;

  if (file) {
    const tempFilePath = file.path;
    const targetDir = path.join(
      __dirname,
      '..',
      'uploads',
      targetChatId.toString()
    );

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFilePath = path.join(targetDir, file.filename);

    if (tempFilePath !== targetFilePath) {
      fs.renameSync(tempFilePath, targetFilePath);
    }

    attachmentPath = targetFilePath;
    attachmentName = file.originalname;
  }

  const userMessage = await messageService.createMessage(
    targetChatId,
    'user',
    content,
    attachmentPath,
    attachmentName
  );

  try {
    const hasAttachment = !!file;
    const aiResponse = await getAIResponse(targetChatId, hasAttachment);

    const aiMessage = await messageService.createMessage(
      targetChatId,
      'model',
      aiResponse.answer
    );

    let finalChatName = chat.name;
    if (!chatId) {
      try {
        const aiGeneratedTitle = await generateChatTitle(targetChatId);
        if (aiGeneratedTitle) {
          const updatedChat = await chatService.updateChatName(
            targetChatId,
            userId,
            aiGeneratedTitle
          );
          finalChatName = updatedChat.name;
        }
      } catch (titleError) {
        console.error('Failed to generate AI chat title:', titleError);
      }
    }

    res.status(201).json(
      buildResponse(
        req,
        'CREATED',
        {
          chatId: targetChatId,
          chatName: finalChatName,
          userMessage,
          aiMessage
        },
        'Messages created successfully'
      )
    );
  } catch (error) {
    res.status(500).json(
      buildResponse(
        req,
        'ERROR',
        {
          chatId: targetChatId,
          chatName: chat.name,
          userMessage
        },
        'Failed to get AI response'
      )
    );
  }
});

module.exports = {
  createMessage,
  createMessageWithAutoChat
};
