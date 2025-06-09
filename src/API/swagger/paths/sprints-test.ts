/**
 * @swagger
 * /api/v1/{projectId}/sprints:
 *   post:
 *     summary: Create a new sprint
 *     tags: [Sprints]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSprintDto'
 *     responses:
 *       201:
 *         description: Sprint created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sprint created successfully
 *                 data:
 *                   $ref: '#/components/schemas/SprintResponseDto'
 *                 success:
 *                   type: boolean
 *                   example: true
 */
