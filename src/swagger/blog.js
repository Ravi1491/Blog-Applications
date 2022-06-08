

// get all users post
/**
 * @swagger
 * /basic/getblogs/{id}:
 *   get:
 *     summary: Returns the list of all basic users
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *     responses:
 *       200:
 *         description: The list of the basic users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       404:
 *         description: The users were not found
 */

// User create blog
/**
 * @swagger
 * /basic/create/{id}:
 *  post:
 *    description: Use to update user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: number
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/postblog'
 *    responses:
 *      '200':
 *        description: blog is succesfully updated
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */

// user can update blog
/**
 * @swagger
 * /basic/updateBlog/{id}:
 *  put:
 *    description: Use to update user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: number
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/postblog'
 *    responses:
 *      '200':
 *        description: blog is succesfully updated
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */

// user delete
/**
 * @swagger
 * /basic/deleteBlog/{id}:
 *  delete:
 *    description: Use to update user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema:
 *          type: number
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/deleteblog'
 *    responses:
 *      '200':
 *        description: Tech is succesfully updated
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */
